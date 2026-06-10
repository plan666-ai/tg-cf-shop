// worker/src/bot/commands.js - 命令处理
import { sendMessage, editMessage } from '../utils/tg.js';
import { mainMenuKeyboard, ordersListKeyboard, inviteKeyboard, bottomKeyboard } from './keyboards.js';

// 处理 /start 命令
export async function handleStart(db, env, chatId, user, inviteCode = null) {
  // 处理邀请码
  if (inviteCode && !user.invited_by) {
    const inviter = await db.db.prepare('SELECT * FROM users WHERE invite_code = ?').bind(inviteCode).first();
    if (inviter && inviter.user_id !== user.user_id) {
      await db.db.prepare('UPDATE users SET invited_by = ? WHERE user_id = ?').bind(inviteCode, user.user_id).run();
      await sendMessage(env, chatId, `🎉 邀请码验证成功！您已被用户 ${inviter.username || inviter.first_name || inviter.user_id} 邀请`);
    }
  }
  const welcomeMsg = await db.getSetting('welcome_message') || '👋 欢迎来到小店！\n\n请选择：';
  const parseMode = await db.getSetting('welcome_parse_mode') || 'HTML';
  await sendMessage(env, chatId, welcomeMsg, {
    ...mainMenuKeyboard(),
    ...bottomKeyboard()
  }, parseMode);
}

// 处理主菜单
export async function handleMainMenu(db, env, chatId, messageId) {
  const welcomeMsg = await db.getSetting('welcome_message') || '👋 欢迎来到小店！\n\n请选择：';
  const parseMode = await db.getSetting('welcome_parse_mode') || 'HTML';
  const keyboard = mainMenuKeyboard();
  if (messageId) {
    return await editMessage(env, chatId, messageId, welcomeMsg, keyboard, parseMode);
  } else {
    return await sendMessage(env, chatId, welcomeMsg, keyboard, parseMode);
  }
}

// 处理我的订单
export async function handleMyOrders(db, env, chatId, messageId, userId) {
  const orders = await db.getUserOrders(userId, 5);

  if (orders.length === 0) {
    const text = '📋 您还没有订单\n\n快去选购商品吧！';
    const keyboard = { inline_keyboard: [[{ text: '🛒 去购物', callback_data: 'shop' }], [{ text: '🔙 返回主菜单', callback_data: 'main_menu' }]] };
    if (messageId) {
      await editMessage(env, chatId, messageId, text, keyboard);
    } else {
      await sendMessage(env, chatId, text, keyboard);
    }
    return;
  }

  let text = '📋 <b>最近订单</b>\n\n';
  orders.forEach(order => {
    const statusText = getStatusText(order.status);
    const date = new Date(order.created_at).toLocaleString('zh-CN');
    text += `📦 ${order.order_no}\n`;
    text += `   商品: ${order.product_name}\n`;
    text += `   金额: ¥${Number(order.amount).toFixed(2)}\n`;
    text += `   状态: ${statusText}\n`;
    text += `   时间: ${date}\n\n`;
  });

  const keyboard = ordersListKeyboard(orders);
  // 在"返回主菜单"按钮前插入"历史订单"按钮
  keyboard.inline_keyboard.splice(keyboard.inline_keyboard.length - 1, 0, [{ text: '📜 历史订单', callback_data: 'history_orders_1' }]);

  if (messageId) {
    await editMessage(env, chatId, messageId, text, keyboard);
  } else {
    await sendMessage(env, chatId, text, keyboard);
  }
}

// 处理历史订单（分页）
export async function handleHistoryOrders(db, env, chatId, messageId, userId, page) {
  const perPage = 5;
  const offset = (page - 1) * perPage;
  const orders = await db.getUserOrders(userId, perPage + 1, offset); // 多取1条判断是否有下一页
  const hasNext = orders.length > perPage;
  const pageOrders = orders.slice(0, perPage);

  if (pageOrders.length === 0) {
    await editMessage(env, chatId, messageId,
      '📜 <b>历史订单</b>\n\n没有更多订单了',
      { inline_keyboard: [[{ text: '🔙 返回我的订单', callback_data: 'my_orders' }]] }
    );
    return;
  }

  let text = `📜 <b>历史订单</b> (第${page}页)\n\n`;
  pageOrders.forEach(order => {
    const statusText = getStatusText(order.status);
    const date = new Date(order.created_at).toLocaleString('zh-CN');
    text += `📦 ${order.order_no}\n`;
    text += `   商品: ${order.product_name}\n`;
    text += `   金额: ¥${Number(order.amount).toFixed(2)}\n`;
    text += `   状态: ${statusText}\n`;
    text += `   时间: ${date}\n\n`;
  });

  const navRow = [];
  if (page > 1) {
    navRow.push({ text: '⬅️ 上一页', callback_data: `history_orders_${page - 1}` });
  }
  if (hasNext) {
    navRow.push({ text: '下一页 ➡️', callback_data: `history_orders_${page + 1}` });
  }

  const buttons = [];
  if (navRow.length) buttons.push(navRow);
  buttons.push([{ text: '🔙 返回我的订单', callback_data: 'my_orders' }]);

  await editMessage(env, chatId, messageId, text, { inline_keyboard: buttons });
}

