// worker/src/bot/handler.js - TG 消息处理
import { Database } from '../utils/db.js';
import { sendMessage, editMessage, editMessageCaption, answerCallback, answerPreCheckout, sendInvoice, sendPhoto } from '../utils/tg.js';
import { mainMenuKeyboard, categoryKeyboard, productKeyboard, productDetailKeyboard, paymentMethodKeyboard, bottomKeyboard } from './keyboards.js';
import { handleStart, handleMainMenu, handleMyOrders, handleHistoryOrders, handleOrderDetail, handleInvite, handleSupport, handleDeposit } from './commands.js';
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
  await db.ensureSuccessfulCountColumn();
  const chatId = message.chat.id;
  const userId = String(message.from.id);
  const text = message.text;

  // 确保用户存在
  const user = await db.ensureUser(userId, message.from.username, message.from.first_name);

  // 处理命令
  if (text && text.startsWith('/start')) {
    // 检查是否有邀请码
    const parts = text.split(' ');
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
      '/redeem - 充值卡兑换\n' +
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
      `💰 <b>账户余额</b>\n\n当前余额: ¥${Number(user.balance).toFixed(2)}`,
      { inline_keyboard: [[{ text: '💰 充值', callback_data: 'deposit' }], [{ text: '🔙 返回主菜单', callback_data: 'main_menu' }]] }
    );
    return;
  }

  if (text === '/redeem') {
    await sendMessage(env, chatId,
      '🎫 <b>充值卡兑换</b>\n\n请发送充值卡码，格式如:\n<code>XXXX-XXXX-XXXX-XXXX</code>',
      { inline_keyboard: [[{ text: '🔙 返回主菜单', callback_data: 'main_menu' }]] }
    );
    return;
  }

  // 处理充值卡兑换（匹配 XXXX-XXXX-XXXX-XXXX 格式）
  if (text && /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(text.trim())) {
    const code = text.trim().toUpperCase();
    const result = await db.useRedeemCard(code, userId);
    if (result.error) {
      await sendMessage(env, chatId, `❌ ${result.error}`,
        { inline_keyboard: [[{ text: '🔙 返回主菜单', callback_data: 'main_menu' }]] }
      );
    } else {
      const newBalance = (await db.getUser(userId)).balance;
      await sendMessage(env, chatId,
        `✅ 兑换成功！\n\n充值金额: ¥${Number(result.amount).toFixed(2)}\n当前余额: ¥${Number(newBalance).toFixed(2)}`,
        { inline_keyboard: [[{ text: '🔙 返回主菜单', callback_data: 'main_menu' }]] }
      );
    }
    return;
  }

  // 处理底部快捷按钮
  if (text === '🛒 商品列表') {
    await showCategories(db, env, chatId);
    return;
  }
  if (text === '📋 我的订单') {
    await handleMyOrders(db, env, chatId, null, userId);
    return;
  }
  if (text === '💰 充值余额') {
    await handleDeposit(db, env, chatId, null, user);
    return;
  }
  if (text === '🎫 兑换充值卡') {
    await sendMessage(env, chatId,
      '🎫 <b>充值卡兑换</b>\n\n请发送充值卡码，格式如:\n<code>XXXX-XXXX-XXXX-XXXX</code>',
      { inline_keyboard: [[{ text: '🔙 返回主菜单', callback_data: 'main_menu' }]] }
    );
    return;
  }
  if (text === '👥 邀请好友') {
    await handleInvite(db, env, chatId, null, user);
    return;
  }
  if (text === '📞 联系客服') {
    await handleSupport(db, env, chatId, null);
    return;
  }

  // 未知命令
  await sendMessage(env, chatId, '❓ 未知命令，请使用 /start 打开菜单');
}

