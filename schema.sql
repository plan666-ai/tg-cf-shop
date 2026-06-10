-- TG卡密销售系统 D1 数据库 Schema

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE NOT NULL,
    username TEXT,
    first_name TEXT,
    balance REAL DEFAULT 0,
    invite_code TEXT UNIQUE,
    invited_by TEXT,
    total_spent REAL DEFAULT 0,
    successful_count INTEGER DEFAULT 0,
    order_count INTEGER DEFAULT 0,
    is_banned INTEGER DEFAULT 0,
    is_admin INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 商品分类
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    icon TEXT DEFAULT '📦',
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 商品
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    original_price REAL,
    stock_count INTEGER DEFAULT 0,
    sales_count INTEGER DEFAULT 0,
    min_quantity INTEGER DEFAULT 1,
    max_quantity INTEGER DEFAULT 10,
    is_active INTEGER DEFAULT 1,
    auto_delivery INTEGER DEFAULT 1,
    delivery_type TEXT DEFAULT 'card',
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- 卡密库存
CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    is_sold INTEGER DEFAULT 0,
    order_id INTEGER,
    sold_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- 订单
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_no TEXT UNIQUE NOT NULL,
    user_id TEXT NOT NULL,
    product_id INTEGER NOT NULL,
    product_name TEXT,
    quantity INTEGER DEFAULT 1,
    unit_price REAL NOT NULL,
    amount REAL NOT NULL,
    payment_method TEXT,
    payment_id TEXT,
    status TEXT DEFAULT 'pending',
    card_content TEXT,
    delivery_info TEXT,
    remark TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    paid_at DATETIME,
    delivered_at DATETIME,
    expired_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 佣金记录
CREATE TABLE IF NOT EXISTS commissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    from_user_id TEXT NOT NULL,
    order_id INTEGER NOT NULL,
    order_amount REAL NOT NULL,
    commission_rate INTEGER DEFAULT 10,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    settled_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (from_user_id) REFERENCES users(user_id),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- 充值卡
CREATE TABLE IF NOT EXISTS redeem_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    amount REAL NOT NULL,
    is_used INTEGER DEFAULT 0,
    used_by TEXT,
    used_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (used_by) REFERENCES users(user_id)
);

-- 系统配置
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    description TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 操作日志
CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    action TEXT NOT NULL,
    detail TEXT,
    ip TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_users_invite_code ON users(invite_code);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_cards_product_id ON cards(product_id);
CREATE INDEX IF NOT EXISTS idx_cards_is_sold ON cards(is_sold);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_no ON orders(order_no);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_commissions_user_id ON commissions(user_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON commissions(status);
CREATE INDEX IF NOT EXISTS idx_redeem_cards_code ON redeem_cards(code);
CREATE INDEX IF NOT EXISTS idx_redeem_cards_is_used ON redeem_cards(is_used);

-- 插入默认配置
INSERT OR IGNORE INTO settings (key, value, description) VALUES
    ('shop_name', 'TG卡密商店', '商店名称'),
    ('shop_description', '欢迎光临！', '商店描述'),
    ('commission_rate', '10', '佣金比例(%)'),
    ('min_withdraw', '1000', '最低提现金额(分)'),
    ('order_expire_minutes', '30', '订单过期时间(分钟)'),
    ('welcome_message', '👋 欢迎来到小店！\n\n请选择：', '欢迎消息'),
    ('welcome_parse_mode', 'HTML', '欢迎消息格式(HTML/MarkdownV2)'),
    ('support_username', '', '客服用户名'),
    ('payment_stars_enabled', '1', 'Stars支付开关'),
    ('payment_usdt_enabled', '0', 'USDT支付开关'),
    ('payment_usdt_address', '', 'USDT收款地址(TRC20)'),
    ('payment_usdt_rate', '7.2', 'USDT汇率(1USDT=?CNY)'),
    ('payment_usdt_network', 'TRC20', 'USDT网络(TRC20/ERC20)'),
    ('payment_yipay_enabled', '0', '易支付开关'),
    ('payment_yipay_url', '', '易支付接口地址'),
    ('payment_yipay_pid', '', '易支付商户ID'),
    ('payment_yipay_key', '', '易支付商户密钥'),
    ('payment_codepay_enabled', '0', '码支付开关'),
    ('payment_codepay_id', '', '码支付商户ID'),
    ('payment_codepay_key', '', '码支付商户密钥'),
    ('payment_codepay_url', '', '码支付接口地址');

-- 插入默认分类
INSERT OR IGNORE INTO categories (name, icon, sort_order) VALUES
    ('🎮 游戏充值', '🎮', 1),
    ('📱 会员服务', '📱', 2),
    ('🔑 激活码', '🔑', 3),
    ('🎁 其他商品', '🎁', 4);
