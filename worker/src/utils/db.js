// worker/src/utils/db.js - D1 数据库操作封装

export class Database {
  constructor(db) {
    this.db = db;
  }

  // 用户相关
  async getUser(userId) {
    const result = await this.db.prepare(
      'SELECT * FROM users WHERE user_id = ?'
    ).bind(userId).first();
    return result;
  }

  async createUser(userId, username, firstName, inviteCode = null) {
    const code = generateInviteCode();
    await this.db.prepare(
      'INSERT INTO users (user_id, username, first_name, invite_code, invited_by) VALUES (?, ?, ?, ?, ?)'
    ).bind(userId, username, firstName, code, inviteCode).run();
    return await this.getUser(userId);
  }

  async ensureUser(userId, username, firstName) {
    let user = await this.getUser(userId);
    if (!user) {
      user = await this.createUser(userId, username, firstName);
    } else if (user.username !== username || user.first_name !== firstName) {
      await this.db.prepare(
        'UPDATE users SET username = ?, first_name = ? WHERE user_id = ?'
      ).bind(username, firstName, userId).run();
    }
    return user;
  }

  async updateUserBalance(userId, amount) {
    await this.db.prepare(
      'UPDATE users SET balance = balance + ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?'
    ).bind(amount, userId).run();
  }

  async deductBalance(userId, amount) {
    const user = await this.getUser(userId);
    if (!user || user.balance < amount) {
      return false;
    }
    await this.db.prepare(
      'UPDATE users SET balance = balance - ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?'
    ).bind(amount, userId).run();
    return true;
  }

  // 分类相关
  async getCategories() {
    const result = await this.db.prepare(
      'SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order'
    ).all();
    return result.results;
  }

  async getCategory(id) {
    return await this.db.prepare(
      'SELECT * FROM categories WHERE id = ?'
    ).bind(id).first();
  }

  async createCategory(name, icon, description = '') {
    const result = await this.db.prepare(
      'INSERT INTO categories (name, icon, description) VALUES (?, ?, ?)'
    ).bind(name, icon, description).run();
    return result.meta.last_row_id;
  }

