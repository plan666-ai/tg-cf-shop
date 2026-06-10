// worker/src/api/orders.js - 订单 API
import { jsonResponse } from '../index.js';
import { refundOrder } from '../services/payment.js';

export async function handleOrdersApi(request, db, path, method, corsHeaders) {
  // GET /api/orders - 获取订单列表
  if (method === 'GET' && path === '/api/orders') {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const orders = await db.getOrders(status, limit, offset, search);
    return jsonResponse({ data: orders }, 200, corsHeaders);
  }

  // 订单详情
  const orderMatch = path.match(/^\/api\/orders\/(\w+)$/);
  if (orderMatch && method === 'GET') {
    const orderNo = orderMatch[1];
    const order = await db.getOrderByNo(orderNo);
    if (!order) {
      return jsonResponse({ error: '订单不存在' }, 404, corsHeaders);
    }
    return jsonResponse({ data: order }, 200, corsHeaders);
  }

  // PATCH /api/orders/:id/status - 更新订单状态
  const statusMatch = path.match(/^\/api\/orders\/(\d+)\/status$/);
  if (statusMatch && method === 'PATCH') {
    const orderId = parseInt(statusMatch[1]);
    const { status } = await request.json();
    await db.updateOrderStatus(orderId, status);
    return jsonResponse({ message: '更新成功' }, 200, corsHeaders);
  }

  // POST /api/orders/:id/refund - 退款
  const refundMatch = path.match(/^\/api\/orders\/(\d+)\/refund$/);
  if (refundMatch && method === 'POST') {
    const orderId = parseInt(refundMatch[1]);
    try {
      await refundOrder(db, null, orderId);
      return jsonResponse({ message: '退款成功' }, 200, corsHeaders);
    } catch (error) {
      return jsonResponse({ error: error.message }, 400, corsHeaders);
    }
  }

  // DELETE /api/orders/:id - 删除订单（不删除用户详情数据）
  const deleteMatch = path.match(/^\/api\/orders\/(\d+)$/);
  if (deleteMatch && method === 'DELETE') {
    const orderId = parseInt(deleteMatch[1]);
    const order = await db.getOrder(orderId);
    if (!order) {
      return jsonResponse({ error: '订单不存在' }, 404, corsHeaders);
    }
    // 只允许删除非活跃订单（待支付/已取消/已退款）
    if (order.status === 'paid' || order.status === 'delivered') {
      return jsonResponse({ error: '已支付/已完成的订单不可删除，请先退款' }, 400, corsHeaders);
    }
    // 软删除：将订单状态标记为 deleted
    await db.updateOrderStatus(orderId, 'deleted');
    return jsonResponse({ message: '删除成功' }, 200, corsHeaders);
  }

  return jsonResponse({ error: 'Not Found' }, 404, corsHeaders);
}
