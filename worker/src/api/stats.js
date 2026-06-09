// worker/src/api/stats.js - 统计 API
import { jsonResponse } from '../index.js';

export async function handleStatsApi(request, db, path, method, corsHeaders) {
  // GET /api/stats - 获取总统计
  if (method === 'GET' && path === '/api/stats') {
    const stats = await db.getStats();
    const todayStats = await db.getTodayStats();
    return jsonResponse({ data: { ...stats, ...todayStats } }, 200, corsHeaders);
  }

  // GET /api/stats/overview - 获取概览数据
  if (method === 'GET' && path === '/api/stats/overview') {
    const stats = await db.getStats();
    const todayStats = await db.getTodayStats();

    // 获取最近7天的订单趋势
    const recentOrders = await db.db.prepare(`
      SELECT DATE(created_at) as date, COUNT(*) as count, SUM(amount) as revenue
      FROM orders
      WHERE status = 'delivered' AND created_at >= datetime('now', '-7 days')
      GROUP BY DATE(created_at)
      ORDER BY date
    `).all();

    // 获取热门商品
    const topProducts = await db.db.prepare(`
      SELECT p.name, p.sales_count, p.price
      FROM products p
      WHERE p.is_active = 1
      ORDER BY p.sales_count DESC
      LIMIT 5
    `).all();

    return jsonResponse({
      data: {
        ...stats,
        ...todayStats,
        recentOrders: recentOrders.results,
        topProducts: topProducts.results
      }
    }, 200, corsHeaders);
  }

  return jsonResponse({ error: 'Not Found' }, 404, corsHeaders);
}