  async updateCategory(id, data) {
    const sets = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      sets.push(`${key} = ?`);
      values.push(value);
    }
    values.push(id);
    await this.db.prepare(
      `UPDATE categories SET ${sets.join(', ')} WHERE id = ?`
    ).bind(...values).run();
  }

  // 商品相关
  async getProducts(categoryId = null) {
    let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1';
    const params = [];

    if (categoryId) {
      query += ' AND p.category_id = ?';
      params.push(categoryId);
    }

    query += ' ORDER BY p.sort_order, p.id DESC';

    const result = await this.db.prepare(query).bind(...params).all();
    return result.results;
  }

  async getActiveProducts(categoryId = null) {
    let query = 'SELECT * FROM products WHERE is_active = 1';
    const params = [];

    if (categoryId) {
      query += ' AND category_id = ?';
      params.push(categoryId);
    }

    query += ' ORDER BY sort_order, id DESC';

    const result = await this.db.prepare(query).bind(...params).all();
    return result.results;
  }

  async getProduct(id) {
    return await this.db.prepare(
      'SELECT * FROM products WHERE id = ?'
    ).bind(id).first();
  }

  async createProduct(data) {
    const result = await this.db.prepare(
      'INSERT INTO products (category_id, name, description, price, original_price, min_quantity, max_quantity, auto_delivery, delivery_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(
      data.category_id,
      data.name,
      data.description || '',
      data.price,
      data.original_price || null,
      data.min_quantity || 1,
      data.max_quantity || 10,
      data.auto_delivery ?? 1,
      data.delivery_type || 'card'
    ).run();
    return result.meta.last_row_id;
  }

  async updateProduct(id, data) {
    const sets = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      sets.push(`${key} = ?`);
      values.push(value);
    }
    sets.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    await this.db.prepare(
      `UPDATE products SET ${sets.join(', ')} WHERE id = ?`
    ).bind(...values).run();
  }

  async toggleProduct(id) {
    await this.db.prepare(
      'UPDATE products SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(id).run();
  }

  async updateProductStock(productId, count) {
    await this.db.prepare(
      'UPDATE products SET stock_count = stock_count + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(count, productId).run();
  }

  async incrementSales(productId, quantity = 1) {
    await this.db.prepare(
      'UPDATE products SET sales_count = sales_count + ?, stock_count = stock_count - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(quantity, quantity, productId).run();
  }

  // 卡密相关
  async getCards(productId, onlyAvailable = false) {
    let query = 'SELECT * FROM cards WHERE product_id = ?';
    if (onlyAvailable) {
      query += ' AND is_sold = 0';
    }
    query += ' ORDER BY id';
    const result = await this.db.prepare(query).bind(productId).all();
    return result.results;
  }

  async getCardCount(productId) {
    const result = await this.db.prepare(
      'SELECT COUNT(*) as count FROM cards WHERE product_id = ? AND is_sold = 0'
    ).bind(productId).first();
    return result.count;
  }

  async addCards(productId, contents) {
    const stmt = this.db.prepare(
      'INSERT INTO cards (product_id, content) VALUES (?, ?)'
    );
    const batch = contents.map(content => stmt.bind(productId, content));
    await this.db.batch(batch);
    await this.updateProductStock(productId, contents.length);
  }

  async getAvailableCards(productId, quantity) {
    const result = await this.db.prepare(
      'SELECT * FROM cards WHERE product_id = ? AND is_sold = 0 LIMIT ?'
    ).bind(productId, quantity).all();
    return result.results;
  }

  async markCardSold(cardId, orderId) {
    await this.db.prepare(
      'UPDATE cards SET is_sold = 1, order_id = ?, sold_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(orderId, cardId).run();
  }

  async deleteCard(id) {
    const card = await this.db.prepare('SELECT * FROM cards WHERE id = ?').bind(id).first();
    if (card && !card.is_sold) {
      await this.db.prepare('DELETE FROM cards WHERE id = ?').bind(id).run();
      await this.updateProductStock(card.product_id, -1);
    }
  }

  // 订单相关
  async createOrder(userId, productId, quantity, amount, unitPrice, productName) {
    const orderNo = generateOrderNo();
    const result = await this.db.prepare(
      'INSERT INTO orders (order_no, user_id, product_id, product_name, quantity, amount, unit_price) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(orderNo, userId, productId, productName, quantity, amount, unitPrice).run();

    await this.db.prepare(
      'UPDATE users SET order_count = order_count + 1, total_spent = total_spent + ? WHERE user_id = ?'
    ).bind(amount, userId).run();

    return await this.getOrder(result.meta.last_row_id);
  }

  async getOrder(id) {
    return await this.db.prepare(
      'SELECT * FROM orders WHERE id = ?'
    ).bind(id).first();
  }

  async getOrderByNo(orderNo) {
    return await this.db.prepare(
      'SELECT * FROM orders WHERE order_no = ?'
    ).bind(orderNo).first();
  }

  async getUserOrders(userId, limit = 20, offset = 0) {
    const result = await this.db.prepare(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
    ).bind(userId, limit, offset).all();
    return result.results;
  }

  async getOrders(status = null, limit = 50, offset = 0) {
    let query = 'SELECT o.*, u.username FROM orders o LEFT JOIN users u ON o.user_id = u.user_id WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND o.status = ?';
      params.push(status);
    }

    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const result = await this.db.prepare(query).bind(...params).all();
    return result.results;
  }

  async updateOrderStatus(id, status) {
    const updates = { status };
    if (status === 'paid') {
      await this.db.prepare(
        'UPDATE orders SET status = ?, paid_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind(status, id).run();
    } else if (status === 'delivered') {
      await this.db.prepare(
        'UPDATE orders SET status = ?, delivered_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind(status, id).run();
    } else {
      await this.db.prepare(
        'UPDATE orders SET status = ? WHERE id = ?'
      ).bind(status, id).run();
    }
  }

  async deliverOrder(orderId, cardContent) {
    await this.db.prepare(
      'UPDATE orders SET status = ?, card_content = ?, delivered_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind('delivered', cardContent, orderId).run();
  }

  // 佣金相关
  async createCommission(userId, fromUserId, orderId, orderAmount, rate) {
    const amount = Math.floor(orderAmount * rate / 100);
    if (amount <= 0) return;

    await this.db.prepare(
      'INSERT INTO commissions (user_id, from_user_id, order_id, order_amount, commission_rate, amount) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(userId, fromUserId, orderId, orderAmount, rate, amount).run();
  }

  async getUserCommissions(userId) {
    const result = await this.db.prepare(
      'SELECT * FROM commissions WHERE user_id = ? ORDER BY created_at DESC'
    ).bind(userId).all();
    return result.results;
  }

  async getPendingCommissions(userId) {
    const result = await this.db.prepare(
      "SELECT SUM(amount) as total FROM commissions WHERE user_id = ? AND status = 'pending'"
    ).bind(userId).first();
    return result.total || 0;
  }

  async settleCommission(id) {
    const commission = await this.db.prepare(
      'SELECT * FROM commissions WHERE id = ?'
    ).bind(id).first();

    if (commission && commission.status === 'pending') {
      await this.db.prepare(
        "UPDATE commissions SET status = 'settled', settled_at = CURRENT_TIMESTAMP WHERE id = ?"
      ).bind(id).run();

      await this.updateUserBalance(commission.user_id, commission.amount);
    }
  }

  // 统计相关
  async getStats() {
    const [users, orders, revenue, products] = await Promise.all([
      this.db.prepare('SELECT COUNT(*) as count FROM users').first(),
      this.db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'delivered'").first(),
      this.db.prepare("SELECT SUM(amount) as total FROM orders WHERE status = 'delivered'").first(),
      this.db.prepare('SELECT COUNT(*) as count FROM products WHERE is_active = 1').first()
    ]);

    return {
      totalUsers: users.count,
      totalOrders: orders.count,
      totalRevenue: revenue.total || 0,
      activeProducts: products.count
    };
  }

  async getTodayStats() {
    const today = new Date().toISOString().split('T')[0];
    const [orders, revenue] = await Promise.all([
      this.db.prepare(
        "SELECT COUNT(*) as count FROM orders WHERE status = 'delivered' AND DATE(created_at) = ?"
      ).bind(today).first(),
      this.db.prepare(
        "SELECT SUM(amount) as total FROM orders WHERE status = 'delivered' AND DATE(created_at) = ?"
      ).bind(today).first()
    ]);

    return {
      todayOrders: orders.count,
      todayRevenue: revenue.total || 0
    };
  }

  // 配置相关
  async getSetting(key) {
    const result = await this.db.prepare(
      'SELECT value FROM settings WHERE key = ?'
    ).bind(key).first();
    return result?.value;
  }

  async setSetting(key, value) {
    await this.db.prepare(
      'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)'
    ).bind(key, value).run();
  }

  async getSettings() {
    const result = await this.db.prepare('SELECT * FROM settings').all();
    return result.results;
  }

  // 用户统计
  async getUsers(limit = 50, offset = 0) {
    const result = await this.db.prepare(
      'SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?'
    ).bind(limit, offset).all();
    return result.results;
  }

  async getUserCount() {
    const result = await this.db.prepare('SELECT COUNT(*) as count FROM users').first();
    return result.count;
  }

  async getInviteStats(userId) {
    const result = await this.db.prepare(
      'SELECT COUNT(*) as count FROM users WHERE invited_by = ?'
    ).bind(userId).first();
    return result.count;
  }
}

// 工具函数
function generateOrderNo() {
  const now = new Date();
  const date = now.toISOString().replace(/[-T:\.Z]/g, '').slice(0, 14);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TG${date}${random}`;
}

function generateInviteCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}
