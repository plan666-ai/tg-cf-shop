// worker/src/api/orders.js - 订单 API
import { jsonResponse } from '../index.js';
import { refundOrder } from '../services/payment.js';

export async function handleOrdersApi(request, db, path, method, corsHeaders) {
  // GET /api/orders - 获取订单列表
  if (method === 'GET' && path === '/api/orders') {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const orders = await db.getOrders(status, limit, offset);
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

  return jsonResponse({ error: 'Not Found' }, 404, corsHeaders);
}
