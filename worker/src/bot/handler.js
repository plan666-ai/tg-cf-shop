// worker/src/bot/handler.js - TG 消息处理
import { Database } from '../utils/db.js';
import { sendMessage, editMessage, answerCallback, answerPreCheckout } from '../utils/tg.js';
import { mainMenuKeyboard, categoryKeyboard, productKeyboard, productDetailKeyboard, paymentMethodKeyboard } from './keyboards.js';
import { handleStart, handleMainMenu, handleMyOrders, handleOrderDetail, handleInvite, handleSupport, handleDeposit } from './commands.js';
import { createOrder, processPayment, deliverOrder } from '../services/payment.js';

export async function handleBotUpdate(request, env) {
  const update = await request.json();

  try {
    // 处理消息
    if (update.message) {
      await handleMessage(update.message, env);
    }

    // 处理按钮回调
    if (update.callback_query) {
      await handleCallback(update.callback_query, env);
    }

    // 处理预支付验证
    if (update.pre_checkout_query) {
      await handlePreCheckout(update.pre_checkout_query, env);
    }

    // 处理支付成功
    if (update.message?.successful_payment) {
      await handleSuccessfulPayment(update.message, env);
    }
  } catch (error) {
    console.error('Bot update error:', error);
  }

  return new Response('OK');
}

async function handleMessage(message, env) {
  const db = new Database(env.DB);
  const chatId = message.chat.id;
  const userId = String(message.from.id);
  const text = message.text;

  // 确保用户存在
  const user = await db.ensureUser(userId, message.from.username, message.from.first_name);

  // 处理命令
  if (text === '/start') {
    // 检查是否有邀请码
    const parts = message.text.split(' ');
    const inviteCode = parts.length > 1 ? parts[1] : null;
    await handleStart(db, env, chatId, user, inviteCode);
    return;
  }

  if (text === '/help') {
    await sendMessage(env, chatId,
      '📖 <b>使用帮助</b>\n\n' +
      '/start - 开始使用\n' +
      '/shop - 浏览商品\n' +
      '/orders - 我的订单\n' +
      '/invite - 邀请好友\n' +
      '/balance - 查看余额\n' +
      '/help - 帮助信息',
      mainMenuKeyboard()
    );
    return;
  }

  if (text === '/shop') {
    await showCategories(db, env, chatId);
    return;
  }

  if (text === '/orders') {
    await handleMyOrders(db, env, chatId, null, userId);
    return;
  }

  if (text === '/invite') {
    await handleInvite(db, env, chatId, null, user);
    return;
  }

  if (text === '/balance') {
    await sendMessage(env, chatId,
      `💰 <b>账户余额</b>\n\n当前余额: ¥${(user.balance / 100).toFixed(2)}`,
      { inline_keyboard: [[{ text: '💰 充值', callback_data: 'deposit' }], [{ text: '🔙 返回主菜单', callback_data: 'main_menu' }]] }
    );
    return;
  }

  // 未知命令
  await sendMessage(env, chatId, '❓ 未知命令，请使用 /help 查看帮助');
}

