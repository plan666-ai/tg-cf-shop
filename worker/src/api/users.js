// worker/src/api/users.js - 用户 API
import { jsonResponse } from '../index.js';

export async function handleUsersApi(request, db, path, method, corsHeaders) {
  // GET /api/users - 获取用户列表（支持搜索）
  if (method === 'GET' && path === '/api/users') {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const search = url.searchParams.get('search') || '';

    let users, total;
    if (search) {
      users = await db.searchUsers(search, limit, offset);
      total = users.length;
    } else {
      users = await db.getUsers(limit, offset);
      total = await db.getUserCount();
    }
    return jsonResponse({ data: users, total }, 200, corsHeaders);
  }

  // GET /api/users/:id - 用户详情
  const userMatch = path.match(/^\/api\/users\/(\w+)$/);
  if (userMatch && method === 'GET') {
    const userId = userMatch[1];
    const user = await db.getUser(userId);
    if (!user) {
      return jsonResponse({ error: '用户不存在' }, 404, corsHeaders);
    }
    const orders = await db.getUserOrders(userId, 50);
    const commissions = await db.getUserCommissions(userId);
    const inviteCount = await db.getInviteStats(userId);
    const redeemCards = await db.getUserRedeemCards(userId);
    const logs = await db.getUserLogs(userId);
    const invitedUsers = await db.getInvitedUsers(userId);
    return jsonResponse({ data: { ...user, orders, commissions, invite_count: inviteCount, redeem_cards: redeemCards, logs, invited_users: invitedUsers } }, 200, corsHeaders);
  }

  // PUT /api/users/:id - 更新用户信息
  if (userMatch && method === 'PUT') {
    const userId = userMatch[1];
    const data = await request.json();
    const user = await db.getUser(userId);
    if (!user) {
      return jsonResponse({ error: '用户不存在' }, 404, corsHeaders);
    }

    // 更新允许的字段
    const allowedFields = ['username', 'first_name', 'is_banned', 'is_admin'];
    const updates = [];
    const values = [];
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(data[field]);
      }
    }

    if (updates.length > 0) {
      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(userId);
      await db.db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`).bind(...values).run();
    }

    return jsonResponse({ message: '更新成功' }, 200, corsHeaders);
  }

  // DELETE /api/users/:id - 删除用户
  if (userMatch && method === 'DELETE') {
    const userId = userMatch[1];
    const user = await db.getUser(userId);
    if (!user) {
      return jsonResponse({ error: '用户不存在' }, 404, corsHeaders);
    }
    // 软删除 - 标记为封禁
    await db.db.prepare('UPDATE users SET is_banned = 1, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?').bind(userId).run();
    return jsonResponse({ message: '已删除' }, 200, corsHeaders);
  }

  // PATCH /api/users/:id/ban - 封禁/解封用户
  const banMatch = path.match(/^\/api\/users\/(\w+)\/ban$/);
  if (banMatch && method === 'PATCH') {
    const userId = banMatch[1];
    const { is_banned } = await request.json();
    await db.db.prepare('UPDATE users SET is_banned = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?').bind(is_banned ? 1 : 0, userId).run();
    return jsonResponse({ message: is_banned ? '已封禁' : '已解封' }, 200, corsHeaders);
  }

  // POST /api/users/:id/balance - 调整余额
  const balanceMatch = path.match(/^\/api\/users\/(\w+)\/balance$/);
  if (balanceMatch && method === 'POST') {
    const userId = balanceMatch[1];
    const { amount, reason } = await request.json();
    const user = await db.getUser(userId);
    if (!user) {
      return jsonResponse({ error: '用户不存在' }, 404, corsHeaders);
    }

    // 确保余额不会变为负数
    if (user.balance + amount < 0) {
      return jsonResponse({ error: '余额不足，无法扣减' }, 400, corsHeaders);
    }

    await db.updateUserBalance(userId, amount);

    // 记录日志
    await db.db.prepare(
      'INSERT INTO logs (user_id, action, detail) VALUES (?, ?, ?)'
    ).bind(userId, 'balance_adjust', JSON.stringify({ amount, reason: reason || '管理员调整' })).run();

    return jsonResponse({ message: '余额已更新', new_balance: user.balance + amount }, 200, corsHeaders);
  }

  // GET /api/users/:id/orders - 获取用户订单
  const ordersMatch = path.match(/^\/api\/users\/(\w+)\/orders$/);
  if (ordersMatch && method === 'GET') {
    const userId = ordersMatch[1];
    const orders = await db.getUserOrders(userId, 100);
    return jsonResponse({ data: orders }, 200, corsHeaders);
  }

  // GET /api/users/:id/commissions - 获取用户佣金
  const commissionsMatch = path.match(/^\/api\/users\/(\w+)\/commissions$/);
  if (commissionsMatch && method === 'GET') {
    const userId = commissionsMatch[1];
    const commissions = await db.getUserCommissions(userId);
    return jsonResponse({ data: commissions }, 200, corsHeaders);
  }

  // GET /api/users/:id/export - 导出用户全部数据
  const exportMatch = path.match(/^\/api\/users\/(\w+)\/export$/);
  if (exportMatch && method === 'GET') {
    const userId = exportMatch[1];
    const data = await db.exportUserData(userId);
    if (!data) {
      return jsonResponse({ error: '用户不存在' }, 404, corsHeaders);
    }
    return jsonResponse({ data }, 200, corsHeaders);
  }

  return jsonResponse({ error: 'Not Found' }, 404, corsHeaders);
}
