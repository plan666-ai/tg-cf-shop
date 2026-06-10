// worker/src/api/router.js - API 路由
import { jsonResponse } from '../index.js';
import { Database } from '../utils/db.js';
import { handleProductsApi } from './products.js';
import { handleOrdersApi } from './orders.js';
import { handleUsersApi } from './users.js';
import { handleStatsApi } from './stats.js';

export async function handleApiRequest(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // CORS 头
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    // 验证管理员认证
    const authResult = await verifyAdminAuth(request, env);
    if (!authResult && path !== '/api/login') {
      return jsonResponse({ error: 'Unauthorized' }, 401, corsHeaders);
    }

    const db = new Database(env.DB);

    // 登录接口
    if (path === '/api/login' && method === 'POST') {
      return await handleLogin(request, env, corsHeaders);
    }

    // 商品 API
    if (path.startsWith('/api/products') || path.startsWith('/api/categories')) {
      return await handleProductsApi(request, db, path, method, corsHeaders);
    }

    // 订单 API
    if (path.startsWith('/api/orders')) {
      return await handleOrdersApi(request, db, path, method, corsHeaders);
    }

    // 用户 API
    if (path.startsWith('/api/users')) {
      return await handleUsersApi(request, db, path, method, corsHeaders);
    }

    // 统计 API
    if (path.startsWith('/api/stats')) {
      return await handleStatsApi(request, db, path, method, corsHeaders);
    }

    // 充值卡 API
    if (path.startsWith('/api/redeem-cards')) {
      return await handleRedeemCardsApi(request, db, path, method, corsHeaders);
    }

    // 配置 API
    if (path.startsWith('/api/settings')) {
      return await handleSettingsApi(request, db, path, method, corsHeaders);
    }

    return jsonResponse({ error: 'Not Found' }, 404, corsHeaders);
  } catch (error) {
    console.error('API error:', error);
    return jsonResponse({ error: error.message }, 500, corsHeaders);
  }
}

async function handleLogin(request, env, corsHeaders) {
  const { password } = await request.json();

  if (password === env.ADMIN_PASSWORD) {
    // 生成简单的 token（生产环境应使用 JWT）
    const token = btoa(`admin:${Date.now()}`);
    return jsonResponse({ token, message: '登录成功' }, 200, corsHeaders);
  }

  return jsonResponse({ error: '密码错误' }, 401, corsHeaders);
}

async function verifyAdminAuth(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  // 简单验证（生产环境应验证 JWT）
  try {
    const decoded = atob(token);
    return decoded.startsWith('admin:');
  } catch {
    return false;
  }
}

async function handleRedeemCardsApi(request, db, path, method, corsHeaders) {
  // GET /api/redeem-cards - 获取充值卡列表
  if (method === 'GET' && path === '/api/redeem-cards') {
    const url = new URL(request.url);
    const onlyUnused = url.searchParams.get('unused') === '1';
    const cards = await db.getRedeemCards(onlyUnused);
    const stats = await db.getRedeemCardStats();
    return jsonResponse({ data: cards, stats }, 200, corsHeaders);
  }

  // POST /api/redeem-cards - 批量生成充值卡
  if (method === 'POST' && path === '/api/redeem-cards') {
    const { amount, count } = await request.json();
    if (!amount || amount <= 0) return jsonResponse({ error: '金额必须大于0' }, 400, corsHeaders);
    const n = Math.min(count || 1, 100);
    const cards = [];
    for (let i = 0; i < n; i++) {
      cards.push({ code: generateRedeemCode(), amount });
    }
    await db.batchCreateRedeemCards(cards);
    return jsonResponse({ data: cards, message: `成功生成 ${n} 张充值卡` }, 200, corsHeaders);
  }

  // DELETE /api/redeem-cards/:id - 删除充值卡
  if (method === 'DELETE' && path.match(/^\/api\/redeem-cards\/\d+$/)) {
    const id = parseInt(path.split('/').pop());
    const result = await db.deleteRedeemCard(id);
    if (result.error) return jsonResponse({ error: result.error }, 400, corsHeaders);
    return jsonResponse({ message: '删除成功' }, 200, corsHeaders);
  }

  // PATCH /api/redeem-cards/:id/restore - 恢复充值卡
  if (method === 'PATCH' && path.match(/^\/api\/redeem-cards\/\d+\/restore$/)) {
    const id = parseInt(path.split('/')[3]);
    const result = await db.restoreRedeemCard(id);
    if (result.error) return jsonResponse({ error: result.error }, 400, corsHeaders);
    return jsonResponse({ message: '恢复成功' }, 200, corsHeaders);
  }

  return jsonResponse({ error: 'Not Found' }, 404, corsHeaders);
}

function generateRedeemCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) code += '-';
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

async function handleSettingsApi(request, db, path, method, corsHeaders) {
  // GET /api/settings - 获取所有设置
  if (method === 'GET' && path === '/api/settings') {
    const settings = await db.getSettings();
    return jsonResponse({ data: settings }, 200, corsHeaders);
  }

  // PUT /api/settings - 更新设置
  if (method === 'PUT' && path === '/api/settings') {
    const { key, value } = await request.json();
    await db.setSetting(key, value);
    return jsonResponse({ message: '更新成功' }, 200, corsHeaders);
  }

  return jsonResponse({ error: 'Not Found' }, 404, corsHeaders);
}