async function handleCallback(callback, env) {
  const db = new Database(env.DB);
  await db.ensureSuccessfulCountColumn();
  const { data, message } = callback;
  const chatId = message.chat.id;
  const messageId = message.message_id;
  const userId = String(callback.from.id);
  const user = await db.ensureUser(userId, callback.from.username, callback.from.first_name);

  try {
    // 主菜单
    if (data === 'main_menu') {
      // 尝试编辑文字消息，如果失败（图片消息）则删除并发送新消息
      const result = await handleMainMenu(db, env, chatId, messageId);
      if (result && result.error_code) {
        try { await deleteMessage(env, chatId, messageId); } catch(e) {}
        await handleMainMenu(db, env, chatId, null);
      }
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

    // 历史订单分页
    else if (data.startsWith('history_orders_')) {
      const page = parseInt(data.replace('history_orders_', '')) || 1;
      await handleHistoryOrders(db, env, chatId, messageId, userId, page);
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

    // 充值卡兑换
    else if (data === 'redeem') {
      await editMessage(env, chatId, messageId,
        '🎫 <b>充值卡兑换</b>\n\n请发送充值卡码，格式如:\n<code>XXXX-XXXX-XXXX-XXXX</code>',
        { inline_keyboard: [[{ text: '🔙 返回主菜单', callback_data: 'main_menu' }]] }
      );
    }

    // 充值金额
    else if (data.startsWith('deposit_')) {
      const amount = parseInt(data.split('_')[1]);
      await processDeposit(env, chatId, messageId, user, amount);
    }

    // 充值支付方式选择
    else if (data.startsWith('dep_')) {
      const parts = data.split('_');
      const method = parts[1];
      const amount = parseInt(parts[2]);
      await processDepositPayment(env, chatId, messageId, user, amount, method);
    }

    // 取消充值（图片消息）
    else if (data === 'cancel_deposit') {
      await editMessageCaption(env, chatId, messageId,
        '❌ 充值已取消',
        { inline_keyboard: [[{ text: '🔙 返回主菜单', callback_data: 'main_menu' }]] }
      );
    }

    // 取消订单（图片消息）
    else if (data.startsWith('cancel_order_')) {
      const orderNo = data.replace('cancel_order_', '');
      const order = await db.getOrderByNo(orderNo);
      if (order && order.status === 'pending') {
        await db.updateOrderStatus(order.id, 'cancelled');
        await editMessageCaption(env, chatId, messageId,
          `❌ 订单已取消\n\n订单号: <code>${orderNo}</code>`,
          { inline_keyboard: [[{ text: '🛒 继续购物', callback_data: 'shop' }], [{ text: '🔙 返回主菜单', callback_data: 'main_menu' }]] }
        );
      } else {
        await editMessageCaption(env, chatId, messageId,
          '⚠️ 订单无法取消（可能已支付或已取消）',
          { inline_keyboard: [[{ text: '🔙 返回主菜单', callback_data: 'main_menu' }]] }
        );
      }
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

  const price = Number(product.price).toFixed(2);
  const originalPrice = product.original_price ? `~~¥${Number(product.original_price).toFixed(2)}~~ ` : '';
  const stockInfo = product.stock_count > 0 ? `库存: ${product.stock_count}` : '❌ 已售罄';

  // 读取支付配置
  const enabledMethods = {
    stars: (await db.getSetting('payment_stars_enabled')) !== '0'
  };

  let text = '📦 <b>商品详情</b>\n\n';
  text += `名称: ${product.name}\n`;
  text += `价格: ${originalPrice}¥${price}\n`;
  text += `${stockInfo}\n`;
  if (product.description) {
    text += `\n描述: ${product.description}`;
  }

  await editMessage(env, chatId, messageId, text, productDetailKeyboard(product, enabledMethods));
}

async function showPaymentMethods(db, env, chatId, messageId, productId, quantity) {
  const product = await db.getProduct(productId);

  if (!product || product.stock_count < quantity) {
    await editMessage(env, chatId, messageId, '❌ 商品库存不足',
      { inline_keyboard: [[{ text: '🔙 返回', callback_data: `product_${productId}` }]] }
    );
    return;
  }

  // 读取支付配置
  const enabledMethods = {
    stars: (await db.getSetting('payment_stars_enabled')) !== '0',  // 默认开启
    usdt: (await db.getSetting('payment_usdt_enabled')) === '1',
    yipay: (await db.getSetting('payment_yipay_enabled')) === '1',
    codepay: (await db.getSetting('payment_codepay_enabled')) === '1'
  };

  const totalAmount = Number(product.price * quantity).toFixed(2);
  let text = '💳 <b>选择支付方式</b>\n\n';
  text += `商品: ${product.name}\n`;
  text += `数量: ${quantity}\n`;
  text += `总价: ¥${totalAmount}\n\n`;
  text += '请选择支付方式:';

  await editMessage(env, chatId, messageId, text, paymentMethodKeyboard(productId, quantity, enabledMethods));
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
        `❌ 余额不足\n\n需要: ¥${Number(amount).toFixed(2)}\n当前: ¥${Number(user.balance).toFixed(2)}`,
        { inline_keyboard: [[{ text: '💰 充值', callback_data: 'deposit' }], [{ text: '🔙 返回', callback_data: `product_${productId}` }]] }
      );
      return;
    }

    // 创建订单
    const order = await db.createOrder(user.user_id, productId, quantity, amount, product.price, product.name);

    // 扣除余额
    await db.deductBalance(user.user_id, amount);

    // 发货（发货成功后会自动更新消费成功计次）
    try {
      await deliverOrder(db, env, order.id, product, quantity);
      await editMessage(env, chatId, messageId,
        `✅ 购买成功！\n\n订单号: <code>${order.order_no}</code>\n\n请查看订单获取卡密信息。`,
        { inline_keyboard: [[{ text: '📋 查看订单', callback_data: `order_${order.order_no}` }], [{ text: '🔙 返回主菜单', callback_data: 'main_menu' }]] }
      );
    } catch (deliverError) {
      // 发货失败，退还余额
      await db.addBalance(user.user_id, amount);
      await db.updateOrderStatus(order.id, 'failed');
      await editMessage(env, chatId, messageId,
        `❌ 发货失败，已退还余额\n\n原因: ${deliverError.message}`,
        { inline_keyboard: [[{ text: '🔙 返回主菜单', callback_data: 'main_menu' }]] }
      );
    }
  }

  // Stars 支付
  else if (method === 'stars') {
    // 创建待支付订单
    const order = await db.createOrder(user.user_id, productId, quantity, amount, product.price, product.name);

    // 发送 Stars 发票
    await sendInvoice(env, chatId, product, `order_${order.id}_${quantity}`);
  }

  // USDT 支付
  else if (method === 'usdt') {
    const address = await db.getSetting('payment_usdt_address');
    const rate = parseFloat(await db.getSetting('payment_usdt_rate') || '7.2');
    const network = await db.getSetting('payment_usdt_network') || 'TRC20';
    const usdtAmount = (amount / rate).toFixed(4);

    // 创建待支付订单
    const order = await db.createOrder(user.user_id, productId, quantity, amount, product.price, product.name);
    await db.setSetting('order_payment_' + order.order_no, 'usdt');

    let caption = '₮ <b>USDT 支付</b>\n\n';
    caption += `订单号: <code>${order.order_no}</code>\n`;
    caption += `商品: ${product.name}\n`;
    caption += `金额: ¥${Number(amount).toFixed(2)}\n`;
    caption += `汇率: 1 USDT = ¥${rate}\n`;
    caption += `应付: <code>${usdtAmount}</code> USDT (${network})\n\n`;
    caption += `📌 收款地址:\n<code>${address}</code>\n\n`;
    caption += `⚠️ 请在30分钟内完成支付`;

    // 生成二维码 URL
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(address)}`;

    const keyboard = {
      inline_keyboard: [
        [{ text: '❌ 取消支付', callback_data: `cancel_order_${order.order_no}` }],
        [{ text: '📋 我的订单', callback_data: 'my_orders' }],
        [{ text: '🔙 返回主菜单', callback_data: 'main_menu' }]
      ]
    };

    // 发送带二维码的图片消息
    await sendPhoto(env, chatId, qrUrl, caption, keyboard);
  }

  // 易支付
  else if (method === 'yipay') {
    const yipayUrl = await db.getSetting('payment_yipay_url');
    const yipayPid = await db.getSetting('payment_yipay_pid');
    const yipayKey = await db.getSetting('payment_yipay_key');

    if (!yipayUrl || !yipayPid || !yipayKey) {
      await editMessage(env, chatId, messageId, '❌ 易支付未配置完整，请联系管理员',
        { inline_keyboard: [[{ text: '🔙 返回', callback_data: `product_${productId}` }]] }
      );
      return;
    }

    // 创建待支付订单
    const order = await db.createOrder(user.user_id, productId, quantity, amount, product.price, product.name);
    await db.setSetting('order_payment_' + order.order_no, 'yipay');

    // 构建易支付链接
    const payUrl = `${yipayUrl}/submit.php?pid=${yipayPid}&type=wxpay&out_trade_no=${order.order_no}&notify_url=${encodeURIComponent(env.WORKER_URL || '')}/api/payment/notify&name=${encodeURIComponent(product.name)}&money=${Number(amount).toFixed(2)}`;

    let caption = '💳 <b>易支付</b>\n\n';
    caption += `订单号: <code>${order.order_no}</code>\n`;
    caption += `商品: ${product.name}\n`;
    caption += `金额: ¥${Number(amount).toFixed(2)}\n\n`;
    caption += `请扫描二维码或点击按钮完成支付`;

    // 生成支付二维码
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(payUrl)}`;

    const keyboard = {
      inline_keyboard: [
        [{ text: '💳 去支付', url: payUrl }],
        [{ text: '❌ 取消支付', callback_data: `cancel_order_${order.order_no}` }],
        [{ text: '📋 我的订单', callback_data: 'my_orders' }],
        [{ text: '🔙 返回主菜单', callback_data: 'main_menu' }]
      ]
    };

    await sendPhoto(env, chatId, qrUrl, caption, keyboard);
  }

  // 码支付
  else if (method === 'codepay') {
    const codepayUrl = await db.getSetting('payment_codepay_url');
    const codepayId = await db.getSetting('payment_codepay_id');
    const codepayKey = await db.getSetting('payment_codepay_key');

    if (!codepayUrl || !codepayId || !codepayKey) {
      await editMessage(env, chatId, messageId, '❌ 码支付未配置完整，请联系管理员',
        { inline_keyboard: [[{ text: '🔙 返回', callback_data: `product_${productId}` }]] }
      );
      return;
    }

    // 创建待支付订单
    const order = await db.createOrder(user.user_id, productId, quantity, amount, product.price, product.name);
    await db.setSetting('order_payment_' + order.order_no, 'codepay');

    // 构建码支付链接
    const payUrl = `${codepayUrl}/submit.php?id=${codepayId}&type=wxpay&out_trade_no=${order.order_no}&notify_url=${encodeURIComponent(env.WORKER_URL || '')}/api/payment/notify&name=${encodeURIComponent(product.name)}&money=${Number(amount).toFixed(2)}`;

    let caption = '📱 <b>码支付</b>\n\n';
    caption += `订单号: <code>${order.order_no}</code>\n`;
    caption += `商品: ${product.name}\n`;
    caption += `金额: ¥${Number(amount).toFixed(2)}\n\n`;
    caption += `请扫描二维码或点击按钮完成支付`;

    // 生成支付二维码
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(payUrl)}`;

    const keyboard = {
      inline_keyboard: [
        [{ text: '📱 去支付', url: payUrl }],
        [{ text: '❌ 取消支付', callback_data: `cancel_order_${order.order_no}` }],
        [{ text: '📋 我的订单', callback_data: 'my_orders' }],
        [{ text: '🔙 返回主菜单', callback_data: 'main_menu' }]
      ]
    };

    await sendPhoto(env, chatId, qrUrl, caption, keyboard);
  }
}

async function processDeposit(env, chatId, messageId, user, amount) {
  const db = new Database(env.DB);
  await db.ensureSuccessfulCountColumn();

  // 读取支付配置
  const enabledMethods = {
    stars: (await db.getSetting('payment_stars_enabled')) !== '0',
    usdt: (await db.getSetting('payment_usdt_enabled')) === '1',
    yipay: (await db.getSetting('payment_yipay_enabled')) === '1',
    codepay: (await db.getSetting('payment_codepay_enabled')) === '1'
  };

  let text = `💰 <b>充值 ¥${Number(amount).toFixed(2)}</b>\n\n`;
  text += `当前余额: ¥${Number(user.balance).toFixed(2)}\n\n`;
  text += '请选择支付方式:';

  const rows = [];
  if (enabledMethods.stars) {
    rows.push([{ text: '⭐ Telegram Stars', callback_data: `dep_stars_${amount}` }]);
  }
  if (enabledMethods.usdt) {
    rows.push([{ text: '₮ USDT 支付', callback_data: `dep_usdt_${amount}` }]);
  }
  if (enabledMethods.yipay) {
    rows.push([{ text: '💳 易支付 (支付宝/微信)', callback_data: `dep_yipay_${amount}` }]);
  }
  if (enabledMethods.codepay) {
    rows.push([{ text: '📱 码支付', callback_data: `dep_codepay_${amount}` }]);
  }
  rows.push([{ text: '🔙 返回', callback_data: 'deposit' }]);

  await editMessage(env, chatId, messageId, text, { inline_keyboard: rows });
}

// 处理充值支付
async function processDepositPayment(env, chatId, messageId, user, amount, method) {
  const db = new Database(env.DB);
  await db.ensureSuccessfulCountColumn();

  if (method === 'stars') {
    // Stars 充值 - 发送发票
    await sendInvoice(env, chatId, {
      name: `充值 ¥${Number(amount).toFixed(2)}`,
      description: `账户充值 ${Number(amount).toFixed(2)} 元`,
      price: amount
    }, `deposit_${user.user_id}_${amount}`);
    return;
  }

  if (method === 'usdt') {
    const address = await db.getSetting('payment_usdt_address');
    const rate = parseFloat(await db.getSetting('payment_usdt_rate') || '7.2');
    const network = await db.getSetting('payment_usdt_network') || 'TRC20';
    const usdtAmount = (amount / rate).toFixed(4);

    let caption = '₮ <b>USDT 充值</b>\n\n';
    caption += `充值金额: ¥${Number(amount).toFixed(2)}\n`;
    caption += `汇率: 1 USDT = ¥${rate}\n`;
    caption += `应付: <code>${usdtAmount}</code> USDT (${network})\n\n`;
    caption += `📌 收款地址:\n<code>${address}</code>\n\n`;
    caption += `⚠️ 请在30分钟内完成支付`;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(address)}`;

    await sendPhoto(env, chatId, qrUrl, caption, {
      inline_keyboard: [
        [{ text: '❌ 取消充值', callback_data: 'cancel_deposit' }],
        [{ text: '🔙 返回主菜单', callback_data: 'main_menu' }]
      ]
    });
    return;
  }

  if (method === 'yipay') {
    const yipayUrl = await db.getSetting('payment_yipay_url');
    const yipayPid = await db.getSetting('payment_yipay_pid');

    if (!yipayUrl || !yipayPid) {
      await editMessage(env, chatId, messageId, '❌ 易支付未配置完整，请联系管理员',
        { inline_keyboard: [[{ text: '🔙 返回', callback_data: 'deposit' }]] }
      );
      return;
    }

    const payUrl = `${yipayUrl}/submit.php?pid=${yipayPid}&type=wxpay&out_trade_no=DEP${user.user_id}${Date.now()}&name=${encodeURIComponent('余额充值')}&money=${Number(amount).toFixed(2)}`;

    let caption = '💳 <b>易支付充值</b>\n\n';
    caption += `充值金额: ¥${Number(amount).toFixed(2)}\n\n`;
    caption += `请扫描二维码或点击按钮完成支付`;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(payUrl)}`;

    await sendPhoto(env, chatId, qrUrl, caption, {
      inline_keyboard: [
        [{ text: '💳 去支付', url: payUrl }],
        [{ text: '❌ 取消充值', callback_data: 'cancel_deposit' }],
        [{ text: '🔙 返回主菜单', callback_data: 'main_menu' }]
      ]
    });
    return;
  }

  if (method === 'codepay') {
    const codepayUrl = await db.getSetting('payment_codepay_url');
    const codepayId = await db.getSetting('payment_codepay_id');

    if (!codepayUrl || !codepayId) {
      await editMessage(env, chatId, messageId, '❌ 码支付未配置完整，请联系管理员',
        { inline_keyboard: [[{ text: '🔙 返回', callback_data: 'deposit' }]] }
      );
      return;
    }

    const payUrl = `${codepayUrl}/submit.php?id=${codepayId}&type=wxpay&out_trade_no=DEP${user.user_id}${Date.now()}&name=${encodeURIComponent('余额充值')}&money=${Number(amount).toFixed(2)}`;

    let caption = '📱 <b>码支付充值</b>\n\n';
    caption += `充值金额: ¥${Number(amount).toFixed(2)}\n\n`;
    caption += `请扫描二维码或点击按钮完成支付`;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(payUrl)}`;

    await sendPhoto(env, chatId, qrUrl, caption, {
      inline_keyboard: [
        [{ text: '📱 去支付', url: payUrl }],
        [{ text: '❌ 取消充值', callback_data: 'cancel_deposit' }],
        [{ text: '🔙 返回主菜单', callback_data: 'main_menu' }]
      ]
    });
    return;
  }
}

async function handlePreCheckout(preCheckout, env) {
  const db = new Database(env.DB);
  await db.ensureSuccessfulCountColumn();
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
  await db.ensureSuccessfulCountColumn();
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

      // 发货（发货成功后会自动更新消费成功计次）
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