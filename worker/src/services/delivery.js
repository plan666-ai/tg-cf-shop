// worker/src/services/delivery.js - 发货服务

export async function autoDelivery(db, env, order, product) {
  // 自动发货逻辑
  if (!product.auto_delivery) {
    return null;
  }

  const quantity = order.quantity;

  // 获取可用卡密
  const cards = await db.getAvailableCards(product.id, quantity);

  if (cards.length < quantity) {
    return null;
  }

  // 标记卡密为已售
  const cardContents = [];
  for (const card of cards) {
    await db.markCardSold(card.id, order.id);
    cardContents.push(card.content);
  }

  return cardContents.join('\n');
}
