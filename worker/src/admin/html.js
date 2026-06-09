// worker/src/admin/html.js - 企业管理后台界面
export function getAdminHTML() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TG Shop Admin</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
<style>
:root {
  --primary: #6366f1;
  --primary-dark: #4f46e5;
  --primary-light: #818cf8;
  --secondary: #0ea5e9;
  --success: #22c55e;
  --warning: #f59e0b;
  --danger: #ef4444;
  --info: #06b6d4;
  --dark: #0f172a;
  --dark-2: #1e293b;
  --dark-3: #334155;
  --gray: #64748b;
  --gray-light: #94a3b8;
  --light: #f1f5f9;
  --light-2: #e2e8f0;
  --white: #ffffff;
  --sidebar-width: 260px;
  --header-height: 64px;
  --radius: 12px;
  --shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif; background:var(--light); color:var(--dark); overflow-x:hidden; }
::-webkit-scrollbar { width:6px; height:6px; }
::-webkit-scrollbar-track { background:transparent; }
::-webkit-scrollbar-thumb { background:var(--gray-light); border-radius:3px; }
::-webkit-scrollbar-thumb:hover { background:var(--gray); }

/* Login */
.login-page { min-height:100vh; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); position:relative; overflow:hidden; }
.login-page::before { content:''; position:absolute; top:-50%; left:-50%; width:200%; height:200%; background:radial-gradient(circle,rgba(255,255,255,0.1) 0%,transparent 60%); animation:rotate 30s linear infinite; }
@keyframes rotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
.login-card { background:rgba(255,255,255,0.95); backdrop-filter:blur(20px); padding:48px; border-radius:20px; box-shadow:var(--shadow-xl); width:420px; position:relative; z-index:1; }
.login-logo { text-align:center; margin-bottom:32px; }
.login-logo .icon { width:64px; height:64px; background:linear-gradient(135deg,var(--primary),var(--secondary)); border-radius:16px; display:inline-flex; align-items:center; justify-content:center; margin-bottom:16px; }
.login-logo .icon i { font-size:28px; color:white; }
.login-logo h1 { font-size:24px; font-weight:700; color:var(--dark); }
.login-logo p { color:var(--gray); font-size:14px; margin-top:4px; }
.input-group { margin-bottom:20px; position:relative; }
.input-group label { display:block; font-size:13px; font-weight:500; color:var(--dark-3); margin-bottom:6px; }
.input-group .input-wrapper { position:relative; }
.input-group i.input-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--gray-light); font-size:16px; }
.input-group input { width:100%; padding:12px 14px 12px 42px; border:2px solid var(--light-2); border-radius:10px; font-size:14px; font-family:inherit; transition:var(--transition); background:var(--white); }
.input-group input:focus { outline:none; border-color:var(--primary); box-shadow:0 0 0 3px rgba(99,102,241,0.1); }
.btn-login { width:100%; padding:14px; background:linear-gradient(135deg,var(--primary),var(--primary-dark)); color:white; border:none; border-radius:10px; font-size:15px; font-weight:600; cursor:pointer; transition:var(--transition); font-family:inherit; }
.btn-login:hover { transform:translateY(-1px); box-shadow:0 4px 12px rgba(99,102,241,0.4); }
.btn-login:active { transform:translateY(0); }
.login-error { color:var(--danger); font-size:13px; text-align:center; margin-top:12px; display:none; }

/* Layout */
.app { display:none; min-height:100vh; }
.sidebar { position:fixed; left:0; top:0; width:var(--sidebar-width); height:100vh; background:linear-gradient(180deg,var(--dark) 0%,var(--dark-2) 100%); z-index:100; display:flex; flex-direction:column; transition:var(--transition); }
.sidebar-header { padding:24px; border-bottom:1px solid rgba(255,255,255,0.08); }
.sidebar-header .brand { display:flex; align-items:center; gap:12px; }
.sidebar-header .brand-icon { width:40px; height:40px; background:linear-gradient(135deg,var(--primary),var(--secondary)); border-radius:10px; display:flex; align-items:center; justify-content:center; }
.sidebar-header .brand-icon i { font-size:18px; color:white; }
.sidebar-header .brand-text h2 { font-size:16px; font-weight:700; color:white; }
.sidebar-header .brand-text p { font-size:11px; color:var(--gray-light); margin-top:2px; }
.sidebar-nav { flex:1; padding:16px 12px; overflow-y:auto; }
.nav-section { margin-bottom:24px; }
.nav-section-title { font-size:11px; font-weight:600; color:var(--gray); text-transform:uppercase; letter-spacing:1px; padding:0 12px; margin-bottom:8px; }
.nav-item { display:flex; align-items:center; gap:12px; padding:11px 16px; border-radius:8px; color:var(--gray-light); cursor:pointer; transition:var(--transition); margin-bottom:2px; font-size:14px; font-weight:500; }
.nav-item:hover { background:rgba(255,255,255,0.06); color:white; }
.nav-item.active { background:var(--primary); color:white; box-shadow:0 4px 12px rgba(99,102,241,0.3); }
.nav-item i { width:20px; text-align:center; font-size:16px; }
.sidebar-footer { padding:16px; border-top:1px solid rgba(255,255,255,0.08); }
.user-info { display:flex; align-items:center; gap:10px; padding:10px; border-radius:8px; cursor:pointer; transition:var(--transition); }
.user-info:hover { background:rgba(255,255,255,0.06); }
.user-avatar { width:36px; height:36px; background:linear-gradient(135deg,var(--primary),var(--secondary)); border-radius:8px; display:flex; align-items:center; justify-content:center; }
.user-avatar i { color:white; font-size:14px; }
.user-name { color:white; font-size:13px; font-weight:500; }
.user-role { color:var(--gray-light); font-size:11px; }

