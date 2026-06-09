// worker/src/api/users.js - 用户 API
import { jsonResponse } from '../index.js';

export async function handleUsersApi(request, db, path, method, corsHeaders) {
  // GET /api/users - 获取用户列表
  if (method === 'GET' && path === '/api/users') {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const users = await db.getUsers(limit, offset);
    const total = await db.getUserCount();
    return jsonResponse({ data: users, total }, 200, corsHeaders);
  }

  // 用户详情
  const userMatch = path.match(/^\/api\/users\/(\w+)$/);
  if (userMatch && method === 'GET') {
    const userId = userMatch[1];
    const user = await db.getUser(userId);
    if (!user) {
      return jsonResponse({ error: '用户不存在' }, 404, corsHeaders);
    }
    const orders = await db.getUserOrders(userId, 20);
    const commissions = await db.getUserCommissions(userId);
    return jsonResponse({ data: { ...user, orders, commissions } }, 200, corsHeaders);
  }

  // PATCH /api/users/:id/ban - 封禁/解封用户
  const banMatch = path.match(/^\/api\/users\/(\w+)\/ban$/);
  if (banMatch && method === 'PATCH') {
    const userId = banMatch[1];
    const { is_banned } = await request.json();
    await db.db.prepare('UPDATE users SET is_banned = ? WHERE user_id = ?').bind(is_banned ? 1 : 0, userId).run();
    return jsonResponse({ message: is_banned ? '已封禁' : '已解封' }, 200, corsHeaders);
  }

  // POST /api/users/:id/balance - 调整余额
  const balanceMatch = path.match(/^\/api\/users\/(\w+)\/balance$/);
  if (balanceMatch && method === 'POST') {
    const userId = balanceMatch[1];
    const { amount, reason } = await request.json();
    await db.updateUserBalance(userId, amount);
    return jsonResponse({ message: '余额已更新' }, 200, corsHeaders);
  }

  return jsonResponse({ error: 'Not Found' }, 404, corsHeaders);
}
