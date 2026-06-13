# TG Shop Bot - Telegram 卡密销售系统

基于 Cloudflare Workers + D1 数据库的 Telegram 机器人卡密自动销售系统。

## 功能特性

- 🤖 Telegram Bot 自动销售卡密
- 💰 多种支付方式（Stars、USDT、易支付、码支付）
- 📦 自动发货
- 👥 邀请返佣系统
- 💳 充值卡系统
- 📊 数据统计看板
- 🔐 管理后台

## 技术栈

- **后端**: Cloudflare Workers
- **数据库**: Cloudflare D1 (SQLite)
- **前端管理后台**: Vue 3 + Element Plus
- **机器人框架**: Telegram Bot API

## 部署步骤

### 前置准备

1. **注册 Cloudflare 账号**
   - 访问 [cloudflare.com](https://cloudflare.com) 注册账号

2. **创建 Telegram Bot**
   - 在 Telegram 搜索 [@BotFather](https://t.me/BotFather)
   - 发送 `/newbot` 创建机器人
   - 记录 Bot Token

3. **安装 Node.js**
   - 下载安装 [Node.js](https://nodejs.org/) (建议 v18+)

### 第一步：克隆项目

```bash
git clone https://github.com/你的用户名/TG卡密销售系统.git
cd TG卡密销售系统
```

### 第二步：安装 Wrangler CLI

```bash
npm install -g wrangler
```

### 第三步：登录 Cloudflare

```bash
wrangler login
```

### 第四步：创建 D1 数据库

```bash
cd worker
wrangler d1 create tg-shop-db
```

记录输出的 `database_id`，然后修改 `wrangler.toml`：

```toml
[[d1_databases]]
binding = "DB"
database_name = "tg-shop-db"
database_id = "你的数据库ID"
```

### 第五步：初始化数据库

```bash
wrangler d1 execute tg-shop-db --file=./schema.sql
```

### 第六步：配置环境变量

修改 `wrangler.toml` 中的变量：

```toml
[vars]
BOT_TOKEN = "你的Bot Token"
ADMIN_PASSWORD = "管理后台密码"
WEBHOOK_SECRET = "webhook密钥(自定义)"
```

### 第七步：部署 Worker

```bash
npm install
wrangler deploy
```

部署成功后会得到一个 URL，例如：`https://tg-shop-bot.xxx.workers.dev`

### 第八步：设置 Webhook

访问以下 URL 设置 Telegram Webhook：

```
https://api.telegram.org/bot你的BOT_TOKEN/setWebhook?url=https://你的Worker地址/webhook
```

### 第九步：访问管理后台

1. 浏览器访问 Worker 地址
2. 输入管理密码登录
3. 在设置中配置支付方式、商品分类等

## 本地开发（可选）

### 安装依赖

```bash
# 后端
cd worker
npm install

# 前端管理后台
cd ../admin
npm install
```

### 本地运行

```bash
cd worker
wrangler dev
```

### 本地管理后台开发

```bash
cd admin
npm run dev
```

## 项目结构

```
TG卡密销售系统/
├── admin/                  # Vue 管理后台
│   ├── src/
│   │   ├── views/         # 页面组件
│   │   ├── api/           # API 请求
│   │   └── router/        # 路由配置
│   └── package.json
├── worker/                 # Cloudflare Worker
│   ├── src/
│   │   ├── admin/         # 线上管理后台 HTML
│   │   ├── api/           # API 路由
│   │   ├── bot/           # Bot 处理逻辑
│   │   ├── services/      # 业务服务
│   │   └── utils/         # 工具函数
│   ├── schema.sql         # 数据库结构
│   ├── wrangler.toml      # Wrangler 配置
│   └── package.json
└── README.md
```

## 配置说明

### 支付配置

在管理后台 → 设置 → 支付设置中配置：

| 支付方式 | 说明 |
|---------|------|
| Telegram Stars | TG 内置支付，自动发货 |
| USDT | 需要配置收款地址和汇率 |
| 易支付 | 需要配置商户信息 |
| 码支付 | 需要配置商户信息 |

### 商品配置

1. 创建商品分类
2. 添加商品（设置价格、库存）
3. 上传卡密

### 邀请返佣

在设置中配置佣金比例（默认 10%），用户邀请好友购买后可获得佣金。

## 常见问题

### Q: Bot 没有响应？

A: 检查 Webhook 是否设置正确：
```
https://api.telegram.org/bot你的TOKEN/getWebhookInfo
```

### Q: 数据库报错？

A: 确保已执行 `schema.sql` 初始化数据库

### Q: 支付不成功？

A: 检查支付配置是否正确，确保支付方式已开启

## 更新部署

```bash
cd worker
git pull
wrangler deploy
```

## 许可证

MIT License

## 联系方式

如有问题，请通过 Telegram Bot 联系作者。[点击联系作者](https://t.me/planbnitbot)


部分页面截图
<img width="1920" height="971" alt="image" src="https://github.com/user-attachments/assets/fe90a7b8-5df6-490b-b886-f1e5da4ba1d2" />
<img width="1920" height="971" alt="image" src="https://github.com/user-attachments/assets/612190aa-56c3-4f96-ac1e-701bb2faa178" />
机器人端
<img width="697" height="1001" alt="image" src="https://github.com/user-attachments/assets/db53b774-85c9-49e2-9585-cb75f48b5670" />
项目会持续更新也请各位大佬指出不足让此项目更加完善 有能力二开的开发者朋友也可以拿去二开但不要将此代码进行盈利 出现任何问题和原创作者无关