async function handleCallback(callback, env) {
  const db = new Database(env.DB);
  const { data, message } = callback;
  const chatId = message.chat.id;
  const messageId = message.message_id;
  const userId = String(callback.from.id);
  const user = await db.ensureUser(userId, callback.from.username, callback.from.first_name);

  try {
    // 主菜单
    if (data === 'main_menu') {
      await handleMainMenu(db, env, chatId, messageId);
    }

    // 商店
    else if (data === 'shop') {
      await showCategories(db, env, chatId, messageId);
    }

    // 分类
    else if (data.startsWith('category_')) {
      const categoryId = data.split('_')[1];
      await showProducts(db, env, chatId, messageId, categoryId);
    }

    // 商品详情
    else if (data.startsWith('product_')) {
      const productId = data.split('_')[1];
      await showProductDetail(db, env, chatId, messageId, productId);
    }

    // 购买 - 选择支付方式
    else if (data.startsWith('buy_')) {
      const productId = data.split('_')[1];
      await showPaymentMethods(db, env, chatId, messageId, productId, 1);
    }

    // 选择数量
    else if (data.startsWith('qty_')) {
      const [, productId, quantity] = data.split('_');
      await showPaymentMethods(db, env, chatId, messageId, productId, parseInt(quantity));
    }

    // 支付方式选择
    else if (data.startsWith('pay_')) {
      const [, method, productId, quantity] = data.split('_');
      await processPurchase(db, env, chatId, messageId, user, productId, parseInt(quantity), method);
    }

    // 我的订单
    else if (data === 'my_orders') {
      await handleMyOrders(db, env, chatId, messageId, userId);
    }

    // 订单详情
    else if (data.startsWith('order_')) {
      const orderNo = data.replace('order_', '');
      await handleOrderDetail(db, env, chatId, messageId, orderNo);
    }

    // 邀请好友
    else if (data === 'invite') {
      await handleInvite(db, env, chatId, messageId, user);
    }

    // 联系客服
    else if (data === 'support') {
      await handleSupport(db, env, chatId, messageId);
    }

    // 充值
    else if (data === 'deposit') {
      await handleDeposit(db, env, chatId, messageId, user);
    }

    // 充值金额
    else if (data.startsWith('deposit_')) {
      const amount = parseInt(data.split('_')[1]);
      await processDeposit(env, chatId, messageId, user, amount);
    }

    // 售罄提示
    else if (data.startsWith('soldout_')) {
      await answerCallback(env, callback.id, '❌ 该商品已售罄');
    }
  } catch (error) {
    console.error('Callback error:', error);
    await answerCallback(env, callback.id, '❌ 操作失败，请重试');
  }

  await answerCallback(env, callback.id);
}

async function showCategories(db, env, chatId, messageId = null) {
  const categories = await db.getCategories();

  if (categories.length === 0) {
    const text = '🛒 暂无商品分类';
    const keyboard = { inline_keyboard: [[{ text: '🔙 返回主菜单', callback_data: 'main_menu' }]] };

    if (messageId) {
      await editMessage(env, chatId, messageId, text, keyboard);
    } else {
      await sendMessage(env, chatId, text, keyboard);
    }
    return;
  }

  const text = '🛒 <b>请选择分类</b>';
  const keyboard = categoryKeyboard(categories);

  if (messageId) {
    await editMessage(env, chatId, messageId, text, keyboard);
  } else {
    await sendMessage(env, chatId, text, keyboard);
  }
}

async function showProducts(db, env, chatId, messageId, categoryId) {
  const products = await db.getActiveProducts(categoryId);
  const category = await db.getCategory(categoryId);

  if (products.length === 0) {
    await editMessage(env, chatId, messageId,
      `${category?.icon || '📦'} ${category?.name || '商品'}\n\n暂无商品`,
      { inline_keyboard: [[{ text: '🔙 返回分类', callback_data: 'shop' }]] }
    );
    return;
  }

  const text = `${category?.icon || '📦'} <b>${category?.name || '商品列表'}</b>\n\n请选择商品：`;
  await editMessage(env, chatId, messageId, text, productKeyboard(products));
}

async function showProductDetail(db, env, chatId, messageId, productId) {
  const product = await db.getProduct(productId);

  if (!product) {
    await editMessage(env, chatId, messageId, '❌ 商品不存在',
      { inline_keyboard: [[{ text: '🔙 返回', callback_data: 'shop' }]] }
    );
    return;
  }

  const price = (product.price / 100).toFixed(2);
  const originalPrice = product.original_price ? `~~¥${(product.original_price / 100).toFixed(2)}~~ ` : '';
  const stockInfo = product.stock_count > 0 ? `库存: ${product.stock_count}` : '❌ 已售罄';

  let text = '📦 <b>商品详情</b>\n\n';
  text += `名称: ${product.name}\n`;
  text += `价格: ${originalPrice}¥${price}\n`;
  text += `${stockInfo}\n`;
  if (product.description) {
    text += `\n描述: ${product.description}`;
  }

  await editMessage(env, chatId, messageId, text, productDetailKeyboard(product));
}

async function showPaymentMethods(db, env, chatId, messageId, productId, quantity) {
  const product = await db.getProduct(productId);

  if (!product || product.stock_count < quantity) {
    await editMessage(env, chatId, messageId, '❌ 商品库存不足',
      { inline_keyboard: [[{ text: '🔙 返回', callback_data: `product_${productId}` }]] }
    );
    return;
  }

  const totalAmount = (product.price * quantity / 100).toFixed(2);
  let text = '💳 <b>选择支付方式</b>\n\n';
  text += `商品: ${product.name}\n`;
  text += `数量: ${quantity}\n`;
  text += `总价: ¥${totalAmount}\n\n`;
  text += '请选择支付方式:';

  await editMessage(env, chatId, messageId, text, paymentMethodKeyboard(productId, quantity));
}

