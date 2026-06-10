// worker/src/bot/keyboards.js - 按钮键盘

export function mainMenuKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: '🛒 商品列表', callback_data: 'shop' },
        { text: '📋 我的订单', callback_data: 'my_orders' }
      ],
      [
        { text: '🎫 充值卡兑换', callback_data: 'redeem' },
        { text: '💰 充值余额', callback_data: 'deposit' }
      ],
      [
        { text: '👥 邀请好友', callback_data: 'invite' },
        { text: '📞 联系客服', callback_data: 'support' }
      ]
    ]
  };
}

// 底部快捷按钮 (ReplyKeyboard)
export function bottomKeyboard() {
  return {
    keyboard: [
      [{ text: '🛒 商品列表' }, { text: '📋 我的订单' }],
      [{ text: '💰 充值余额' }, { text: '🎫 兑换充值卡' }],
      [{ text: '👥 邀请好友' }, { text: '📞 联系客服' }]
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  };
}

export function categoryKeyboard(categories) {
  const buttons = categories.map(cat => ([
    { text: `${cat.icon} ${cat.name}`, callback_data: `category_${cat.id}` }
  ]));

  buttons.push([{ text: '🔙 返回主菜单', callback_data: 'main_menu' }]);

  return { inline_keyboard: buttons };
}

export function productKeyboard(products) {
  const buttons = products.map(p => {
    const price = Number(p.price).toFixed(2);
    const stockInfo = p.stock_count > 0 ? `库存:${p.stock_count}` : '❌ 已售罄';
    return [{
      text: `${p.name} - ¥${price} (${stockInfo})`,
      callback_data: p.stock_count > 0 ? `buy_${p.id}` : `soldout_${p.id}`
    }];
  });

  buttons.push([{ text: '🔙 返回分类', callback_data: 'shop' }]);

  return { inline_keyboard: buttons };
}

export function productDetailKeyboard(product, enabledMethods = {}) {
  const buttons = [];

  if (product.stock_count > 0) {
    buttons.push([
      { text: '1个', callback_data: `qty_${product.id}_1` },
      { text: '2个', callback_data: `qty_${product.id}_2` },
      { text: '5个', callback_data: `qty_${product.id}_5` }
    ]);
    const payRow = [];
    if (enabledMethods.stars !== false) {
      payRow.push({ text: '💳 Stars支付', callback_data: `pay_stars_${product.id}_1` });
    }
    payRow.push({ text: '💰 余额支付', callback_data: `pay_balance_${product.id}_1` });
    buttons.push(payRow);
  }

  buttons.push([{ text: '🔙 返回商品列表', callback_data: `category_${product.category_id}` }]);

  return { inline_keyboard: buttons };
}

export function paymentMethodKeyboard(productId, quantity, enabledMethods = {}) {
  const rows = [];

  // Stars 根据配置显示
  if (enabledMethods.stars !== false) {
    rows.push([{ text: '⭐ Telegram Stars', callback_data: `pay_stars_${productId}_${quantity}` }]);
  }

  // 余额支付
  rows.push([{ text: '💰 余额支付', callback_data: `pay_balance_${productId}_${quantity}` }]);

  // USDT
  if (enabledMethods.usdt) {
    rows.push([{ text: '₮ USDT 支付', callback_data: `pay_usdt_${productId}_${quantity}` }]);
  }
  // 易支付
  if (enabledMethods.yipay) {
    rows.push([{ text: '💳 易支付 (支付宝/微信)', callback_data: `pay_yipay_${productId}_${quantity}` }]);
  }
  // 码支付
  if (enabledMethods.codepay) {
    rows.push([{ text: '📱 码支付', callback_data: `pay_codepay_${productId}_${quantity}` }]);
  }

  rows.push([{ text: '🔙 返回', callback_data: `product_${productId}` }]);

  return { inline_keyboard: rows };
}

export function orderKeyboard(orderNo) {
  return {
    inline_keyboard: [
      [
        { text: '📦 查看订单详情', callback_data: `order_${orderNo}` }
      ],
      [
        { text: '🔙 返回主菜单', callback_data: 'main_menu' }
      ]
    ]
  };
}

export function ordersListKeyboard(orders) {
  const buttons = orders.slice(0, 10).map(order => {
    const statusEmoji = getStatusEmoji(order.status);
    const date = new Date(order.created_at).toLocaleDateString('zh-CN');
    return [{
      text: `${statusEmoji} ${order.order_no} - ¥${Number(order.amount).toFixed(2)}`,
      callback_data: `order_${order.order_no}`
    }];
  });

  buttons.push([{ text: '🔙 返回主菜单', callback_data: 'main_menu' }]);

  return { inline_keyboard: buttons };
}

export function inviteKeyboard(inviteLink) {
  return {
    inline_keyboard: [
      [
        { text: '📤 分享给好友', url: inviteLink }
      ],
      [
        { text: '🔙 返回主菜单', callback_data: 'main_menu' }
      ]
    ]
  };
}

export function backKeyboard(callbackData = 'main_menu') {
  return {
    inline_keyboard: [
      [{ text: '🔙 返回', callback_data: callbackData }]
    ]
  };
}

export function confirmKeyboard(confirmData, cancelData = 'main_menu') {
  return {
    inline_keyboard: [
      [
        { text: '✅ 确认', callback_data: confirmData },
        { text: '❌ 取消', callback_data: cancelData }
      ]
    ]
  };
}

function getStatusEmoji(status) {
  const map = {
    'pending': '⏳',
    'paid': '💳',
    'delivered': '✅',
    'refunded': '↩️',
    'cancelled': '❌'
  };
  return map[status] || '❓';
}
