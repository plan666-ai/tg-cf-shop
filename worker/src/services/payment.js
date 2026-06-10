// worker/src/services/payment.js - 支付服务
import { sendMessage } from '../utils/tg.js';

export async function createOrder(db, userId, productId, quantity) {
  const product = await db.getProduct(productId);

  if (!product || !product.is_active) {
    throw new Error('商品不存在或已下架');
  }

  if (product.stock_count < quantity) {
    throw new Error('库存不足');
  }

  const amount = product.price * quantity;
  const order = await db.createOrder(userId, productId, quantity, amount, product.price, product.name);

  return order;
}

export async function processPayment(db, env, orderId, paymentMethod, paymentId = null) {
  const order = await db.getOrder(orderId);

  if (!order) {
    throw new Error('订单不存在');
  }

  if (order.status !== 'pending') {
    throw new Error('订单状态异常');
  }

  // 更新支付状态
  await db.updateOrderStatus(orderId, 'paid');

  // 如果有支付ID，记录
  if (paymentId) {
    // 可以添加支付ID到订单记录
  }

  return order;
}

export async function deliverOrder(db, env, orderId, product, quantity) {
  const order = await db.getOrder(orderId);

  if (!order) {
    throw new Error('订单不存在');
  }

  // 获取可用卡密
  const cards = await db.getAvailableCards(product.id, quantity);

  if (cards.length < quantity) {
    // 库存不足，标记订单为异常
    await db.updateOrderStatus(orderId, 'failed');
    throw new Error('卡密库存不足');
  }

  // 标记卡密为已售
  const cardContents = [];
  for (const card of cards) {
    await db.markCardSold(card.id, orderId);
    cardContents.push(card.content);
  }

  // 更新订单发货信息
  const deliveryContent = cardContents.join('\n');
  await db.deliverOrder(orderId, deliveryContent);

  // 更新商品销量
  await db.incrementSales(product.id, quantity);

  // 更新用户消费成功计次（只有发货成功才算有效次数）
  await db.updateTotalSpent(order.user_id, order.amount);

  // 通知用户
  const user = await db.getUser(order.user_id);
  if (user) {
    let message = `✅ <b>发货成功</b>\n\n`;
    message += `订单号: <code>${order.order_no}</code>\n`;
    message += `商品: ${product.name}\n`;
    message += `数量: ${quantity}\n\n`;
    message += `🔑 <b>卡密信息:</b>\n<code>${deliveryContent}</code>\n\n`;
    message += `💡 请妥善保管卡密信息`;

    await sendMessage(env, user.user_id, message, {
      inline_keyboard: [[{ text: '📋 查看订单', callback_data: `order_${order.order_no}` }]]
    });
  }

  return deliveryContent;
}

export async function refundOrder(db, env, orderId) {
  const order = await db.getOrder(orderId);

  if (!order) {
    throw new Error('订单不存在');
  }

  if (order.status !== 'paid' && order.status !== 'delivered') {
    throw new Error('订单状态不支持退款');
  }

  // 如果是余额支付，退还余额
  if (order.payment_method === 'balance') {
    await db.updateUserBalance(order.user_id, order.amount);
  }

  // 更新订单状态
  await db.updateOrderStatus(orderId, 'refunded');

  // 通知用户
  const user = await db.getUser(order.user_id);
  if (user) {
    await sendMessage(env, user.user_id,
      `↩️ <b>订单已退款</b>\n\n订单号: <code>${order.order_no}</code>\n退款金额: ¥${Number(order.amount).toFixed(2)}`,
      { inline_keyboard: [[{ text: '🔙 返回主菜单', callback_data: 'main_menu' }]] }
    );
  }

  return order;
}