async function processPurchase(db, env, chatId, messageId, user, productId, quantity, method) {
  const product = await db.getProduct(productId);

  if (!product || product.stock_count < quantity) {
    await editMessage(env, chatId, messageId, '❌ 商品库存不足',
      { inline_keyboard: [[{ text: '🔙 返回', callback_data: 'shop' }]] }
    );
    return;
  }

  const amount = product.price * quantity;

  // 余额支付
  if (method === 'balance') {
    if (user.balance < amount) {
      await editMessage(env, chatId, messageId,
        `❌ 余额不足\n\n需要: ¥${(amount / 100).toFixed(2)}\n当前: ¥${(user.balance / 100).toFixed(2)}`,
        { inline_keyboard: [[{ text: '💰 充值', callback_data: 'deposit' }], [{ text: '🔙 返回', callback_data: `product_${productId}` }]] }
      );
      return;
    }

    // 创建订单
    const order = await db.createOrder(user.user_id, productId, quantity, amount, product.price, product.name);

    // 扣除余额
    await db.deductBalance(user.user_id, amount);

    // 发货
    await deliverOrder(db, env, order.id, product, quantity);

    await editMessage(env, chatId, messageId,
      `✅ 购买成功！\n\n订单号: <code>${order.order_no}</code>\n\n请查看订单获取卡密信息。`,
      { inline_keyboard: [[{ text: '📋 查看订单', callback_data: `order_${order.order_no}` }], [{ text: '🔙 返回主菜单', callback_data: 'main_menu' }]] }
    );
  }

  // Stars 支付
  else if (method === 'stars') {
    // 创建待支付订单
    const order = await db.createOrder(user.user_id, productId, quantity, amount, product.price, product.name);

    // 发送 Stars 发票
    await sendInvoice(env, chatId, product, `order_${order.id}_${quantity}`);
  }
}

async function processDeposit(env, chatId, messageId, user, amount) {
  // 发送 Stars 发票用于充值
  await editMessage(env, chatId, messageId,
    `💰 充值 ¥${(amount / 100).toFixed(2)}\n\n请完成支付：`,
    { inline_keyboard: [[{ text: '🔙 返回', callback_data: 'deposit' }]] }
  );
}

async function handlePreCheckout(preCheckout, env) {
  const db = new Database(env.DB);
  const payload = preCheckout.invoice_payload;

  if (payload.startsWith('order_')) {
    const [, orderId, quantity] = payload.split('_');
    const order = await db.getOrder(parseInt(orderId));

    if (!order || order.status !== 'pending') {
      await answerPreCheckout(env, preCheckout.id, false, '订单已过期');
      return;
    }

    await answerPreCheckout(env, preCheckout.id, true);
  } else {
    await answerPreCheckout(env, preCheckout.id, false, '无效的支付');
  }
}

async function handleSuccessfulPayment(message, env) {
  const db = new Database(env.DB);
  const payment = message.successful_payment;
  const payload = payment.invoice_payload;
  const userId = String(message.from.id);

  if (payload.startsWith('order_')) {
    const [, orderId, quantity] = payload.split('_');
    const order = await db.getOrder(parseInt(orderId));

    if (order && order.status === 'pending') {
      // 更新订单状态
      await db.updateOrderStatus(order.id, 'paid');

      // 获取商品信息
      const product = await db.getProduct(order.product_id);

      // 发货
      await deliverOrder(db, env, order.id, product, parseInt(quantity));

      // 处理佣金
      const user = await db.getUser(userId);
      if (user && user.invited_by) {
        const commissionRate = parseInt(await db.getSetting('commission_rate') || '10');
        await db.createCommission(user.invited_by, userId, order.id, order.amount, commissionRate);
      }

      // 通知用户
      await sendMessage(env, message.chat.id,
        `✅ 支付成功！\n\n订单号: <code>${order.order_no}</code>\n\n请查看订单获取卡密信息。`,
        { inline_keyboard: [[{ text: '📋 查看订单', callback_data: `order_${order.order_no}` }]] }
      );
    }
  }
}