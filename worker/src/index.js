// worker/src/index.js - 入口 + 路由
import { handleBotUpdate } from './bot/handler.js';
import { handleApiRequest } from './api/router.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS 预检请求
    if (request.method === 'OPTIONS') {
      return handleCors(env);
    }

    // Telegram Webhook
    if (url.pathname === '/webhook' && request.method === 'POST') {
      return handleBotUpdate(request, env);
    }

    // 管理后台 API
    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, env);
    }

    // 健康检查
    if (url.pathname === '/health') {
      return jsonResponse({ status: 'ok', timestamp: Date.now() });
    }

    return new Response('Not Found', { status: 404 });
  }
};

// CORS 处理
function handleCors(env) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    }
  });
}

// JSON 响应
export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  });
}