/* Main */
.main { margin-left:var(--sidebar-width); min-height:100vh; }
.header { height:var(--header-height); background:white; border-bottom:1px solid var(--light-2); display:flex; align-items:center; justify-content:space-between; padding:0 32px; position:sticky; top:0; z-index:50; }
.header-left { display:flex; align-items:center; gap:16px; }
.header-left h1 { font-size:20px; font-weight:700; color:var(--dark); }
.breadcrumb { display:flex; align-items:center; gap:8px; font-size:13px; color:var(--gray); }
.breadcrumb span { color:var(--dark); font-weight:500; }
.header-right { display:flex; align-items:center; gap:12px; }
.header-btn { width:40px; height:40px; border-radius:10px; border:1px solid var(--light-2); background:white; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:var(--transition); color:var(--gray); position:relative; }
.header-btn:hover { border-color:var(--primary); color:var(--primary); }
.header-btn .badge { position:absolute; top:-4px; right:-4px; width:18px; height:18px; background:var(--danger); border-radius:50%; font-size:10px; color:white; display:flex; align-items:center; justify-content:center; }
.content { padding:28px 32px; }

/* Stats */
.stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:28px; }
.stat-card { background:white; border-radius:var(--radius); padding:24px; box-shadow:var(--shadow); transition:var(--transition); border:1px solid var(--light-2); position:relative; overflow:hidden; }
.stat-card::before { content:''; position:absolute; top:0; left:0; width:100%; height:3px; }
.stat-card:nth-child(1)::before { background:linear-gradient(90deg,var(--primary),var(--primary-light)); }
.stat-card:nth-child(2)::before { background:linear-gradient(90deg,var(--success),#4ade80); }
.stat-card:nth-child(3)::before { background:linear-gradient(90deg,var(--warning),#fbbf24); }
.stat-card:nth-child(4)::before { background:linear-gradient(90deg,var(--info),#22d3ee); }
.stat-card:hover { transform:translateY(-2px); box-shadow:var(--shadow-lg); }
.stat-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
.stat-icon { width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:20px; }
.stat-card:nth-child(1) .stat-icon { background:rgba(99,102,241,0.1); color:var(--primary); }
.stat-card:nth-child(2) .stat-icon { background:rgba(34,197,94,0.1); color:var(--success); }
.stat-card:nth-child(3) .stat-icon { background:rgba(245,158,11,0.1); color:var(--warning); }
.stat-card:nth-child(4) .stat-icon { background:rgba(6,182,212,0.1); color:var(--info); }
.stat-change { font-size:12px; font-weight:600; padding:4px 8px; border-radius:6px; }
.stat-change.up { background:rgba(34,197,94,0.1); color:var(--success); }
.stat-change.down { background:rgba(239,68,68,0.1); color:var(--danger); }
.stat-value { font-size:32px; font-weight:700; color:var(--dark); margin-bottom:4px; }
.stat-label { font-size:13px; color:var(--gray); font-weight:500; }

/* Card */
.card { background:white; border-radius:var(--radius); box-shadow:var(--shadow); border:1px solid var(--light-2); margin-bottom:24px; }
.card-header { padding:20px 24px; border-bottom:1px solid var(--light-2); display:flex; justify-content:space-between; align-items:center; }
.card-header h3 { font-size:16px; font-weight:600; color:var(--dark); }
.card-body { padding:24px; }
.card-body.no-padding { padding:0; }

/* Table */
table { width:100%; border-collapse:collapse; }
thead th { padding:14px 20px; text-align:left; font-size:12px; font-weight:600; color:var(--gray); text-transform:uppercase; letter-spacing:0.5px; background:var(--light); border-bottom:1px solid var(--light-2); }
tbody td { padding:16px 20px; font-size:14px; color:var(--dark-3); border-bottom:1px solid var(--light-2); }
tbody tr { transition:var(--transition); }
tbody tr:hover { background:rgba(99,102,241,0.02); }
tbody tr:last-child td { border-bottom:none; }

/* Tags */
.tag { display:inline-flex; align-items:center; gap:4px; padding:4px 10px; border-radius:6px; font-size:12px; font-weight:600; }
.tag-success { background:rgba(34,197,94,0.1); color:var(--success); }
.tag-warning { background:rgba(245,158,11,0.1); color:var(--warning); }
.tag-danger { background:rgba(239,68,68,0.1); color:var(--danger); }
.tag-info { background:rgba(6,182,212,0.1); color:var(--info); }
.tag-primary { background:rgba(99,102,241,0.1); color:var(--primary); }

/* Buttons */
.btn { display:inline-flex; align-items:center; gap:8px; padding:10px 20px; border-radius:8px; font-size:14px; font-weight:500; cursor:pointer; transition:var(--transition); border:none; font-family:inherit; }
.btn-primary { background:var(--primary); color:white; }
.btn-primary:hover { background:var(--primary-dark); transform:translateY(-1px); box-shadow:0 4px 12px rgba(99,102,241,0.3); }
.btn-success { background:var(--success); color:white; }
.btn-success:hover { background:#16a34a; }
.btn-danger { background:var(--danger); color:white; }
.btn-danger:hover { background:#dc2626; }
.btn-outline { background:transparent; border:1px solid var(--light-2); color:var(--dark-3); }
.btn-outline:hover { border-color:var(--primary); color:var(--primary); }
.btn-sm { padding:6px 14px; font-size:12px; }
.btn-icon { width:36px; height:36px; padding:0; display:flex; align-items:center; justify-content:center; border-radius:8px; }

/* Actions */
.actions { display:flex; gap:6px; }

/* Modal */
.modal-overlay { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); backdrop-filter:blur(4px); z-index:1000; justify-content:center; align-items:center; }
.modal-overlay.show { display:flex; animation:fadeIn 0.2s; }
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
.modal { background:white; border-radius:16px; width:520px; max-height:85vh; overflow:hidden; box-shadow:var(--shadow-xl); animation:slideUp 0.3s; }
@keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
.modal-header { padding:20px 24px; border-bottom:1px solid var(--light-2); display:flex; justify-content:space-between; align-items:center; }
.modal-header h3 { font-size:18px; font-weight:600; }
.modal-close { width:32px; height:32px; border-radius:8px; border:none; background:var(--light); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:var(--transition); color:var(--gray); }
.modal-close:hover { background:var(--danger); color:white; }
.modal-body { padding:24px; overflow-y:auto; max-height:60vh; }
.modal-footer { padding:16px 24px; border-top:1px solid var(--light-2); display:flex; justify-content:flex-end; gap:10px; }

/* Form */
.form-group { margin-bottom:18px; }
.form-group label { display:block; font-size:13px; font-weight:500; color:var(--dark-3); margin-bottom:6px; }
.form-group input,.form-group textarea,.form-group select { width:100%; padding:10px 14px; border:2px solid var(--light-2); border-radius:8px; font-size:14px; font-family:inherit; transition:var(--transition); }
.form-group input:focus,.form-group textarea:focus,.form-group select:focus { outline:none; border-color:var(--primary); box-shadow:0 0 0 3px rgba(99,102,241,0.1); }
.form-group textarea { resize:vertical; min-height:80px; }
.form-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }

/* Toast */
.toast-container { position:fixed; top:20px; right:20px; z-index:2000; display:flex; flex-direction:column; gap:10px; }
.toast { padding:14px 20px; border-radius:10px; color:white; font-size:14px; font-weight:500; box-shadow:var(--shadow-lg); animation:slideIn 0.3s; display:flex; align-items:center; gap:10px; min-width:280px; }
@keyframes slideIn { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
.toast-success { background:var(--success); }
.toast-error { background:var(--danger); }
.toast-info { background:var(--info); }

/* Empty */
.empty { text-align:center; padding:60px 20px; }
.empty i { font-size:48px; color:var(--light-2); margin-bottom:16px; }
.empty p { color:var(--gray); font-size:14px; }

/* Responsive */
@media(max-width:1200px) { .stats-grid{grid-template-columns:repeat(2,1fr)} }
@media(max-width:768px) {
  .sidebar{transform:translateX(-100%)}
  .sidebar.open{transform:translateX(0)}
  .main{margin-left:0}
  .stats-grid{grid-template-columns:1fr}
  .form-row{grid-template-columns:1fr}
}
</style>
</head>
<body>

<!-- Login Page -->
<div id="loginPage" class="login-page">
  <div class="login-card">
    <div class="login-logo">
      <div class="icon"><i class="fas fa-rocket"></i></div>
      <h1>TG Shop Admin</h1>
      <p>Telegram 卡密销售管理系统</p>
    </div>
    <div class="input-group">
      <label>管理员密码</label>
      <div class="input-wrapper">
        <i class="fas fa-lock input-icon"></i>
        <input type="password" id="loginPassword" placeholder="请输入管理员密码" onkeydown="if(event.key==='Enter')doLogin()">
      </div>
    </div>
    <button class="btn-login" onclick="doLogin()">
      <i class="fas fa-arrow-right"></i> 登录系统
    </button>
    <div id="loginError" class="login-error"></div>
  </div>
</div>

<!-- App -->
<div id="app" class="app">
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="brand">
        <div class="brand-icon"><i class="fas fa-rocket"></i></div>
        <div class="brand-text">
          <h2>TG Shop</h2>
          <p>管理后台 v1.0</p>
        </div>
      </div>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section">
        <div class="nav-section-title">概览</div>
        <div class="nav-item active" onclick="nav('dashboard')" data-page="dashboard">
          <i class="fas fa-chart-pie"></i><span>数据看板</span>
        </div>
      </div>
      <div class="nav-section">
        <div class="nav-section-title">业务管理</div>
        <div class="nav-item" onclick="nav('orders')" data-page="orders">
          <i class="fas fa-shopping-cart"></i><span>订单管理</span>
        </div>
        <div class="nav-item" onclick="nav('products')" data-page="products">
          <i class="fas fa-box"></i><span>商品管理</span>
        </div>
        <div class="nav-item" onclick="nav('categories')" data-page="categories">
          <i class="fas fa-tags"></i><span>分类管理</span>
        </div>
        <div class="nav-item" onclick="nav('cards')" data-page="cards">
          <i class="fas fa-key"></i><span>卡密管理</span>
        </div>
      </div>
      <div class="nav-section">
        <div class="nav-section-title">用户与系统</div>
        <div class="nav-item" onclick="nav('users')" data-page="users">
          <i class="fas fa-users"></i><span>用户管理</span>
        </div>
        <div class="nav-item" onclick="nav('settings')" data-page="settings">
          <i class="fas fa-cog"></i><span>系统设置</span>
        </div>
      </div>
    </nav>
    <div class="sidebar-footer">
      <div class="user-info" onclick="doLogout()">
        <div class="user-avatar"><i class="fas fa-user"></i></div>
        <div>
          <div class="user-name">管理员</div>
          <div class="user-role">退出登录</div>
        </div>
      </div>
    </div>
  </aside>

  <main class="main">
    <header class="header">
      <div class="header-left">
        <h1 id="pageTitle">数据看板</h1>
      </div>
      <div class="header-right">
        <div class="header-btn" onclick="location.reload()"><i class="fas fa-sync-alt"></i></div>
      </div>
    </header>

    <div class="content">
      <!-- Dashboard -->
      <div id="page-dashboard">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon"><i class="fas fa-users"></i></div>
              <div class="stat-change up"><i class="fas fa-arrow-up"></i> 活跃</div>
            </div>
            <div class="stat-value" id="s-users">0</div>
            <div class="stat-label">总用户数</div>
          </div>
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon"><i class="fas fa-shopping-bag"></i></div>
              <div class="stat-change up"><i class="fas fa-arrow-up"></i> 进行中</div>
            </div>
            <div class="stat-value" id="s-orders">0</div>
            <div class="stat-label">总订单数</div>
          </div>
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon"><i class="fas fa-yen-sign"></i></div>
              <div class="stat-change up"><i class="fas fa-arrow-up"></i> 增长</div>
            </div>
            <div class="stat-value" id="s-revenue">¥0</div>
            <div class="stat-label">总收入</div>
          </div>
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon"><i class="fas fa-clock"></i></div>
              <div class="stat-change up"><i class="fas fa-arrow-up"></i> 今日</div>
            </div>
            <div class="stat-value" id="s-today">0</div>
            <div class="stat-label">今日订单</div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><h3><i class="fas fa-history"></i> 最近订单</h3></div>
          <div class="card-body no-padding">
            <table>
              <thead><tr><th>订单号</th><th>用户</th><th>商品</th><th>金额</th><th>状态</th><th>时间</th></tr></thead>
              <tbody id="recentOrders"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Orders -->
      <div id="page-orders" style="display:none">
        <div class="card">
          <div class="card-header"><h3><i class="fas fa-shopping-cart"></i> 全部订单</h3></div>
          <div class="card-body no-padding">
            <table>
              <thead><tr><th>订单号</th><th>用户</th><th>商品</th><th>数量</th><th>金额</th><th>支付方式</th><th>状态</th><th>时间</th><th>操作</th></tr></thead>
              <tbody id="ordersList"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Products -->
      <div id="page-products" style="display:none">
        <div class="card">
          <div class="card-header">
            <h3><i class="fas fa-box"></i> 商品列表</h3>
            <button class="btn btn-primary btn-sm" onclick="openProductModal()"><i class="fas fa-plus"></i> 添加商品</button>
          </div>
          <div class="card-body no-padding">
            <table>
              <thead><tr><th>ID</th><th>商品名称</th><th>分类</th><th>价格</th><th>库存</th><th>销量</th><th>状态</th><th>操作</th></tr></thead>
              <tbody id="productsList"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Categories -->
      <div id="page-categories" style="display:none">
        <div class="card">
          <div class="card-header">
            <h3><i class="fas fa-tags"></i> 分类管理</h3>
            <button class="btn btn-primary btn-sm" onclick="openCategoryModal()"><i class="fas fa-plus"></i> 添加分类</button>
          </div>
          <div class="card-body no-padding">
            <table>
              <thead><tr><th>ID</th><th>图标</th><th>名称</th><th>排序</th><th>状态</th><th>操作</th></tr></thead>
              <tbody id="categoriesList"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Cards -->
      <div id="page-cards" style="display:none">
        <div class="card">
          <div class="card-header"><h3><i class="fas fa-key"></i> 卡密管理</h3></div>
          <div class="card-body">
            <div class="form-group">
              <label>选择商品</label>
              <select id="cardProduct" onchange="loadCards()"><option value="">请选择商品</option></select>
            </div>
            <div id="cardStats" style="margin-bottom:16px;font-size:14px;color:var(--gray);"></div>
            <div class="form-group">
              <label>批量导入卡密（每行一个）</label>
              <textarea id="importText" rows="5" placeholder="请输入卡密，每行一个..."></textarea>
            </div>
            <button class="btn btn-primary" onclick="doImportCards()"><i class="fas fa-upload"></i> 导入卡密</button>
          </div>
        </div>
        <div class="card" id="cardsTableCard" style="display:none">
          <div class="card-header"><h3>卡密列表</h3></div>
          <div class="card-body no-padding">
            <table>
              <thead><tr><th>ID</th><th>卡密内容</th><th>状态</th><th>添加时间</th><th>操作</th></tr></thead>
              <tbody id="cardsList"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Users -->
      <div id="page-users" style="display:none">
        <div class="card">
          <div class="card-header">
            <h3><i class="fas fa-users"></i> 用户管理</h3>
            <div style="display:flex;gap:10px;align-items:center">
              <div class="input-group" style="margin:0">
                <div class="input-wrapper">
                  <i class="fas fa-search input-icon" style="left:12px;top:50%;font-size:14px"></i>
                  <input id="userSearch" placeholder="搜索用户ID/用户名/邀请码..." style="padding:8px 12px 8px 36px;font-size:13px;width:250px" onkeydown="if(event.key==='Enter')searchUsers()">
                </div>
              </div>
              <button class="btn btn-primary btn-sm" onclick="searchUsers()"><i class="fas fa-search"></i> 搜索</button>
              <button class="btn btn-outline btn-sm" onclick="document.getElementById('userSearch').value='';loadUsers()"><i class="fas fa-redo"></i> 重置</button>
            </div>
          </div>
          <div class="card-body no-padding">
            <table>
              <thead><tr><th>用户ID</th><th>用户名/昵称</th><th>余额</th><th>订单数</th><th>消费总额</th><th>邀请码</th><th>邀请人</th><th>注册时间</th><th>状态</th><th>操作</th></tr></thead>
              <tbody id="usersList"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Settings -->
      <div id="page-settings" style="display:none">
        <div class="card">
          <div class="card-header"><h3><i class="fas fa-cog"></i> 系统设置</h3></div>
          <div class="card-body">
            <div class="form-group"><label>商店名称</label><input id="set-shop_name"></div>
            <div class="form-group"><label>欢迎消息</label><textarea id="set-welcome_message" rows="3"></textarea></div>
            <div class="form-group"><label>客服用户名（不带@）</label><input id="set-support_username"></div>
            <div class="form-row">
              <div class="form-group"><label>佣金比例 (%)</label><input id="set-commission_rate" type="number"></div>
              <div class="form-group"><label>订单过期时间 (分钟)</label><input id="set-order_expire_minutes" type="number"></div>
            </div>
            <div class="form-group"><label>最低提现金额 (分)</label><input id="set-min_withdraw" type="number"></div>
            <button class="btn btn-primary" onclick="saveSettings()"><i class="fas fa-save"></i> 保存设置</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>

<!-- Modals -->
<div id="productModal" class="modal-overlay">
  <div class="modal">
    <div class="modal-header">
      <h3 id="productModalTitle">添加商品</h3>
      <button class="modal-close" onclick="closeM('productModal')"><i class="fas fa-times"></i></button>
    </div>
    <div class="modal-body">
      <input type="hidden" id="p-edit-id">
      <div class="form-group"><label>商品分类</label><select id="p-category"></select></div>
      <div class="form-group"><label>商品名称</label><input id="p-name" placeholder="请输入商品名称"></div>
      <div class="form-group"><label>商品描述</label><textarea id="p-desc" rows="2" placeholder="请输入商品描述"></textarea></div>
      <div class="form-row">
        <div class="form-group"><label>销售价格 (分)</label><input id="p-price" type="number" placeholder="如 1000 = ¥10.00"></div>
        <div class="form-group"><label>原价 (分)</label><input id="p-original" type="number" placeholder="可选"></div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeM('productModal')">取消</button>
      <button class="btn btn-primary" onclick="saveProduct()"><i class="fas fa-check"></i> 保存</button>
    </div>
  </div>
</div>

<div id="categoryModal" class="modal-overlay">
  <div class="modal">
    <div class="modal-header">
      <h3>添加分类</h3>
      <button class="modal-close" onclick="closeM('categoryModal')"><i class="fas fa-times"></i></button>
    </div>
    <div class="modal-body">
      <div class="form-group"><label>分类名称</label><input id="c-name" placeholder="如：游戏充值"></div>
      <div class="form-row">
        <div class="form-group"><label>图标 (Emoji)</label><input id="c-icon" placeholder="如：🎮" value="📦"></div>
        <div class="form-group"><label>排序 (越小越靠前)</label><input id="c-sort" type="number" value="0"></div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeM('categoryModal')">取消</button>
      <button class="btn btn-primary" onclick="saveCategory()"><i class="fas fa-check"></i> 保存</button>
    </div>
  </div>
</div>

<!-- User Detail Modal -->
<div id="userDetailModal" class="modal-overlay">
  <div class="modal" style="width:700px">
    <div class="modal-header">
      <h3><i class="fas fa-user"></i> 用户详情</h3>
      <button class="modal-close" onclick="closeM('userDetailModal')"><i class="fas fa-times"></i></button>
    </div>
    <div class="modal-body">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
        <div style="background:var(--light);padding:16px;border-radius:8px">
          <div style="font-size:12px;color:var(--gray);margin-bottom:4px">用户ID</div>
          <div style="font-size:16px;font-weight:600" id="ud-id">-</div>
        </div>
        <div style="background:var(--light);padding:16px;border-radius:8px">
          <div style="font-size:12px;color:var(--gray);margin-bottom:4px">用户名</div>
          <div style="font-size:16px;font-weight:600" id="ud-username">-</div>
        </div>
        <div style="background:var(--light);padding:16px;border-radius:8px">
          <div style="font-size:12px;color:var(--gray);margin-bottom:4px">余额</div>
          <div style="font-size:16px;font-weight:600;color:var(--success)" id="ud-balance">-</div>
        </div>
        <div style="background:var(--light);padding:16px;border-radius:8px">
          <div style="font-size:12px;color:var(--gray);margin-bottom:4px">消费总额</div>
          <div style="font-size:16px;font-weight:600;color:var(--primary)" id="ud-spent">-</div>
        </div>
        <div style="background:var(--light);padding:16px;border-radius:8px">
          <div style="font-size:12px;color:var(--gray);margin-bottom:4px">邀请码</div>
          <div style="font-size:16px;font-weight:600" id="ud-invite">-</div>
        </div>
        <div style="background:var(--light);padding:16px;border-radius:8px">
          <div style="font-size:12px;color:var(--gray);margin-bottom:4px">邀请人数</div>
          <div style="font-size:16px;font-weight:600" id="ud-invitecount">-</div>
        </div>
      </div>

      <!-- Tabs -->
      <div style="display:flex;gap:4px;margin-bottom:16px;border-bottom:2px solid var(--light-2);padding-bottom:0">
        <div class="tab-btn active" onclick="switchUserTab('balance',this)" style="padding:10px 20px;cursor:pointer;font-size:14px;font-weight:500;border-bottom:2px solid var(--primary);margin-bottom:-2px;color:var(--primary)">余额操作</div>
        <div class="tab-btn" onclick="switchUserTab('orders',this)" style="padding:10px 20px;cursor:pointer;font-size:14px;font-weight:500;color:var(--gray);border-bottom:2px solid transparent;margin-bottom:-2px">订单记录</div>
        <div class="tab-btn" onclick="switchUserTab('edit',this)" style="padding:10px 20px;cursor:pointer;font-size:14px;font-weight:500;color:var(--gray);border-bottom:2px solid transparent;margin-bottom:-2px">编辑信息</div>
      </div>

      <!-- Balance Tab -->
      <div id="ud-tab-balance">
        <div class="form-row">
          <div class="form-group">
            <label>调整金额（分）</label>
            <input id="ud-amount" type="number" placeholder="正数增加，负数扣减">
          </div>
          <div class="form-group">
            <label>调整原因</label>
            <input id="ud-reason" placeholder="如：管理员充值">
          </div>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px">
          <button class="btn btn-success btn-sm" onclick="quickBalance(1000)"><i class="fas fa-plus"></i> ¥10</button>
          <button class="btn btn-success btn-sm" onclick="quickBalance(5000)"><i class="fas fa-plus"></i> ¥50</button>
          <button class="btn btn-success btn-sm" onclick="quickBalance(10000)"><i class="fas fa-plus"></i> ¥100</button>
          <button class="btn btn-success btn-sm" onclick="quickBalance(50000)"><i class="fas fa-plus"></i> ¥500</button>
          <button class="btn btn-danger btn-sm" onclick="quickBalance(-1000)"><i class="fas fa-minus"></i> ¥10</button>
          <button class="btn btn-danger btn-sm" onclick="quickBalance(-5000)"><i class="fas fa-minus"></i> ¥50</button>
        </div>
        <button class="btn btn-primary" onclick="adjustBalance()"><i class="fas fa-check"></i> 确认调整</button>
      </div>

      <!-- Orders Tab -->
      <div id="ud-tab-orders" style="display:none">
        <table>
          <thead><tr><th>订单号</th><th>商品</th><th>金额</th><th>状态</th><th>时间</th></tr></thead>
          <tbody id="ud-orders-list"></tbody>
        </table>
      </div>

      <!-- Edit Tab -->
      <div id="ud-tab-edit" style="display:none">
        <div class="form-group"><label>用户名</label><input id="ud-edit-username"></div>
        <div class="form-group"><label>昵称</label><input id="ud-edit-firstname"></div>
        <div class="form-group">
          <label>状态</label>
          <select id="ud-edit-banned">
            <option value="0">正常</option>
            <option value="1">封禁</option>
          </select>
        </div>
        <button class="btn btn-primary" onclick="saveUserEdit()"><i class="fas fa-save"></i> 保存修改</button>
      </div>
    </div>
  </div>
</div>

<div class="toast-container" id="toasts"></div>

<script>
const API='/api';
let TOKEN=localStorage.getItem('admin_token');
let CATS=[];

if(TOKEN) checkAuth(); else showLogin();

function showLogin(){document.getElementById('loginPage').style.display='flex';document.getElementById('app').style.display='none'}
function showApp(){document.getElementById('loginPage').style.display='none';document.getElementById('app').style.display='block'}

async function checkAuth(){
  try{const r=await fetch(API+'/stats',{headers:h()});if(r.ok){showApp();loadDashboard()}else{showLogin()}}
  catch(e){showLogin()}
}

async function doLogin(){
  const pw=document.getElementById('loginPassword').value;
  if(!pw){document.getElementById('loginError').textContent='请输入密码';document.getElementById('loginError').style.display='block';return}
  try{
    const r=await fetch(API+'/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pw})});
    const d=await r.json();
    if(d.token){TOKEN=d.token;localStorage.setItem('admin_token',TOKEN);showApp();loadDashboard();toast('登录成功','success')}
    else{document.getElementById('loginError').textContent=d.error||'密码错误';document.getElementById('loginError').style.display='block'}
  }catch(e){document.getElementById('loginError').textContent='网络错误';document.getElementById('loginError').style.display='block'}
}

function doLogout(){TOKEN=null;localStorage.removeItem('admin_token');showLogin()}

function h(){return{'Authorization':'Bearer '+TOKEN,'Content-Type':'application/json'}}
function fmt(d){return d?new Date(d).toLocaleString('zh-CN'):'-'}
function money(v){return'¥'+(v/100).toFixed(2)}

function toast(msg,type='success'){
  const c=document.getElementById('toasts');
  const t=document.createElement('div');
  t.className='toast toast-'+type;
  t.innerHTML='<i class="fas fa-'+(type==='success'?'check-circle':type==='error'?'exclamation-circle':'info-circle')+'"></i> '+msg;
  c.appendChild(t);
  setTimeout(()=>{t.style.opacity='0';t.style.transform='translateX(100%)';setTimeout(()=>t.remove(),300)},3000)
}

const pages={dashboard:'数据看板',orders:'订单管理',products:'商品管理',categories:'分类管理',cards:'卡密管理',users:'用户管理',settings:'系统设置'};
function nav(page){
  document.querySelectorAll('[id^="page-"]').forEach(p=>p.style.display='none');
  document.getElementById('page-'+page).style.display='block';
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.querySelector('[data-page="'+page+'"]').classList.add('active');
  document.getElementById('pageTitle').textContent=pages[page];
  if(page==='dashboard')loadDashboard();
  if(page==='orders')loadOrders();
  if(page==='products')loadProducts();
  if(page==='categories')loadCategories();
  if(page==='cards')loadCardProducts();
  if(page==='users')loadUsers();
  if(page==='settings')loadSettings();
}

async function loadDashboard(){
  try{
    const[r,o]=await Promise.all([fetch(API+'/stats',{headers:h()}),fetch(API+'/orders?limit=10',{headers:h()})]);
    const s=await r.json();const od=await o.json();
    if(s.data){
      document.getElementById('s-users').textContent=s.data.totalUsers||0;
      document.getElementById('s-orders').textContent=s.data.totalOrders||0;
      document.getElementById('s-revenue').textContent=money(s.data.totalRevenue||0);
      document.getElementById('s-today').textContent=s.data.todayOrders||0;
    }
    renderRecentOrders(od.data||[]);
  }catch(e){console.error(e)}
}

function renderRecentOrders(orders){
  document.getElementById('recentOrders').innerHTML=orders.slice(0,8).map(o=>'<tr><td><code>'+o.order_no+'</code></td><td>'+(o.username||o.user_id)+'</td><td>'+(o.product_name||'-')+'</td><td>'+money(o.amount)+'</td><td>'+statusTag(o.status)+'</td><td>'+fmt(o.created_at)+'</td></tr>').join('')||'<tr><td colspan="6"><div class="empty"><i class="fas fa-inbox"></i><p>暂无订单</p></div></td></tr>';
}

function statusTag(s){
  const m={pending:['warning','待支付'],paid:['info','已支付'],delivered:['success','已完成'],refunded:['danger','已退款'],cancelled:['danger','已取消']};
  const[t,l]=m[s]||['info',s];
  return'<span class="tag tag-'+t+'">'+l+'</span>';
}

async function loadOrders(){
  const r=await fetch(API+'/orders',{headers:h()});const d=await r.json();
  document.getElementById('ordersList').innerHTML=(d.data||[]).map(o=>'<tr><td><code>'+o.order_no+'</code></td><td>'+(o.username||o.user_id)+'</td><td>'+(o.product_name||'-')+'</td><td>'+(o.quantity||1)+'</td><td>'+money(o.amount)+'</td><td>'+(o.payment_method==='stars'?'Stars':o.payment_method==='balance'?'余额':'-')+'</td><td>'+statusTag(o.status)+'</td><td>'+fmt(o.created_at)+'</td><td class="actions">'+(o.status==='paid'||o.status==='delivered'?'<button class="btn btn-danger btn-sm" onclick="refundOrder('+o.id+')">退款</button>':'')+'</td></tr>').join('')||'<tr><td colspan="9"><div class="empty"><i class="fas fa-inbox"></i><p>暂无订单</p></div></td></tr>';
}

async function refundOrder(id){
  if(!confirm('确定要退款吗？'))return;
  await fetch(API+'/orders/'+id+'/refund',{method:'POST',headers:h()});toast('退款成功');loadOrders()
}

async function loadProducts(){
  const[r,c]=await Promise.all([fetch(API+'/products',{headers:h()}),fetch(API+'/categories',{headers:h()})]);
  const d=await r.json();const cd=await c.json();CATS=cd.data||[];
  document.getElementById('productsList').innerHTML=(d.data||[]).map(p=>'<tr><td>'+p.id+'</td><td><strong>'+p.name+'</strong></td><td>'+catName(p.category_id)+'</td><td>'+money(p.price)+'</td><td>'+p.stock_count+'</td><td>'+p.sales_count+'</td><td>'+(p.is_active?'<span class="tag tag-success">上架</span>':'<span class="tag tag-info">下架</span>')+'</td><td class="actions"><button class="btn btn-outline btn-sm" onclick="editProduct('+p.id+')"><i class="fas fa-edit"></i></button><button class="btn btn-sm '+(p.is_active?'btn-danger':'btn-success')+'" onclick="toggleProduct('+p.id+')">'+(p.is_active?'下架':'上架')+'</button></td></tr>').join('')||'<tr><td colspan="8"><div class="empty"><i class="fas fa-box-open"></i><p>暂无商品</p></div></td></tr>';
}

function catName(id){const c=CATS.find(x=>x.id===id);return c?c.icon+' '+c.name:'-'}

function openProductModal(){
  document.getElementById('productModalTitle').textContent='添加商品';
  document.getElementById('p-edit-id').value='';
  document.getElementById('p-name').value='';document.getElementById('p-desc').value='';
  document.getElementById('p-price').value='';document.getElementById('p-original').value='';
  document.getElementById('p-category').innerHTML=CATS.map(c=>'<option value="'+c.id+'">'+c.icon+' '+c.name+'</option>').join('');
  openM('productModal')
}

async function editProduct(id){
  const r=await fetch(API+'/products/'+id,{headers:h()});const d=await r.json();const p=d.data;
  document.getElementById('productModalTitle').textContent='编辑商品';
  document.getElementById('p-edit-id').value=p.id;
  document.getElementById('p-name').value=p.name;document.getElementById('p-desc').value=p.description||'';
  document.getElementById('p-price').value=p.price;document.getElementById('p-original').value=p.original_price||'';
  document.getElementById('p-category').innerHTML=CATS.map(c=>'<option value="'+c.id+'"'+(c.id===p.category_id?' selected':'')+'>'+c.icon+' '+c.name+'</option>').join('');
  openM('productModal')
}

async function saveProduct(){
  const id=document.getElementById('p-edit-id').value;
  const body={category_id:+document.getElementById('p-category').value,name:document.getElementById('p-name').value,description:document.getElementById('p-desc').value,price:+document.getElementById('p-price').value,original_price:+document.getElementById('p-original').value||null};
  if(!body.name||!body.price){toast('请填写商品名称和价格','error');return}
  if(id)await fetch(API+'/products/'+id,{method:'PUT',headers:h(),body:JSON.stringify(body)});
  else await fetch(API+'/products',{method:'POST',headers:h(),body:JSON.stringify(body)});
  closeM('productModal');toast(id?'商品已更新':'商品已添加');loadProducts()
}

async function toggleProduct(id){await fetch(API+'/products/'+id+'/toggle',{method:'PATCH',headers:h()});toast('操作成功');loadProducts()}

async function loadCategories(){
  const r=await fetch(API+'/categories',{headers:h()});const d=await r.json();CATS=d.data||[];
  document.getElementById('categoriesList').innerHTML=CATS.map(c=>'<tr><td>'+c.id+'</td><td style="font-size:24px">'+c.icon+'</td><td><strong>'+c.name+'</strong></td><td>'+c.sort_order+'</td><td><span class="tag tag-success">启用</span></td><td><button class="btn btn-danger btn-sm" onclick="deleteCategory('+c.id+')"><i class="fas fa-trash"></i></button></td></tr>').join('')||'<tr><td colspan="6"><div class="empty"><i class="fas fa-tags"></i><p>暂无分类</p></div></td></tr>';
}

function openCategoryModal(){document.getElementById('c-name').value='';document.getElementById('c-icon').value='📦';document.getElementById('c-sort').value='0';openM('categoryModal')}

async function saveCategory(){
  const name=document.getElementById('c-name').value;if(!name){toast('请输入分类名称','error');return}
  await fetch(API+'/categories',{method:'POST',headers:h(),body:JSON.stringify({name,icon:document.getElementById('c-icon').value||'📦',sort_order:+document.getElementById('c-sort').value||0})});
  closeM('categoryModal');toast('分类已添加');loadCategories()
}

async function deleteCategory(id){if(!confirm('确定删除此分类？'))return;await fetch(API+'/categories/'+id,{method:'DELETE',headers:h()});toast('分类已删除');loadCategories()}

async function loadCardProducts(){
  const r=await fetch(API+'/products',{headers:h()});const d=await r.json();
  document.getElementById('cardProduct').innerHTML='<option value="">请选择商品</option>'+(d.data||[]).map(p=>'<option value="'+p.id+'">'+p.name+' (库存:'+p.stock_count+')</option>').join('');
}

async function loadCards(){
  const pid=document.getElementById('cardProduct').value;
  if(!pid){document.getElementById('cardsTableCard').style.display='none';document.getElementById('cardStats').textContent='';return}
  const r=await fetch(API+'/products/'+pid+'/cards',{headers:h()});const d=await r.json();
  const cards=d.data||[];const avail=cards.filter(c=>!c.is_sold).length;
  document.getElementById('cardStats').innerHTML='<span class="tag tag-primary">总计: '+cards.length+'</span> <span class="tag tag-success">可用: '+avail+'</span> <span class="tag tag-info">已售: '+(cards.length-avail)+'</span>';
  document.getElementById('cardsTableCard').style.display='block';
  document.getElementById('cardsList').innerHTML=cards.slice(0,200).map(c=>'<tr><td>'+c.id+'</td><td style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><code>'+c.content+'</code></td><td>'+(c.is_sold?'<span class="tag tag-info">已售</span>':'<span class="tag tag-success">可用</span>')+'</td><td>'+fmt(c.created_at)+'</td><td>'+(!c.is_sold?'<button class="btn btn-danger btn-sm" onclick="deleteCard('+c.product_id+','+c.id+')"><i class="fas fa-trash"></i></button>':'')+'</td></tr>').join('');
}

async function doImportCards(){
  const pid=document.getElementById('cardProduct').value;
  if(!pid){toast('请先选择商品','error');return}
  const lines=document.getElementById('importText').value.split('\\n').filter(l=>l.trim());
  if(!lines.length){toast('请输入卡密','error');return}
  await fetch(API+'/products/'+pid+'/cards',{method:'POST',headers:h(),body:JSON.stringify({cards:lines})});
  document.getElementById('importText').value='';toast('成功导入 '+lines.length+' 个卡密');loadCards()
}

async function deleteCard(pid,cid){if(!confirm('确定删除？'))return;await fetch(API+'/products/'+pid+'/cards/'+cid,{method:'DELETE',headers:h()});toast('已删除');loadCards()}

let currentUserId=null;

async function loadUsers(){
  const r=await fetch(API+'/users',{headers:h()});const d=await r.json();
  renderUsers(d.data||[]);
}

async function searchUsers(){
  const q=document.getElementById('userSearch').value.trim();
  const r=await fetch(API+'/users?search='+encodeURIComponent(q),{headers:h()});const d=await r.json();
  renderUsers(d.data||[]);
}

function renderUsers(users){
  document.getElementById('usersList').innerHTML=users.map(u=>'<tr><td><code>'+u.user_id+'</code></td><td><strong>'+(u.username||'-')+'</strong><br><small style="color:var(--gray)">'+(u.first_name||'')+'</small></td><td style="color:var(--success);font-weight:600">'+money(u.balance)+'</td><td>'+u.order_count+'</td><td>'+money(u.total_spent)+'</td><td><code>'+(u.invite_code||'-')+'</code></td><td>'+(u.invited_by||'-')+'</td><td><small>'+fmt(u.created_at)+'</small></td><td>'+(u.is_banned?'<span class="tag tag-danger">封禁</span>':'<span class="tag tag-success">正常</span>')+'</td><td class="actions"><button class="btn btn-primary btn-sm" onclick="viewUser('"+u.user_id+"')"><i class="fas fa-eye"></i></button><button class="btn btn-sm '+(u.is_banned?'btn-success':'btn-danger')+'" onclick="toggleBan('"+u.user_id+"',"+(u.is_banned?"true":"false")+")">'+(u.is_banned?'解封':'封禁')+'</button></td></tr>').join('')||'<tr><td colspan="10"><div class="empty"><i class="fas fa-users"></i><p>暂无用户</p></div></td></tr>';
}

async function viewUser(userId){
  currentUserId=userId;
  const r=await fetch(API+'/users/'+userId,{headers:h()});const d=await r.json();
  const u=d.data;
  document.getElementById('ud-id').textContent=u.user_id;
  document.getElementById('ud-username').textContent=u.username||u.first_name||'-';
  document.getElementById('ud-balance').textContent=money(u.balance);
  document.getElementById('ud-spent').textContent=money(u.total_spent);
  document.getElementById('ud-invite').textContent=u.invite_code||'-';
  document.getElementById('ud-invitecount').textContent=u.invite_count||0;
  document.getElementById('ud-edit-username').value=u.username||'';
  document.getElementById('ud-edit-firstname').value=u.first_name||'';
  document.getElementById('ud-edit-banned').value=u.is_banned?'1':'0';
  document.getElementById('ud-amount').value='';
  document.getElementById('ud-reason').value='';
  document.getElementById('ud-orders-list').innerHTML=(u.orders||[]).slice(0,20).map(o=>'<tr><td><code>'+o.order_no+'</code></td><td>'+(o.product_name||'-')+'</td><td>'+money(o.amount)+'</td><td>'+statusTag(o.status)+'</td><td>'+fmt(o.created_at)+'</td></tr>').join('')||'<tr><td colspan="5" style="text-align:center;color:var(--gray)">暂无订单</td></tr>';
  switchUserTab('balance');
  openM('userDetailModal');
}

function switchUserTab(tab,el){
  ['balance','orders','edit'].forEach(t=>{document.getElementById('ud-tab-'+t).style.display=t===tab?'block':'none'});
  document.querySelectorAll('.tab-btn').forEach(b=>{b.style.color='var(--gray)';b.style.borderBottom='2px solid transparent'});
  if(el){el.style.color='var(--primary)';el.style.borderBottom='2px solid var(--primary)'}
  else{document.querySelector('.tab-btn').style.color='var(--primary)';document.querySelector('.tab-btn').style.borderBottom='2px solid var(--primary)'}
}

function quickBalance(amount){document.getElementById('ud-amount').value=amount}

async function adjustBalance(){
  const amount=parseInt(document.getElementById('ud-amount').value);
  const reason=document.getElementById('ud-reason').value;
  if(!amount){toast('请输入调整金额','error');return}
  const r=await fetch(API+'/users/'+currentUserId+'/balance',{method:'POST',headers:h(),body:JSON.stringify({amount,reason})});
  const d=await r.json();
  if(d.error){toast(d.error,'error');return}
  toast('余额调整成功');viewUser(currentUserId);loadUsers()
}

async function saveUserEdit(){
  const body={
    username:document.getElementById('ud-edit-username').value,
    first_name:document.getElementById('ud-edit-firstname').value,
    is_banned:parseInt(document.getElementById('ud-edit-banned').value)
  };
  await fetch(API+'/users/'+currentUserId,{method:'PUT',headers:h(),body:JSON.stringify(body)});
  toast('用户信息已更新');viewUser(currentUserId);loadUsers()
}

async function toggleBan(uid,banned){
  const isBanned=banned===true||banned==='true';
  if(!confirm(isBanned?'确定要解封此用户？':'确定要封禁此用户？'))return;
  await fetch(API+'/users/'+uid+'/ban',{method:'PATCH',headers:h(),body:JSON.stringify({is_banned:!isBanned})});
  toast(isBanned?'已解封':'已封禁');loadUsers()
}

async function loadSettings(){
  const r=await fetch(API+'/settings',{headers:h()});const d=await r.json();
  (d.data||[]).forEach(s=>{const el=document.getElementById('set-'+s.key);if(el)el.value=s.value});
}

async function saveSettings(){
  const keys=['shop_name','welcome_message','support_username','commission_rate','order_expire_minutes','min_withdraw'];
  for(const k of keys){const el=document.getElementById('set-'+k);if(el)await fetch(API+'/settings',{method:'PUT',headers:h(),body:JSON.stringify({key:k,value:el.value})})}
  toast('设置已保存')
}

function openM(id){document.getElementById(id).classList.add('show')}
function closeM(id){document.getElementById(id).classList.remove('show')}
</script>
</body>
</html>`;
}