// 处理订单详情
export async function handleOrderDetail(db, env, chatId, messageId, orderNo) {
  const order = await db.getOrderByNo(orderNo);

  if (!order) {
    await editMessage(env, chatId, messageId, '❌ 订单不存在',
      { inline_keyboard: [[{ text: '🔙 返回', callback_data: 'my_orders' }]] }
    );
    return;
  }

  const statusText = getStatusText(order.status);
  const date = new Date(order.created_at).toLocaleString('zh-CN');

  let text = '📦 <b>订单详情</b>\n\n';
  text += `订单号: <code>${order.order_no}</code>\n`;
  text += `商品: ${order.product_name}\n`;
  text += `数量: ${order.quantity}\n`;
  text += `金额: ¥${Number(order.amount).toFixed(2)}\n`;
  text += `状态: ${statusText}\n`;
  text += `时间: ${date}\n`;

  if (order.status === 'delivered' && order.card_content) {
    text += `\n🔑 <b>卡密信息:</b>\n<code>${order.card_content}</code>`;
  }

  await editMessage(env, chatId, messageId, text,
    { inline_keyboard: [[{ text: '🔙 返回我的订单', callback_data: 'my_orders' }]] }
  );
}

// 处理邀请好友
export async function handleInvite(db, env, chatId, messageId, user) {
  const botUsername = (await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/getMe`).then(r => r.json())).result.username;
  const inviteLink = `https://t.me/${botUsername}?start=${user.invite_code}`;
  const inviteCount = await db.getInviteStats(user.invite_code);
  const commissionRate = await db.getSetting('commission_rate') || '10';

  let text = '👥 <b>邀请好友</b>\n\n';
  text += `📎 您的邀请链接:\n<code>${inviteLink}</code>\n\n`;
  text += `📊 邀请统计:\n`;
  text += `   已邀请: ${inviteCount} 人\n`;
  text += `   佣金比例: ${commissionRate}%\n\n`;
  text += `💡 好友通过您的链接注册后，每次消费您都能获得 ${commissionRate}% 的佣金！`;

  const keyboard = inviteKeyboard(inviteLink);
  if (messageId) {
    await editMessage(env, chatId, messageId, text, keyboard);
  } else {
    await sendMessage(env, chatId, text, keyboard);
  }
}

// 处理联系客服
export async function handleSupport(db, env, chatId, messageId) {
  const supportUsername = await db.getSetting('support_username');

  let text = '📞 <b>联系客服</b>\n\n';
  if (supportUsername) {
    text += `如有问题，请联系客服: @${supportUsername}`;
  } else {
    text += '暂未设置客服，请稍后再试。';
  }

  const keyboard = { inline_keyboard: [] };
  if (supportUsername) {
    keyboard.inline_keyboard.push([{ text: '📞 联系客服', url: `https://t.me/${supportUsername}` }]);
  }
  keyboard.inline_keyboard.push([{ text: '🔙 返回主菜单', callback_data: 'main_menu' }]);

  if (messageId) {
    await editMessage(env, chatId, messageId, text, keyboard);
  } else {
    await sendMessage(env, chatId, text, keyboard);
  }
}

// 处理充值余额
export async function handleDeposit(db, env, chatId, messageId, user) {
  let text = '💰 <b>充值余额</b>\n\n';
  text += `当前余额: ¥${Number(user.balance).toFixed(2)}\n\n`;
  text += '请选择充值金额:';

  const keyboard = {
    inline_keyboard: [
      [
        { text: '¥10', callback_data: 'deposit_10' },
        { text: '¥20', callback_data: 'deposit_20' },
        { text: '¥50', callback_data: 'deposit_50' }
      ],
      [
        { text: '¥100', callback_data: 'deposit_100' },
        { text: '¥200', callback_data: 'deposit_200' },
        { text: '¥500', callback_data: 'deposit_500' }
      ],
      [{ text: '🔙 返回主菜单', callback_data: 'main_menu' }]
    ]
  };

  if (messageId) {
    await editMessage(env, chatId, messageId, text, keyboard);
  } else {
    await sendMessage(env, chatId, text, keyboard);
  }
}

// 辅助函数
function getStatusText(status) {
  const map = {
    'pending': '⏳ 待支付',
    'paid': '💳 已支付',
    'delivered': '✅ 已完成',
    'refunded': '↩️ 已退款',
    'cancelled': '❌ 已取消'
  };
  return map[status] || '❓ 未知';
}
