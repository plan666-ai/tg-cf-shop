// worker/src/api/products.js - 商品 API
import { jsonResponse } from '../index.js';

export async function handleProductsApi(request, db, path, method, corsHeaders) {
  // GET /api/products - 获取商品列表
  if (method === 'GET' && path === '/api/products') {
    const url = new URL(request.url);
    const categoryId = url.searchParams.get('category_id');
    const products = await db.getProducts(categoryId);
    return jsonResponse({ data: products }, 200, corsHeaders);
  }

  // POST /api/products - 创建商品
  if (method === 'POST' && path === '/api/products') {
    const data = await request.json();
    const id = await db.createProduct(data);
    return jsonResponse({ data: { id }, message: '创建成功' }, 201, corsHeaders);
  }

  // 商品详情/更新/删除
  const productMatch = path.match(/^\/api\/products\/(\d+)$/);
  if (productMatch) {
    const productId = parseInt(productMatch[1]);

    // GET /api/products/:id
    if (method === 'GET') {
      const product = await db.getProduct(productId);
      if (!product) {
        return jsonResponse({ error: '商品不存在' }, 404, corsHeaders);
      }
      return jsonResponse({ data: product }, 200, corsHeaders);
    }

    // PUT /api/products/:id
    if (method === 'PUT') {
      const data = await request.json();
      await db.updateProduct(productId, data);
      return jsonResponse({ message: '更新成功' }, 200, corsHeaders);
    }

    // DELETE /api/products/:id
    if (method === 'DELETE') {
      await db.updateProduct(productId, { is_active: 0 });
      return jsonResponse({ message: '删除成功' }, 200, corsHeaders);
    }
  }

  // PATCH /api/products/:id/toggle - 上下架
  const toggleMatch = path.match(/^\/api\/products\/(\d+)\/toggle$/);
  if (toggleMatch && method === 'PATCH') {
    const productId = parseInt(toggleMatch[1]);
    await db.toggleProduct(productId);
    return jsonResponse({ message: '操作成功' }, 200, corsHeaders);
  }

  // GET /api/products/:id/cards - 获取卡密列表
  const cardsMatch = path.match(/^\/api\/products\/(\d+)\/cards$/);
  if (cardsMatch) {
    const productId = parseInt(cardsMatch[1]);

    if (method === 'GET') {
      const cards = await db.getCards(productId);
      return jsonResponse({ data: cards }, 200, corsHeaders);
    }

    // POST /api/products/:id/cards - 批量导入卡密
    if (method === 'POST') {
      const { cards } = await request.json();
      if (!cards || !Array.isArray(cards) || cards.length === 0) {
        return jsonResponse({ error: '卡密列表不能为空' }, 400, corsHeaders);
      }
      await db.addCards(productId, cards);
      return jsonResponse({ message: `成功导入 ${cards.length} 个卡密` }, 201, corsHeaders);
    }
  }

  // DELETE /api/products/:productId/cards/:cardId - 删除卡密
  const cardDeleteMatch = path.match(/^\/api\/products\/(\d+)\/cards\/(\d+)$/);
  if (cardDeleteMatch && method === 'DELETE') {
    const cardId = parseInt(cardDeleteMatch[2]);
    await db.deleteCard(cardId);
    return jsonResponse({ message: '删除成功' }, 200, corsHeaders);
  }

  // GET /api/categories - 获取分类列表
  if (method === 'GET' && path === '/api/categories') {
    const categories = await db.getCategories();
    return jsonResponse({ data: categories }, 200, corsHeaders);
  }

  // POST /api/categories - 创建分类
  if (method === 'POST' && path === '/api/categories') {
    const { name, icon, description } = await request.json();
    const id = await db.createCategory(name, icon, description);
    return jsonResponse({ data: { id }, message: '创建成功' }, 201, corsHeaders);
  }

  // PUT /api/categories/:id - 更新分类
  const categoryMatch = path.match(/^\/api\/categories\/(\d+)$/);
  if (categoryMatch && method === 'PUT') {
    const categoryId = parseInt(categoryMatch[1]);
    const data = await request.json();
    await db.updateCategory(categoryId, data);
    return jsonResponse({ message: '更新成功' }, 200, corsHeaders);
  }

  return jsonResponse({ error: 'Not Found' }, 404, corsHeaders);
}
