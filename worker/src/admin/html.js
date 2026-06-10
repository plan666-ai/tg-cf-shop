// worker/src/admin/html.js - 企业管理后台界面
export function getAdminHTML() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>TG Shop Admin</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
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

/* Login - Glass + Slide-in */
.login-page { min-height:100vh; display:flex; align-items:center; justify-content:center; background:#0a0f1e; position:relative; padding:1.5rem; overflow:hidden; }
.login-bg { position:fixed; top:0; left:0; width:100%; height:100%; z-index:0; background:linear-gradient(135deg,#0a0f1e 0%,#1a1f35 50%,#0d1525 100%); }
.login-bg::before { content:''; position:absolute; top:-50%; left:-50%; width:200%; height:200%; background:radial-gradient(circle at 30% 40%,rgba(99,102,241,0.08) 0%,transparent 50%),radial-gradient(circle at 70% 60%,rgba(14,165,233,0.06) 0%,transparent 50%); animation:bgFloat 20s ease-in-out infinite; }
@keyframes bgFloat { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-2%,1%)} }
.login-glass { position:fixed; top:0; left:0; width:100%; height:100%; backdrop-filter:blur(40px); -webkit-backdrop-filter:blur(40px); z-index:1; }
.login-page .card-wrapper { display:flex; width:960px; max-width:90vw; border-radius:24px; overflow:hidden; box-shadow:0 25px 60px rgba(0,0,0,0.5); position:relative; z-index:2; }
.login-page .card-left { flex:1; background:linear-gradient(135deg,#1e2b3c 0%,#0f1a24 100%); padding:2.5rem 2rem; display:flex; flex-direction:column; justify-content:center; color:white; transform:translateX(-100%); opacity:0; animation:slideFromL 0.65s cubic-bezier(0.23,1,0.32,1) forwards; position:relative; overflow:hidden; }
.login-page .card-left::before { content:''; position:absolute; top:-80px; right:-80px; width:250px; height:250px; background:radial-gradient(circle,rgba(99,102,241,0.15) 0%,transparent 70%); border-radius:50%; }
.login-page .card-left::after { content:''; position:absolute; bottom:-60px; left:-40px; width:180px; height:180px; background:radial-gradient(circle,rgba(14,165,233,0.1) 0%,transparent 70%); border-radius:50%; }
.login-page .card-right { flex:1; background:#ffffff; padding:2.5rem 2rem; display:flex; flex-direction:column; justify-content:center; transform:translateX(100%); opacity:0; animation:slideFromR 0.65s cubic-bezier(0.23,1,0.32,1) forwards; }
@keyframes slideFromL { 0%{transform:translateX(-100%);opacity:0} 100%{transform:translateX(0);opacity:1} }
@keyframes slideFromR { 0%{transform:translateX(100%);opacity:0} 100%{transform:translateX(0);opacity:1} }
.login-page .brand-info { position:relative; z-index:1; }
.login-page .brand-info h2 { font-size:2rem; font-weight:700; margin-bottom:0.5rem; letter-spacing:-0.3px; }
.login-page .brand-info .brand-desc { font-size:0.9rem; opacity:0.8; border-left:3px solid #4c9aff; padding-left:12px; margin-top:8px; margin-bottom:2rem; }
.login-page .feature-list { list-style:none; margin:0; padding:0; }
.login-page .feature-list li { margin-bottom:1.1rem; display:flex; align-items:center; gap:12px; font-size:0.92rem; opacity:0.9; }
.login-page .feature-list li i { width:22px; text-align:center; font-size:16px; color:#4c9aff; }
.login-page .brand-footer { margin-top:auto; padding-top:2rem; font-size:0.78rem; opacity:0.5; font-style:italic; text-align:center; }
.login-page .form-area h3 { font-size:2rem; font-weight:700; color:#1f2937; margin-bottom:0.5rem; }
.login-page .form-area .form-sub { color:#6b7280; font-size:1rem; margin-bottom:2rem; border-bottom:1px solid #e5e7eb; display:inline-block; padding-bottom:6px; }
.login-page .form-area .input-group { margin-bottom:1.6rem; }
.login-page .form-area .input-group label { display:block; font-size:1rem; font-weight:500; color:#374151; margin-bottom:0.6rem; }
.login-page .form-area .input-group input { width:100%; padding:1rem 1.1rem; border:1px solid #e2e8f0; border-radius:14px; font-size:1.05rem; transition:all 0.2s; background:#f9fafb; outline:none; font-family:inherit; }
.login-page .form-area .input-group input:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,0.15); background:#fff; }
.login-page .btn-login { width:100%; background:#1e2b3c; color:white; border:none; padding:1rem; font-size:1.1rem; font-weight:600; border-radius:40px; cursor:pointer; transition:all 0.25s; margin-top:0.5rem; font-family:inherit; letter-spacing:2px; }
.login-page .btn-login:hover { background:#0f1a24; transform:translateY(-2px); box-shadow:0 8px 18px rgba(0,0,0,0.15); }
.login-page .form-hint { margin-top:1.8rem; font-size:0.8rem; text-align:center; color:#9ca3af; }

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
.hamburger { display:none; width:24px; height:18px; flex-direction:column; justify-content:space-between; cursor:pointer; flex-shrink:0; }
.hamburger span { display:block; width:100%; height:2.5px; background:var(--dark); border-radius:2px; transition:all 0.3s; transform-origin:center; }
.hamburger.open span:first-child { transform:translateY(8px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity:0; transform:scaleX(0); }
.hamburger.open span:last-child { transform:translateY(-8px) rotate(-45deg); }
.sidebar-overlay { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:99; backdrop-filter:blur(2px); }
.sidebar-overlay.show { display:block; }
.breadcrumb { display:flex; align-items:center; gap:8px; font-size:13px; color:var(--gray); }
.breadcrumb span { color:var(--dark); font-weight:500; }
.header-right { display:flex; align-items:center; gap:12px; }
.header-btn { width:40px; height:40px; border-radius:10px; border:1px solid var(--light-2); background:white; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:var(--transition); color:var(--gray); position:relative; }
.header-btn:hover { border-color:var(--primary); color:var(--primary); }
.header-btn .badge { position:absolute; top:-4px; right:-4px; width:18px; height:18px; background:var(--danger); border-radius:50%; font-size:10px; color:white; display:flex; align-items:center; justify-content:center; }
.content { padding:24px; }

/* Stats */
.stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:24px; width:100%; }
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

/* Toggle Switch */
.toggle { position:relative; display:inline-block; width:50px; height:26px; flex-shrink:0; }
.toggle input { opacity:0; width:0; height:0; }
.toggle .slider { position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background:#ccc; transition:0.3s; border-radius:26px; }
.toggle .slider:before { position:absolute; content:""; height:20px; width:20px; left:3px; bottom:3px; background:white; transition:0.3s; border-radius:50%; }
.toggle input:checked+.slider { background:var(--primary); }
.toggle input:checked+.slider:before { transform:translateX(24px); }

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

/* Checkbox */
.checkbox { width:16px; height:16px; cursor:pointer; accent-color:var(--primary); vertical-align:middle; }
th.checkbox-col, td.checkbox-col { width:44px; text-align:center; padding-left:20px; padding-right:10px; }

/* Batch Bar */
.batch-bar { display:none; align-items:center; gap:12px; padding:12px 24px; background:linear-gradient(135deg,rgba(99,102,241,0.08),rgba(99,102,241,0.03)); border-bottom:1px solid rgba(99,102,241,0.15); }
.batch-bar.show { display:flex; }
.batch-bar .batch-count { font-size:13px; color:var(--primary); font-weight:600; margin-right:4px; }
.batch-bar .btn { margin-left:4px; }

/* Pagination */
.pagination-wrap { display:flex; align-items:center; justify-content:space-between; padding:14px 24px; border-top:1px solid var(--light-2); background:var(--light); border-radius:0 0 var(--radius) var(--radius); flex-wrap:wrap; gap:12px; }
.pg-info { font-size:13px; color:var(--gray); }
.pg-info strong { color:var(--dark-3); font-weight:600; }
.pg-nav { display:flex; align-items:center; gap:4px; }
.pg-nav button { min-width:34px; height:34px; padding:0 8px; border:1px solid var(--light-2); background:white; border-radius:8px; font-size:13px; cursor:pointer; transition:var(--transition); color:var(--dark-3); font-weight:500; }
.pg-nav button:hover:not(:disabled):not(.active) { border-color:var(--primary); color:var(--primary); background:rgba(99,102,241,0.04); }
.pg-nav button.active { background:var(--primary); color:white; border-color:var(--primary); box-shadow:0 2px 8px rgba(99,102,241,0.3); }
.pg-nav button:disabled { opacity:0.35; cursor:not-allowed; }
.pg-nav .pg-ellipsis { min-width:34px; height:34px; display:flex; align-items:center; justify-content:center; color:var(--gray-light); font-size:13px; }
.pg-right { display:flex; align-items:center; gap:8px; }
.pg-right label { font-size:13px; color:var(--gray); }
.pg-right select { height:34px; border:1px solid var(--light-2); border-radius:8px; padding:0 10px; font-size:13px; font-family:inherit; background:white; cursor:pointer; color:var(--dark-3); }
.pg-right select:focus { outline:none; border-color:var(--primary); }
.pg-right .pg-jump { display:flex; align-items:center; gap:6px; }
.pg-right .pg-jump span { font-size:13px; color:var(--gray); }
.pg-right .pg-jump input { width:48px; height:34px; border:1px solid var(--light-2); border-radius:8px; text-align:center; font-size:13px; font-family:inherit; color:var(--dark-3); }
.pg-right .pg-jump input:focus { outline:none; border-color:var(--primary); }
.pg-right .pg-jump button { min-width:auto; height:34px; padding:0 12px; border:1px solid var(--light-2); background:white; border-radius:8px; font-size:12px; cursor:pointer; transition:var(--transition); color:var(--dark-3); font-weight:600; }
.pg-right .pg-jump button:hover { border-color:var(--primary); color:var(--primary); }

/* Confirm Dialog */
.confirm-overlay { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); backdrop-filter:blur(4px); z-index:1100; justify-content:center; align-items:center; }
.confirm-overlay.show { display:flex; animation:fadeIn 0.2s; }
.confirm-dialog { background:white; border-radius:16px; padding:32px; width:400px; text-align:center; box-shadow:var(--shadow-xl); animation:slideUp 0.3s; }
.confirm-dialog .confirm-icon { margin-bottom:16px; }
.confirm-dialog .confirm-icon i { font-size:48px; color:var(--warning); }
.confirm-dialog .confirm-msg { font-size:15px; color:var(--dark-3); margin-bottom:24px; line-height:1.6; }
.confirm-dialog .confirm-btns { display:flex; gap:12px; justify-content:center; }

/* Responsive */
@media(max-width:1200px) { .stats-grid{grid-template-columns:repeat(2,1fr)} }
@media(max-width:780px) {
  .sidebar{transform:translateX(-100%)}
  .sidebar.open{transform:translateX(0)}
  .main{margin-left:0}
  .content{padding:10px}
  .stats-grid{grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:12px}
  .stat-card{padding:12px 10px;border-radius:10px}
  .stat-value{font-size:18px;word-break:break-all;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}
  .stat-card .value{font-size:20px}
  .stat-card .label{font-size:11px;margin-bottom:0}
  .stat-card .icon{width:32px;height:32px;font-size:14px}
  .stat-card .trend{font-size:11px}
  .card{border-radius:10px;margin-bottom:10px}
  .card-header{padding:12px 14px;flex-wrap:wrap;gap:6px}
  .card-header h3{font-size:14px}
  .card-body{padding:10px 12px}
  .card-body.no-padding{padding:0;overflow-x:auto;-webkit-overflow-scrolling:touch}
  .card-body.no-padding table{min-width:650px}
  table{font-size:12px}
  table th{font-size:11px;padding:8px 5px}
  table td{padding:7px 5px;font-size:12px}
  table .checkbox-col{width:28px}
  .form-row{grid-template-columns:1fr;gap:0}
  .form-group{margin-bottom:12px}
  .form-group label{font-size:12px;margin-bottom:4px}
  .input-group input,.input-group select,.input-group textarea{font-size:14px;padding:10px 10px;border-radius:8px}
  .btn{padding:7px 12px;font-size:12px;border-radius:8px}
  .btn-sm{padding:5px 8px;font-size:11px}
  .tabs{flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;gap:0;border-bottom-width:2px}
  .tabs .tab{white-space:nowrap;padding:8px 12px;font-size:12px}
  .hamburger{display:flex}
  .header{padding:0 10px;height:50px}
  .header-left h1{font-size:15px}
  .header-right{gap:8px}
  .header-btn{width:34px;height:34px;border-radius:8px}
  .modal-content{width:100%;max-height:100vh;margin:0;border-radius:16px 16px 0 0;position:fixed;bottom:0}
  .modal-body{padding:14px;max-height:80vh}
  .modal-header{padding:14px 16px}
  .page-header{flex-direction:column;gap:8px;align-items:flex-start;padding:0}
  .page-header h2{font-size:16px}
  .batch-bar{flex-wrap:wrap;gap:4px;font-size:11px;padding:8px 10px}
  .pagination{flex-wrap:wrap;gap:3px}
  .pagination button{padding:5px 9px;font-size:11px}
  .login-page .card-wrapper{flex-direction:column;max-width:100vw;border-radius:0;min-height:100vh}
  .login-page .card-left{transform:translateY(-60%);animation:slideTop 0.6s cubic-bezier(0.23,1,0.32,1) forwards;padding:1.5rem 1.2rem}
  .login-page .card-right{transform:translateY(60%);animation:slideBot 0.6s cubic-bezier(0.23,1,0.32,1) forwards;padding:1.5rem 1.2rem}
  @keyframes slideTop{0%{transform:translateY(-100%);opacity:0}100%{transform:translateY(0);opacity:1}}
  @keyframes slideBot{0%{transform:translateY(100%);opacity:0}100%{transform:translateY(0);opacity:1}}
  .login-page .card-left{border-radius:0}
  .topbar{padding:0 10px;height:50px}
  .topbar .brand{font-size:14px}
  .topbar .user-info span{display:none}
}
</style>
</head>
<body>

<!-- Login Page -->
<div id="loginPage" class="login-page">
  <div class="login-bg"></div>
  <div class="login-glass"></div>
  <div class="card-wrapper">
    <div class="card-left">
      <div class="brand-info">
        <h2><i class="fas fa-rocket"></i> TG Shop</h2>
        <p class="brand-desc">数据驱动 &middot; 智能零售管理后台</p>
      </div>
      <ul class="feature-list">
        <li><i class="fas fa-chart-pie"></i> 实时数据看板与趋势分析</li>
        <li><i class="fas fa-bolt"></i> 高效订单与商品管理</li>
        <li><i class="fas fa-shield-alt"></i> 安全认证与权限控制</li>
        <li><i class="fas fa-cloud"></i> 云端部署，多端同步</li>
      </ul>
      <div class="brand-footer">-- Secure &middot; Stable &middot; Scalable --</div>
    </div>
    <div class="card-right">
      <div class="form-area">
        <h3>安全验证</h3>
        <div class="form-sub">请输入您的管理员密码</div>
        <div class="input-group">
          <label><i class="fas fa-lock"></i> 管理员密码</label>
          <input type="password" id="loginPassword" placeholder="请输入管理员密码" onkeydown="if(event.key==='Enter')doLogin()">
        </div>
        <button class="btn-login" onclick="doLogin()">验 证 并 登 录 <i class="fas fa-arrow-right"></i></button>
        <div class="form-hint" id="loginDate"></div>
      </div>
    </div>
  </div>
</div>

<!-- App -->
<div id="app" class="app">
  <div class="sidebar-overlay" id="sidebarOverlay" onclick="toggleSidebar()"></div>
  <aside class="sidebar" id="sidebar">
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
        <div class="nav-item" onclick="nav('redeem')" data-page="redeem">
          <i class="fas fa-ticket-alt"></i><span>充值卡管理</span>
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
        <div class="hamburger" onclick="toggleSidebar()"><span></span><span></span><span></span></div>
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
          <div class="card-header"><h3><i class="fas fa-chart-line"></i> 订单趋势 (近7天)</h3></div>
          <div class="card-body" style="padding:20px">
            <canvas id="orderChart" height="200"></canvas>
          </div>
        </div>
      </div>

      <!-- Orders -->
      <div id="page-orders" style="display:none">
        <div class="card" data-pg="orders">
          <div class="card-header"><h3><i class="fas fa-shopping-cart"></i> 全部订单</h3></div>
          <div style="padding:12px 16px;border-bottom:1px solid var(--border);display:flex;gap:10px;flex-wrap:wrap">
            <input id="orderSearch" placeholder="搜索订单号/用户ID/用户名" style="flex:1;min-width:200px;padding:8px 12px;border:1px solid var(--border);border-radius:6px;font-size:13px" onkeydown="if(event.key==='Enter')loadOrders()">
            <select id="orderStatusFilter" onchange="loadOrders()" style="padding:8px 12px;border:1px solid var(--border);border-radius:6px;font-size:13px">
              <option value="">全部状态</option>
              <option value="pending">待支付</option>
              <option value="paid">已支付</option>
              <option value="delivered">已完成</option>
              <option value="refunded">已退款</option>
              <option value="cancelled">已取消</option>
            </select>
            <button class="btn btn-primary btn-sm" onclick="loadOrders()"><i class="fas fa-search"></i> 搜索</button>
          </div>
          <div class="batch-bar" data-batch="orders"><span class="batch-count">已选择 0 项</span><button class="btn btn-danger btn-sm" onclick="batchDeleteOrders()"><i class="fas fa-trash"></i> 批量删除</button></div>
          <div class="card-body no-padding">
            <table>
              <thead><tr><th class="checkbox-col"><input type="checkbox" class="checkbox pg-select-all" onchange="pgToggleAll('orders',this)"></th><th>订单号</th><th>用户</th><th>商品</th><th>数量</th><th>金额</th><th>支付方式</th><th>状态</th><th>时间</th><th>操作</th></tr></thead>
              <tbody id="ordersList"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Products -->
      <div id="page-products" style="display:none">
        <div class="card" data-pg="products">
          <div class="card-header">
            <h3><i class="fas fa-box"></i> 商品列表</h3>
            <button class="btn btn-primary btn-sm" onclick="openProductModal()"><i class="fas fa-plus"></i> 添加商品</button>
          </div>
          <div class="batch-bar" data-batch="products"><span class="batch-count">已选择 0 项</span><button class="btn btn-danger btn-sm" onclick="batchDeleteProducts()"><i class="fas fa-trash"></i> 批量删除</button><button class="btn btn-outline btn-sm" onclick="batchToggleProducts(false)"><i class="fas fa-eye-slash"></i> 批量下架</button><button class="btn btn-success btn-sm" onclick="batchToggleProducts(true)"><i class="fas fa-eye"></i> 批量上架</button></div>
          <div class="card-body no-padding">
            <table>
              <thead><tr><th class="checkbox-col"><input type="checkbox" class="checkbox pg-select-all" onchange="pgToggleAll('products',this)"></th><th>ID</th><th>商品名称</th><th>分类</th><th>价格</th><th>库存</th><th>销量</th><th>状态</th><th>操作</th></tr></thead>
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

      <!-- Redeem Cards -->
      <div id="page-redeem" style="display:none">
        <div class="stats-grid" style="grid-template-columns:repeat(4,1fr)">
          <div class="stat-card"><div class="stat-header"><div class="stat-icon"><i class="fas fa-ticket-alt"></i></div></div><div class="stat-value" id="rc-total">0</div><div class="stat-label">总充值卡</div></div>
          <div class="stat-card"><div class="stat-header"><div class="stat-icon"><i class="fas fa-check-circle"></i></div></div><div class="stat-value" id="rc-unused">0</div><div class="stat-label">未使用</div></div>
          <div class="stat-card"><div class="stat-header"><div class="stat-icon"><i class="fas fa-user-check"></i></div></div><div class="stat-value" id="rc-used">0</div><div class="stat-label">已使用</div></div>
          <div class="stat-card"><div class="stat-header"><div class="stat-icon"><i class="fas fa-coins"></i></div></div><div class="stat-value" id="rc-total-amount">¥0</div><div class="stat-label">总面额</div></div>
        </div>
        <div class="card">
          <div class="card-header">
            <h3><i class="fas fa-plus-circle"></i> 生成充值卡</h3>
          </div>
          <div class="card-body">
            <div class="form-row">
              <div class="form-group">
                <label>面额（元）</label>
                <div style="display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap">
                  <button class="btn btn-outline btn-sm" onclick="document.getElementById(&apos;rc-amount&apos;).value=10">¥10</button>
                  <button class="btn btn-outline btn-sm" onclick="document.getElementById(&apos;rc-amount&apos;).value=50">¥50</button>
                  <button class="btn btn-outline btn-sm" onclick="document.getElementById(&apos;rc-amount&apos;).value=100">¥100</button>
                  <button class="btn btn-outline btn-sm" onclick="document.getElementById(&apos;rc-amount&apos;).value=200">¥200</button>
                  <button class="btn btn-outline btn-sm" onclick="document.getElementById(&apos;rc-amount&apos;).value=500">¥500</button>
                </div>
                <input id="rc-amount" type="number" min="0.01" step="0.01" value="10" placeholder="输入自定义面额">
              </div>
              <div class="form-group">
                <label>数量</label>
                <div style="display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap">
                  <button class="btn btn-outline btn-sm" onclick="document.getElementById(&apos;rc-count&apos;).value=1">1张</button>
                  <button class="btn btn-outline btn-sm" onclick="document.getElementById(&apos;rc-count&apos;).value=5">5张</button>
                  <button class="btn btn-outline btn-sm" onclick="document.getElementById(&apos;rc-count&apos;).value=10">10张</button>
                  <button class="btn btn-outline btn-sm" onclick="document.getElementById(&apos;rc-count&apos;).value=50">50张</button>
                </div>
                <input id="rc-count" type="number" min="1" max="100" value="1" placeholder="1-100">
              </div>
            </div>
            <div style="display:flex;gap:10px;align-items:center">
              <button class="btn btn-primary" onclick="generateRedeemCards()"><i class="fas fa-magic"></i> 生成充值卡</button>
              <span id="rc-gen-hint" style="font-size:13px;color:var(--gray)"></span>
            </div>
          </div>
        </div>
        <div id="rc-gen-result" style="display:none" class="card">
          <div class="card-header">
            <h3><i class="fas fa-check-circle" style="color:var(--success)"></i> 生成结果</h3>
            <div style="display:flex;gap:8px">
              <button class="btn btn-outline btn-sm" onclick="copyAllGenCards()"><i class="fas fa-copy"></i> 复制全部</button>
              <button class="btn btn-outline btn-sm" onclick="document.getElementById(&apos;rc-gen-result&apos;).style.display=&apos;none&apos;"><i class="fas fa-times"></i> 关闭</button>
            </div>
          </div>
          <div class="card-body">
            <div id="rc-gen-cards" style="display:flex;flex-wrap:wrap;gap:8px"></div>
          </div>
        </div>
        <div class="card" data-pg="redeem">
          <div class="card-header">
            <h3><i class="fas fa-list"></i> 充值卡列表</h3>
            <div style="display:flex;gap:8px;align-items:center">
              <select id="rc-filter" onchange="filterRedeemCards()" style="height:34px;border:1px solid var(--light-2);border-radius:8px;padding:0 10px;font-size:13px;font-family:inherit;background:white;cursor:pointer">
                <option value="all">全部状态</option>
                <option value="unused">未使用</option>
                <option value="used">已使用</option>
              </select>
              <div style="position:relative">
                <i class="fas fa-search" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--gray-light);font-size:12px"></i>
                <input id="rc-search" placeholder="搜索卡码..." oninput="filterRedeemCards()" style="height:34px;border:1px solid var(--light-2);border-radius:8px;padding:0 10px 0 30px;font-size:13px;font-family:inherit;width:180px">
              </div>
              <button class="btn btn-outline btn-sm" onclick="loadRedeemCards()"><i class="fas fa-sync-alt"></i></button>
            </div>
          </div>
          <div class="batch-bar" data-batch="redeem"><span class="batch-count">已选择 0 项</span><button class="btn btn-danger btn-sm" onclick="batchDeleteRedeemCards()"><i class="fas fa-trash"></i> 批量删除</button><button class="btn btn-outline btn-sm" onclick="batchCopyRedeemCards()"><i class="fas fa-copy"></i> 批量复制未使用卡码</button></div>
          <div class="card-body no-padding">
            <table>
              <thead><tr><th class="checkbox-col"><input type="checkbox" class="checkbox pg-select-all" onchange="pgToggleAll('redeem',this)"></th><th>ID</th><th>充值卡码</th><th>面额</th><th>状态</th><th>使用者</th><th>使用时间</th><th>创建时间</th><th>操作</th></tr></thead>
              <tbody id="redeemCardsList"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Users -->
      <div id="page-users" style="display:none">
        <div class="card" data-pg="users">
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
              <button class="btn btn-outline btn-sm" onclick="resetUsers()"><i class="fas fa-redo"></i> 重置</button>
            </div>
          </div>
          <div class="batch-bar" data-batch="users"><span class="batch-count">已选择 0 项</span><button class="btn btn-danger btn-sm" onclick="batchBanUsers(true)"><i class="fas fa-ban"></i> 批量封禁</button><button class="btn btn-success btn-sm" onclick="batchBanUsers(false)"><i class="fas fa-check"></i> 批量解封</button></div>
          <div class="card-body no-padding">
            <table>
              <thead><tr><th class="checkbox-col"><input type="checkbox" class="checkbox pg-select-all" onchange="pgToggleAll('users',this)"></th><th>用户ID</th><th>用户名/昵称</th><th>余额</th><th>订单数</th><th>消费成功计次</th><th>邀请码</th><th>邀请人</th><th>注册时间</th><th>状态</th><th>操作</th></tr></thead>
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
            <div class="form-group"><label>消息格式</label><select id="set-welcome_parse_mode"><option value="HTML">HTML</option><option value="MarkdownV2">Markdown</option></select></div>
            <div class="form-group"><label>客服用户名（不带@）</label><input id="set-support_username"></div>
            <div class="form-row">
              <div class="form-group"><label>佣金比例 (%)</label><input id="set-commission_rate" type="number"></div>
              <div class="form-group"><label>订单过期时间 (分钟)</label><input id="set-order_expire_minutes" type="number"></div>
            </div>
            <div class="form-group"><label>最低提现金额（元）</label><input id="set-min_withdraw" type="number"></div>
            <button class="btn btn-primary" onclick="saveSettings()"><i class="fas fa-save"></i> 保存设置</button>
          </div>
        </div>
        <div class="card" style="margin-top:20px">
          <div class="card-header"><h3><i class="fas fa-wallet"></i> 支付方式配置</h3></div>
          <div class="card-body">
            <div style="background:var(--light);padding:16px;border-radius:8px;margin-bottom:16px;border-left:4px solid #f59e0b">
              <p style="margin:0;color:#92400e;font-size:13px"><i class="fas fa-info-circle"></i> 开启支付方式后，用户在下单时可选择对应方式进行支付</p>
            </div>
            <!-- Telegram Stars -->
            <div style="border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:16px;position:relative">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <div style="display:flex;align-items:center;gap:10px">
                  <div style="width:40px;height:40px;background:linear-gradient(135deg,#fbbf24,#f59e0b);border-radius:10px;display:flex;align-items:center;justify-content:center;color:white;font-size:20px">⭐</div>
                  <div><div style="font-weight:600;font-size:15px">Telegram Stars</div><div style="font-size:12px;color:var(--gray)">TG 内置支付，自动发货</div></div>
                </div>
                <label class="toggle"><input type="checkbox" id="set-payment_stars_enabled"><span class="slider"></span></label>
              </div>
            </div>
            <!-- USDT -->
            <div style="border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:16px;position:relative">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
                <div style="display:flex;align-items:center;gap:10px">
                  <div style="width:40px;height:40px;background:linear-gradient(135deg,#26a17b,#1a8a6a);border-radius:10px;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:14px">₮</div>
                  <div><div style="font-weight:600;font-size:15px">USDT 支付</div><div style="font-size:12px;color:var(--gray)">支持 TRC20 / ERC20 网络</div></div>
                </div>
                <label class="toggle"><input type="checkbox" id="set-payment_usdt_enabled"><span class="slider"></span></label>
              </div>
              <div id="usdt-fields" style="display:none">
                <div class="form-row">
                  <div class="form-group"><label>收款地址</label><input id="set-payment_usdt_address" placeholder="TRC20 收款地址"></div>
                  <div class="form-group"><label>汇率 (1USDT=?CNY)</label><input id="set-payment_usdt_rate" type="number" step="0.01" placeholder="7.2"></div>
                </div>
                <div class="form-group"><label>网络类型</label><select id="set-payment_usdt_network"><option value="TRC20">TRC20</option><option value="ERC20">ERC20</option></select></div>
              </div>
            </div>
            <!-- 易支付 -->
            <div style="border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:16px;position:relative">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
                <div style="display:flex;align-items:center;gap:10px">
                  <div style="width:40px;height:40px;background:linear-gradient(135deg,#3b82f6,#2563eb);border-radius:10px;display:flex;align-items:center;justify-content:center;color:white"><i class="fas fa-credit-card"></i></div>
                  <div><div style="font-weight:600;font-size:15px">易支付</div><div style="font-size:12px;color:var(--gray)">支付宝 / 微信 / QQ 钱包</div></div>
                </div>
                <label class="toggle"><input type="checkbox" id="set-payment_yipay_enabled"><span class="slider"></span></label>
              </div>
              <div id="yipay-fields" style="display:none">
                <div class="form-group"><label>接口地址</label><input id="set-payment_yipay_url" placeholder="https://pay.example.com"></div>
                <div class="form-row">
                  <div class="form-group"><label>商户ID</label><input id="set-payment_yipay_pid" placeholder="商户ID"></div>
                  <div class="form-group"><label>商户密钥</label><input id="set-payment_yipay_key" type="password" placeholder="商户密钥"></div>
                </div>
              </div>
            </div>
            <!-- 码支付 -->
            <div style="border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:16px;position:relative">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
                <div style="display:flex;align-items:center;gap:10px">
                  <div style="width:40px;height:40px;background:linear-gradient(135deg,#10b981,#059669);border-radius:10px;display:flex;align-items:center;justify-content:center;color:white"><i class="fas fa-qrcode"></i></div>
                  <div><div style="font-weight:600;font-size:15px">码支付</div><div style="font-size:12px;color:var(--gray)">扫码支付，自动回调</div></div>
                </div>
                <label class="toggle"><input type="checkbox" id="set-payment_codepay_enabled"><span class="slider"></span></label>
              </div>
              <div id="codepay-fields" style="display:none">
                <div class="form-group"><label>接口地址</label><input id="set-payment_codepay_url" placeholder="https://codepay.example.com"></div>
                <div class="form-row">
                  <div class="form-group"><label>商户ID</label><input id="set-payment_codepay_id" placeholder="商户ID"></div>
                  <div class="form-group"><label>商户密钥</label><input id="set-payment_codepay_key" type="password" placeholder="商户密钥"></div>
                </div>
              </div>
            </div>
            <button class="btn btn-primary" onclick="savePaymentSettings()"><i class="fas fa-save"></i> 保存支付配置</button>
          </div>
        </div>
        <div class="card" style="margin-top:20px">
          <div class="card-header"><h3><i class="fas fa-sign-in-alt"></i> 登录页面配置</h3></div>
          <div class="card-body">
            <div class="form-group"><label>品牌名称</label><input id="set-login_brand" placeholder="TG Shop"></div>
            <div class="form-group"><label>品牌描述</label><input id="set-login_desc" placeholder="数据驱动 · 智能零售管理后台"></div>
            <div class="form-group"><label>功能1</label><input id="set-login_feat1" placeholder="实时数据看板与趋势分析"></div>
            <div class="form-group"><label>功能2</label><input id="set-login_feat2" placeholder="高效订单与商品管理"></div>
            <div class="form-group"><label>功能3</label><input id="set-login_feat3" placeholder="安全认证与权限控制"></div>
            <div class="form-group"><label>功能4</label><input id="set-login_feat4" placeholder="云端部署，多端同步"></div>
            <div class="form-group"><label>底部文字</label><input id="set-login_footer" placeholder="-- Secure · Stable · Scalable --"></div>
            <div class="form-row">
              <div class="form-group"><label>左侧背景色</label><input id="set-login_left_bg" placeholder="#1e2b3c"></div>
              <div class="form-group"><label>按钮颜色</label><input id="set-login_btn_bg" placeholder="#1e2b3c"></div>
            </div>
            <button class="btn btn-primary" onclick="saveLoginSettings()"><i class="fas fa-save"></i> 保存登录页配置</button>
            <button class="btn btn-outline" onclick="previewLogin()"><i class="fas fa-eye"></i> 预览</button>
          </div>
        </div>
        <!-- Bot 配置 -->
        <div class="card" style="margin-top:20px">
          <div class="card-header"><h3><i class="fas fa-robot"></i> Bot 配置</h3></div>
          <div class="card-body">
            <div style="background:var(--light);padding:16px;border-radius:8px;margin-bottom:16px;border-left:4px solid #3b82f6">
              <p style="margin:0;color:#1e40af;font-size:13px"><i class="fas fa-info-circle"></i> 修改 Bot Token 后需要重新设置 Webhook</p>
            </div>
            <div class="form-group"><label>Bot Token</label><input id="set-bot_token" type="password" placeholder="从 @BotFather 获取"></div>
            <div class="form-group"><label>Webhook Secret</label><input id="set-webhook_secret" type="password" placeholder="自定义密钥"></div>
            <button class="btn btn-primary" onclick="saveBotConfig()"><i class="fas fa-save"></i> 保存 Bot 配置</button>
            <button class="btn btn-outline" onclick="setWebhook()"><i class="fas fa-link"></i> 重新设置 Webhook</button>
          </div>
        </div>
        <!-- 危险操作 -->
        <div class="card" style="margin-top:20px;border:2px solid #ef4444">
          <div class="card-header" style="background:#fef2f2"><h3 style="color:#dc2626"><i class="fas fa-exclamation-triangle"></i> 危险操作</h3></div>
          <div class="card-body">
            <div style="background:#fef2f2;padding:16px;border-radius:8px;margin-bottom:16px;border-left:4px solid #ef4444">
              <p style="margin:0;color:#991b1b;font-size:13px"><i class="fas fa-exclamation-triangle"></i> <strong>警告：</strong>恢复出厂设置将<strong>物理删除</strong>所有数据，包括：</p>
              <ul style="margin:8px 0 0;color:#991b1b;font-size:13px;padding-left:20px">
                <li>所有用户数据</li>
                <li>所有订单记录</li>
                <li>所有商品和卡密</li>
                <li>所有充值卡</li>
                <li>所有系统设置</li>
              </ul>
              <p style="margin:8px 0 0;color:#dc2626;font-weight:600;font-size:13px">此操作不可恢复！请谨慎操作！</p>
            </div>
            <button class="btn btn-danger" onclick="factoryReset()" style="background:#dc2626;color:white;border:none;padding:10px 24px"><i class="fas fa-trash-alt"></i> 一键恢复出厂设置</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>

<!-- Modals -->
<div id="productModal" class="modal-overlay" onclick="if(event.target===this)closeM('productModal')">
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
        <div class="form-group"><label>销售价格（元）</label><input id="p-price" type="number" step="0.01" min="0" placeholder="如 9.99"></div>
        <div class="form-group"><label>原价（元）</label><input id="p-original" type="number" step="0.01" min="0" placeholder="可选"></div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeM('productModal')">取消</button>
      <button class="btn btn-primary" onclick="saveProduct()"><i class="fas fa-check"></i> 保存</button>
    </div>
  </div>
</div>

<div id="categoryModal" class="modal-overlay" onclick="if(event.target===this)closeM('categoryModal')">
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
<div id="userDetailModal" class="modal-overlay" onclick="if(event.target===this)closeM('userDetailModal')">
  <div class="modal" style="width:800px">
    <div class="modal-header">
      <h3><i class="fas fa-user"></i> 用户详情</h3>
      <div style="display:flex;gap:8px">
        <button class="btn btn-secondary" onclick="exportUserData()" title="导出用户全部数据"><i class="fas fa-download"></i> 导出</button>
        <button class="modal-close" onclick="closeM('userDetailModal')"><i class="fas fa-times"></i></button>
      </div>
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
          <div style="font-size:12px;color:var(--gray);margin-bottom:4px">消费成功计次</div>
          <div style="font-size:16px;font-weight:600;color:var(--primary)" id="ud-spent">-</div>
        </div>
        <div style="background:var(--light);padding:16px;border-radius:8px">
          <div style="font-size:12px;color:var(--gray);margin-bottom:4px">邀请码</div>
          <div style="font-size:16px;font-weight:600;display:flex;align-items:center;gap:8px"><span id="ud-invite">-</span><i class="fas fa-copy" style="font-size:14px;color:var(--primary);cursor:pointer" onclick="navigator.clipboard.writeText(document.getElementById(&apos;ud-invite&apos;).textContent);toast(&apos;已复制邀请码&apos;)"></i></div>
        </div>
        <div style="background:var(--light);padding:16px;border-radius:8px">
          <div style="font-size:12px;color:var(--gray);margin-bottom:4px">邀请人数</div>
          <div style="font-size:16px;font-weight:600" id="ud-invitecount">-</div>
        </div>
      </div>

      <!-- Tabs -->
      <div style="display:flex;gap:4px;margin-bottom:16px;border-bottom:2px solid var(--light-2);padding-bottom:0;overflow-x:auto">
        <div class="tab-btn active" onclick="switchUserTab('balance',this)" style="padding:10px 16px;cursor:pointer;font-size:13px;font-weight:500;border-bottom:2px solid var(--primary);margin-bottom:-2px;color:var(--primary);white-space:nowrap">余额操作</div>
        <div class="tab-btn" onclick="switchUserTab('orders',this)" style="padding:10px 16px;cursor:pointer;font-size:13px;font-weight:500;color:var(--gray);border-bottom:2px solid transparent;margin-bottom:-2px;white-space:nowrap">订单记录</div>
        <div class="tab-btn" onclick="switchUserTab('redeem',this)" style="padding:10px 16px;cursor:pointer;font-size:13px;font-weight:500;color:var(--gray);border-bottom:2px solid transparent;margin-bottom:-2px;white-space:nowrap">充值卡记录</div>
        <div class="tab-btn" onclick="switchUserTab('logs',this)" style="padding:10px 16px;cursor:pointer;font-size:13px;font-weight:500;color:var(--gray);border-bottom:2px solid transparent;margin-bottom:-2px;white-space:nowrap">操作日志</div>
        <div class="tab-btn" onclick="switchUserTab('invite',this)" style="padding:10px 16px;cursor:pointer;font-size:13px;font-weight:500;color:var(--gray);border-bottom:2px solid transparent;margin-bottom:-2px;white-space:nowrap">邀请管理</div>
        <div class="tab-btn" onclick="switchUserTab('edit',this)" style="padding:10px 16px;cursor:pointer;font-size:13px;font-weight:500;color:var(--gray);border-bottom:2px solid transparent;margin-bottom:-2px;white-space:nowrap">编辑信息</div>
      </div>

      <!-- Balance Tab -->
      <div id="ud-tab-balance">
        <div class="form-row">
          <div class="form-group">
            <label>调整金额（元）</label>
            <input id="ud-amount" type="number" step="0.01" placeholder="输入金额，如 10 或 -10">
          </div>
          <div class="form-group">
            <label>调整原因</label>
            <input id="ud-reason" placeholder="如：管理员充值">
          </div>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px">
          <button class="btn btn-success btn-sm" onclick="quickBalance(10)"><i class="fas fa-plus"></i> ¥10</button>
          <button class="btn btn-success btn-sm" onclick="quickBalance(50)"><i class="fas fa-plus"></i> ¥50</button>
          <button class="btn btn-success btn-sm" onclick="quickBalance(100)"><i class="fas fa-plus"></i> ¥100</button>
          <button class="btn btn-success btn-sm" onclick="quickBalance(500)"><i class="fas fa-plus"></i> ¥500</button>
          <button class="btn btn-danger btn-sm" onclick="quickBalance(-10)"><i class="fas fa-minus"></i> ¥10</button>
          <button class="btn btn-danger btn-sm" onclick="quickBalance(-50)"><i class="fas fa-minus"></i> ¥50</button>
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

      <!-- Redeem Cards Tab -->
      <div id="ud-tab-redeem" style="display:none">
        <table>
          <thead><tr><th>充值卡码</th><th>面额</th><th>使用时间</th></tr></thead>
          <tbody id="ud-redeem-list"></tbody>
        </table>
      </div>

      <!-- Logs Tab -->
      <div id="ud-tab-logs" style="display:none">
        <table>
          <thead><tr><th>操作</th><th>详情</th><th>时间</th></tr></thead>
          <tbody id="ud-logs-list"></tbody>
        </table>
      </div>

      <!-- Invite Tab -->
      <div id="ud-tab-invite" style="display:none">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
          <div style="background:var(--light);padding:12px;border-radius:8px">
            <div style="font-size:12px;color:var(--gray);margin-bottom:4px">我的邀请码</div>
            <div style="font-size:18px;font-weight:700;color:var(--primary)" id="ud-my-invite">-</div>
          </div>
          <div style="background:var(--light);padding:12px;border-radius:8px">
            <div style="font-size:12px;color:var(--gray);margin-bottom:4px">邀请人</div>
            <div style="font-size:16px;font-weight:600" id="ud-my-inviter">-</div>
          </div>
        </div>
        <div style="font-size:14px;font-weight:600;margin-bottom:8px">邀请的用户</div>
        <table>
          <thead><tr><th>用户ID</th><th>用户名</th><th>消费成功计次</th><th>注册时间</th></tr></thead>
          <tbody id="ud-invited-list"></tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<!-- Confirm Dialog -->
<div id="confirmOverlay" class="confirm-overlay" onclick="if(event.target===this){document.getElementById('confirmOverlay').classList.remove('show')}">
  <div class="confirm-dialog">
    <div class="confirm-icon"><i class="fas fa-exclamation-triangle"></i></div>
    <div class="confirm-msg" id="confirmMsg"></div>
    <div class="confirm-btns">
      <button class="btn btn-outline" onclick="confirmResolve(false)">取消</button>
      <button class="btn btn-danger" onclick="confirmResolve(true)">确定</button>
    </div>
  </div>
</div>

<div class="toast-container" id="toasts"></div>

<script>
const API='/api';
let TOKEN=localStorage.getItem('admin_token');
let CATS=[];

(function updateLoginDate(){
  var el=document.getElementById('loginDate');
  if(el){
    var now=new Date();
    var y=now.getFullYear();
    var m=String(now.getMonth()+1).padStart(2,'0');
    var d=String(now.getDate()).padStart(2,'0');
    var wd=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][now.getDay()];
    var hh=String(now.getHours()).padStart(2,'0');
    var mm=String(now.getMinutes()).padStart(2,'0');
    var ss=String(now.getSeconds()).padStart(2,'0');
    el.textContent=y+'-'+m+'-'+d+' '+wd+' '+hh+':'+mm+':'+ss;
  }
  setTimeout(updateLoginDate,1000);
})();

if(TOKEN) checkAuth(); else showLogin();

function showLogin(){document.getElementById('loginPage').style.display='flex';document.getElementById('app').style.display='none';try{var s=localStorage.getItem('login_settings');if(s){loginSettings=JSON.parse(s);applyLoginSettings()}}catch(e){}}
function showApp(){document.getElementById('loginPage').style.display='none';document.getElementById('app').style.display='block'}

async function checkAuth(){
  try{const r=await fetch(API+'/stats',{headers:h()});if(r.ok){showApp();loadDashboard()}else{showLogin()}}
  catch(e){showLogin()}
}

async function doLogin(){
  var pw=document.getElementById('loginPassword').value.trim();
  if(!pw){alert('Please enter password');return}
  try{
    var r=await fetch(API+'/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pw})});
    var d=await r.json();
    if(d.token){TOKEN=d.token;localStorage.setItem('admin_token',TOKEN);showApp();loadDashboard();toast('Login success','success')}
    else{alert(d.error||'Wrong password')}
  }catch(e){alert('Login failed: network error')}
}

function doLogout(){TOKEN=null;localStorage.removeItem('admin_token');showLogin()}

function h(){return{'Authorization':'Bearer '+TOKEN,'Content-Type':'application/json'}}
function fmt(d){return d?new Date(d).toLocaleString('zh-CN'):'-'}
function money(v){return'¥'+Number(v).toFixed(2)}

function toast(msg,type='success'){
  const c=document.getElementById('toasts');
  const t=document.createElement('div');
  t.className='toast toast-'+type;
  t.innerHTML='<i class="fas fa-'+(type==='success'?'check-circle':type==='error'?'exclamation-circle':'info-circle')+'"></i> '+msg;
  c.appendChild(t);
  setTimeout(()=>{t.style.opacity='0';t.style.transform='translateX(100%)';setTimeout(()=>t.remove(),300)},3000)
}

let _confirmResolve=null;
function showConfirm(msg){
  return new Promise(resolve=>{
    _confirmResolve=resolve;
    document.getElementById('confirmMsg').textContent=msg;
    document.getElementById('confirmOverlay').classList.add('show');
  });
}
function confirmResolve(val){
  document.getElementById('confirmOverlay').classList.remove('show');
  if(_confirmResolve){_confirmResolve(val);_confirmResolve=null}
}

// ========== 通用分页和批量选择系统 ==========
const PG={page:{},pageSize:{},selected:{},allData:{}};

function pgInit(key,defaultSize){
  if(!PG.page[key])PG.page[key]=1;
  if(!PG.pageSize[key])PG.pageSize[key]=defaultSize||10;
  if(!PG.selected[key])PG.selected[key]=new Set();
  if(!PG.allData[key])PG.allData[key]=[];
}

function pgSetData(key,data){
  PG.allData[key]=data||[];
  const total=PG.allData[key].length;
  const ps=PG.pageSize[key];
  const maxPage=Math.max(1,Math.ceil(total/ps));
  if(PG.page[key]>maxPage)PG.page[key]=maxPage;
}

function pgGetData(key){
  const d=PG.allData[key]||[];
  const ps=PG.pageSize[key];
  const start=(PG.page[key]-1)*ps;
  return d.slice(start,start+ps);
}

function pgTotal(key){return(PG.allData[key]||[]).length}
function pgPages(key){return Math.max(1,Math.ceil(pgTotal(key)/PG.pageSize[key]))}

function pgRender(key,renderFn,containerId){
  const items=pgGetData(key);
  document.getElementById(containerId).innerHTML=items.length?renderFn(items):'<tr><td colspan="20"><div class="empty"><i class="fas fa-inbox"></i><p>暂无数据</p></div></td></tr>';
  pgRenderControls(key,containerId);
  pgUpdateBatchBar(key);
}

function pgRenderControls(key,containerId){
  const el=document.getElementById(containerId);
  const card=el.closest('.card');
  let pgEl=card.querySelector('.pagination-wrap');
  if(!pgEl){pgEl=document.createElement('div');pgEl.className='pagination-wrap';card.appendChild(pgEl)}
  const total=pgTotal(key);
  const ps=PG.pageSize[key];
  const cur=PG.page[key];
  const pages=pgPages(key);
  const start=total?((cur-1)*ps+1):0;
  const end=Math.min(cur*ps,total);

  let btns='';
  btns+='<button '+(cur<=1?'disabled':'')+' onclick="pgGo(&apos;'+key+'&apos;,1,&apos;'+containerId+'&apos;)">&laquo;</button>';
  btns+='<button '+(cur<=1?'disabled':'')+' onclick="pgGo(&apos;'+key+'&apos;,'+(cur-1)+',&apos;'+containerId+'&apos;)">&lsaquo;</button>';
  const range=pgRange(cur,pages,3);
  for(const p of range){
    if(p==='...')btns+='<span class="pg-ellipsis">...</span>';
    else btns+='<button class="'+(p===cur?'active':'')+'" onclick="pgGo(&apos;'+key+'&apos;,'+p+',&apos;'+containerId+'&apos;)">'+p+'</button>';
  }
  btns+='<button '+(cur>=pages?'disabled':'')+' onclick="pgGo(&apos;'+key+'&apos;,'+(cur+1)+',&apos;'+containerId+'&apos;)">&rsaquo;</button>';
  btns+='<button '+(cur>=pages?'disabled':'')+' onclick="pgGo(&apos;'+key+'&apos;,'+pages+',&apos;'+containerId+'&apos;)">&raquo;</button>';

  const sizes=[10,20,50,100].map(s=>'<option value="'+s+'" '+(ps==s?'selected':'')+'>'+s+'</option>').join('');
  pgEl.innerHTML='<div class="pg-info">显示 '+start+'-'+end+' / 共 <strong>'+total+'</strong> 条</div><div class="pg-nav">'+btns+'</div><div class="pg-right"><label><select onchange="pgSize(&apos;'+key+'&apos;,this.value,&apos;'+containerId+'&apos;)">'+sizes+'</select> 条/页</label><div class="pg-jump"><span>跳转</span><input type="number" min="1" max="'+pages+'" value="'+cur+'" onkeydown="if(event.key==='+"'Enter'"+')pgGo(&apos;'+key+'&apos;,this.value,&apos;'+containerId+'&apos;)"><button onclick="pgGo(&apos;'+key+'&apos;,this.previousElementSibling.value,&apos;'+containerId+'&apos;)">确定</button></div></div>';
}

function pgRange(cur,total,around){
  const range=[];
  const start=Math.max(2,cur-around);
  const end=Math.min(total-1,cur+around);
  range.push(1);
  if(start>2)range.push('...');
  for(let i=start;i<=end;i++)range.push(i);
  if(end<total-1)range.push('...');
  if(total>1)range.push(total);
  return range;
}

function pgGo(key,page,containerId){
  page=Math.max(1,Math.min(parseInt(page)||1,pgPages(key)));
  PG.page[key]=page;
  PG.selected[key].clear();
  window['_pgRender_'+key]();
}

function pgSize(key,size,containerId){
  PG.pageSize[key]=parseInt(size);
  PG.page[key]=1;
  PG.selected[key].clear();
  window['_pgRender_'+key]();
}

function pgToggleAll(key,el){
  const items=pgGetData(key);
  if(el.checked){items.forEach(i=>PG.selected[key].add(i.id||i.order_no||i.code))}
  else{items.forEach(i=>PG.selected[key].delete(i.id||i.order_no||i.code))}
  const tbody=document.getElementById(window['_pgContainer_'+key]);
  if(tbody){tbody.querySelectorAll('input[type="checkbox"]').forEach((cb,idx)=>{if(idx<items.length)cb.checked=el.checked})}
  pgUpdateBatchBar(key);
}

function pgToggle(key,id,el){
  if(el.checked)PG.selected[key].add(id);
  else PG.selected[key].delete(id);
  pgUpdateBatchBar(key);
  const selAll=document.querySelector('[data-pg="'+key+'"] .pg-select-all');
  if(selAll){const items=pgGetData(key);selAll.checked=items.every(i=>PG.selected[key].has(i.id||i.order_no||i.code))}
}

function pgUpdateBatchBar(key){
  const bar=document.querySelector('[data-batch="'+key+'"]');
  if(!bar)return;
  const count=PG.selected[key].size;
  bar.classList.toggle('show',count>0);
  const span=bar.querySelector('span');
  if(span)span.textContent='已选择 '+count+' 项';
}

function pgGetSelected(key){return Array.from(PG.selected[key])}

// ========== 通用分页和批量选择系统 ==========

const pages={dashboard:'数据看板',orders:'订单管理',products:'商品管理',categories:'分类管理',cards:'卡密管理',redeem:'充值卡管理',users:'用户管理',settings:'系统设置'};
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
  if(page==='redeem')loadRedeemCards();
  if(page==='users')loadUsers();
  if(page==='settings')loadSettings();
  // 手机端点击菜单后自动关闭侧边栏
  if(window.innerWidth<=768){
    var sb=document.getElementById('sidebar');
    var ov=document.getElementById('sidebarOverlay');
    var hb=document.querySelector('.hamburger');
    if(sb)sb.classList.remove('open');
    if(ov)ov.classList.remove('show');
    if(hb)hb.classList.remove('open');
  }
}

var orderChartInstance=null;

async function loadDashboard(){
  try{
    const[r,o]=await Promise.all([fetch(API+'/stats',{headers:h()}),fetch(API+'/orders?limit=100',{headers:h()})]);
    const s=await r.json();const od=await o.json();
    if(s.data){
      document.getElementById('s-users').textContent=s.data.totalUsers||0;
      document.getElementById('s-orders').textContent=s.data.totalOrders||0;
      document.getElementById('s-revenue').textContent=money(s.data.totalRevenue||0);
      document.getElementById('s-today').textContent=s.data.todayOrders||0;
    }
    renderOrderChart(od.data||[]);
  }catch(e){console.error(e)}
}

function renderOrderChart(orders){
  var canvas=document.getElementById('orderChart');
  if(!canvas)return;
  if(orderChartInstance){orderChartInstance.destroy();orderChartInstance=null}
  // 统计近7天数据
  var days=[];var counts=[];var amounts=[];
  for(var i=6;i>=0;i--){
    var d=new Date();d.setDate(d.getDate()-i);
    var ds=d.toISOString().split('T')[0];
    days.push((d.getMonth()+1)+'/'+d.getDate());
    var dayOrders=orders.filter(function(o){return o.created_at&&o.created_at.startsWith(ds)});
    counts.push(dayOrders.length);
    amounts.push(dayOrders.reduce(function(sum,o){return sum+(o.amount||0)},0));
  }
  var ctx=canvas.getContext('2d');
  orderChartInstance=new Chart(ctx,{
    type:'line',
    data:{
      labels:days,
      datasets:[
        {
          label:'订单数',
          data:counts,
          borderColor:'#6366f1',
          backgroundColor:'rgba(99,102,241,0.1)',
          borderWidth:2.5,
          tension:0.4,
          fill:true,
          pointBackgroundColor:'#6366f1',
          pointBorderColor:'#fff',
          pointBorderWidth:2,
          pointRadius:5,
          pointHoverRadius:7,
          yAxisID:'y'
        },
        {
          label:'订单金额(¥)',
          data:amounts,
          borderColor:'#22c55e',
          backgroundColor:'rgba(34,197,94,0.08)',
          borderWidth:2.5,
          tension:0.4,
          fill:true,
          pointBackgroundColor:'#22c55e',
          pointBorderColor:'#fff',
          pointBorderWidth:2,
          pointRadius:5,
          pointHoverRadius:7,
          yAxisID:'y1'
        }
      ]
    },
    options:{
      responsive:true,
      maintainAspectRatio:false,
      interaction:{mode:'index',intersect:false},
      plugins:{
        legend:{position:'top',labels:{usePointStyle:true,padding:16,font:{size:13}}},
        tooltip:{
          backgroundColor:'rgba(0,0,0,0.8)',
          padding:12,
          cornerRadius:8,
          titleFont:{size:13},
          bodyFont:{size:12},
          callbacks:{label:function(c){return c.dataset.label+': '+(c.datasetIndex===1?'¥'+c.parsed.y.toFixed(2):c.parsed.y+' 单')}}
        }
      },
      scales:{
        x:{grid:{display:false},ticks:{font:{size:12}}},
        y:{position:'left',beginAtZero:true,grid:{color:'rgba(0,0,0,0.05)'},ticks:{font:{size:12},stepSize:1},title:{display:true,text:'订单数',font:{size:12}}},
        y1:{position:'right',beginAtZero:true,grid:{drawOnChartArea:false},ticks:{font:{size:12},callback:function(v){return '¥'+v}},title:{display:true,text:'金额',font:{size:12}}}
      }
    }
  });
}

function statusTag(s){
  const m={pending:['warning','待支付'],paid:['info','已支付'],delivered:['success','已完成'],refunded:['danger','已退款'],cancelled:['danger','已取消']};
  const[t,l]=m[s]||['info',s];
  return'<span class="tag tag-'+t+'">'+l+'</span>';
}

async function loadOrders(){
  const search=document.getElementById('orderSearch')?.value||'';
  const status=document.getElementById('orderStatusFilter')?.value||'';
  let url=API+'/orders?limit=100';
  if(search)url+='&search='+encodeURIComponent(search);
  if(status)url+='&status='+encodeURIComponent(status);
  const r=await fetch(url,{headers:h()});const d=await r.json();
  pgInit('orders',10);pgSetData('orders',d.data||[]);
  window['_pgRender_orders']=()=>pgRender('orders',renderOrders,'ordersList');
  window['_pgRenderItems_orders']=renderOrders;
  window['_pgContainer_orders']='ordersList';
  pgRender('orders',renderOrders,'ordersList');
}
function renderOrders(items){
  return items.map(o=>'<tr><td class="checkbox-col"><input type="checkbox" class="checkbox" '+(PG.selected.orders.has(o.order_no)?'checked':'')+' onchange="pgToggle(&apos;orders&apos;,&apos;'+o.order_no+'&apos;,this)"></td><td><code>'+o.order_no+'</code></td><td>'+(o.username||o.user_id)+'</td><td>'+(o.product_name||'-')+'</td><td>'+(o.quantity||1)+'</td><td>'+money(o.amount)+'</td><td>'+(o.payment_method==='stars'?'Stars':o.payment_method==='balance'?'balance':'-')+'</td><td>'+statusTag(o.status)+'</td><td>'+fmt(o.created_at)+'</td><td class="actions">'+(o.status==='paid'||o.status==='delivered'?'<button class="btn btn-danger btn-sm" onclick="refundOrder('+o.id+')">Refund</button>':'')+'</td></tr>').join('');
}
async function batchDeleteOrders(){
  const sel=pgGetSelected('orders');
  if(!sel.length)return;
  if(!await showConfirm('确定删除选中的 '+sel.length+' 个订单？'))return;
  for(const id of sel){await fetch(API+'/orders/'+id,{method:'DELETE',headers:h()})}
  toast('已删除 '+sel.length+' 个订单');PG.selected.orders.clear();loadOrders()
}

async function refundOrder(id){
  if(!await showConfirm('确定要退款吗？'))return;
  await fetch(API+'/orders/'+id+'/refund',{method:'POST',headers:h()});toast('退款成功');loadOrders()
}

async function loadProducts(){
  const[r,c]=await Promise.all([fetch(API+'/products',{headers:h()}),fetch(API+'/categories',{headers:h()})]);
  const d=await r.json();const cd=await c.json();CATS=cd.data||[];
  pgInit('products',10);pgSetData('products',d.data||[]);
  window['_pgRender_products']=()=>pgRender('products',renderProducts,'productsList');
  window['_pgRenderItems_products']=renderProducts;
  window['_pgContainer_products']='productsList';
  pgRender('products',renderProducts,'productsList');
}
function renderProducts(items){
  return items.map(p=>'<tr><td class="checkbox-col"><input type="checkbox" class="checkbox" '+(PG.selected.products.has(p.id)?'checked':'')+' onchange="pgToggle(&apos;products&apos;,'+p.id+',this)"></td><td>'+p.id+'</td><td><strong>'+p.name+'</strong></td><td>'+catName(p.category_id)+'</td><td>'+money(p.price)+'</td><td>'+p.stock_count+'</td><td>'+p.sales_count+'</td><td>'+(p.is_active?'<span class="tag tag-success">上架</span>':'<span class="tag tag-info">下架</span>')+'</td><td class="actions"><button class="btn btn-outline btn-sm" onclick="editProduct('+p.id+')"><i class="fas fa-edit"></i></button><button class="btn btn-sm '+(p.is_active?'btn-danger':'btn-success')+'" onclick="toggleProduct('+p.id+')">'+(p.is_active?'下架':'上架')+'</button></td></tr>').join('');
}
async function batchDeleteProducts(){
  const sel=pgGetSelected('products');
  if(!sel.length)return;
  if(!await showConfirm('确定删除选中的 '+sel.length+' 个商品？'))return;
  for(const id of sel){await fetch(API+'/products/'+id,{method:'DELETE',headers:h()})}
  toast('已删除 '+sel.length+' 个商品');PG.selected.products.clear();loadProducts()
}
async function batchToggleProducts(active){
  const sel=pgGetSelected('products');
  if(!sel.length)return;
  for(const id of sel){await fetch(API+'/products/'+id+'/toggle',{method:'PATCH',headers:h()})}
  toast('操作成功');PG.selected.products.clear();loadProducts()
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
  document.getElementById('p-price').value=Number(p.price).toFixed(2);document.getElementById('p-original').value=p.original_price?Number(p.original_price).toFixed(2):'';
  document.getElementById('p-category').innerHTML=CATS.map(c=>'<option value="'+c.id+'"'+(c.id===p.category_id?' selected':'')+'>'+c.icon+' '+c.name+'</option>').join('');
  openM('productModal')
}

async function saveProduct(){
  const id=document.getElementById('p-edit-id').value;
  const body={category_id:+document.getElementById('p-category').value,name:document.getElementById('p-name').value,description:document.getElementById('p-desc').value,price:parseFloat(document.getElementById('p-price').value),original_price:parseFloat(document.getElementById('p-original').value)||null};
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

async function deleteCategory(id){if(!await showConfirm('确定删除此分类？'))return;await fetch(API+'/categories/'+id,{method:'DELETE',headers:h()});toast('分类已删除');loadCategories()}

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

async function deleteCard(pid,cid){if(!await showConfirm('确定删除？'))return;await fetch(API+'/products/'+pid+'/cards/'+cid,{method:'DELETE',headers:h()});toast('已删除');loadCards()}

let currentUserId=null;

async function loadUsers(){
  const r=await fetch(API+'/users',{headers:h()});const d=await r.json();
  pgInit('users',10);pgSetData('users',d.data||[]);
  window['_pgRender_users']=()=>pgRender('users',renderUsersItems,'usersList');
  window['_pgRenderItems_users']=renderUsersItems;
  window['_pgContainer_users']='usersList';
  pgRender('users',renderUsersItems,'usersList');
}

async function searchUsers(){
  const q=document.getElementById('userSearch').value.trim();
  const r=await fetch(API+'/users?search='+encodeURIComponent(q),{headers:h()});const d=await r.json();
  pgInit('users',10);pgSetData('users',d.data||[]);
  PG.page.users=1;PG.selected.users.clear();
  pgRender('users',renderUsersItems,'usersList');
}

function resetUsers(){
  document.getElementById('userSearch').value='';
  loadUsers();
}

function renderUsersItems(items){
  return items.map(u=>'<tr><td class="checkbox-col"><input type="checkbox" class="checkbox" '+(PG.selected.users.has(u.user_id)?'checked':'')+' onchange="pgToggle(&apos;users&apos;,&apos;'+u.user_id+'&apos;,this)"></td><td><code>'+u.user_id+'</code></td><td><strong>'+(u.username||'-')+'</strong><br><small style="color:var(--gray)">'+(u.first_name||'')+'</small></td><td style="color:var(--success);font-weight:600">'+money(u.balance)+'</td><td>'+u.order_count+'</td><td>'+(u.successful_count||0)+' 次'+'</td><td><code>'+(u.invite_code||'-')+'</code></td><td>'+(u.invited_by||'-')+'</td><td><small>'+fmt(u.created_at)+'</small></td><td>'+(u.is_banned?'<span class="tag tag-danger">封禁</span>':'<span class="tag tag-success">正常</span>')+'</td><td class="actions"><button class="btn btn-primary btn-sm" onclick="viewUser('+u.user_id+')"><i class="fas fa-eye"></i></button><button class="btn btn-sm '+(u.is_banned?'btn-success':'btn-danger')+'" onclick="toggleBan('+u.user_id+','+(u.is_banned?'true':'false')+')">'+(u.is_banned?'解封':'封禁')+'</button></td></tr>').join('');
}

async function batchBanUsers(ban){
  const sel=pgGetSelected('users');
  if(!sel.length)return;
  if(!await showConfirm('确定'+(ban?'封禁':'解封')+'选中的 '+sel.length+' 个用户？'))return;
  for(const id of sel){await fetch(API+'/users/'+id+'/ban',{method:'POST',headers:h(),body:JSON.stringify({is_banned:ban})})}
  toast('操作成功');PG.selected.users.clear();loadUsers()
}

async function viewUser(userId){
  currentUserId=userId;
  const r=await fetch(API+'/users/'+userId,{headers:h()});const d=await r.json();
  const u=d.data;
  document.getElementById('ud-id').textContent=u.user_id;
  document.getElementById('ud-username').textContent=u.username||u.first_name||'-';
  document.getElementById('ud-balance').textContent=money(u.balance);
  document.getElementById('ud-spent').textContent=(u.successful_count||0)+' 次';
  document.getElementById('ud-invite').textContent=u.invite_code||'-';
  document.getElementById('ud-invitecount').textContent=u.invite_count||0;
  document.getElementById('ud-edit-username').value=u.username||'';
  document.getElementById('ud-edit-firstname').value=u.first_name||'';
  document.getElementById('ud-edit-banned').value=u.is_banned?'1':'0';
  document.getElementById('ud-amount').value='';
  document.getElementById('ud-reason').value='';
  document.getElementById('ud-orders-list').innerHTML=(u.orders||[]).slice(0,20).map(o=>'<tr><td><code>'+o.order_no+'</code></td><td>'+(o.product_name||'-')+'</td><td>'+money(o.amount)+'</td><td>'+statusTag(o.status)+'</td><td>'+fmt(o.created_at)+'</td></tr>').join('')||'<tr><td colspan="5" style="text-align:center;color:var(--gray)">暂无订单</td></tr>';
  document.getElementById('ud-redeem-list').innerHTML=(u.redeem_cards||[]).map(c=>'<tr><td><code style="cursor:pointer" onclick="copyRC(this)">'+c.code+'</code></td><td>'+money(c.amount)+'</td><td>'+fmt(c.used_at)+'</td></tr>').join('')||'<tr><td colspan="3" style="text-align:center;color:var(--gray)">暂无充值卡使用记录</td></tr>';
  document.getElementById('ud-logs-list').innerHTML=(u.logs||[]).map(l=>{let d='';try{d=JSON.parse(l.detail);d=JSON.stringify(d)}catch(e){d=l.detail||'-'}return'<tr><td>'+l.action+'</td><td style="max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="'+d.replace(/"/g,'&quot;')+'">'+d+'</td><td>'+fmt(l.created_at)+'</td></tr>'}).join('')||'<tr><td colspan="3" style="text-align:center;color:var(--gray)">暂无操作日志</td></tr>';
  document.getElementById('ud-my-invite').textContent=u.invite_code||'-';
  document.getElementById('ud-my-inviter').textContent=u.invited_by||'无';
  document.getElementById('ud-invited-list').innerHTML=(u.invited_users||[]).map(iu=>'<tr><td><code>'+iu.user_id+'</code></td><td>'+(iu.username||iu.first_name||'-')+'</td><td>'+(iu.successful_count||0)+' 次'+'</td><td>'+fmt(iu.created_at)+'</td></tr>').join('')||'<tr><td colspan="4" style="text-align:center;color:var(--gray)">暂无邀请记录</td></tr>';
  switchUserTab('balance');
  openM('userDetailModal');
}

function switchUserTab(tab,el){
  ['balance','orders','redeem','logs','invite','edit'].forEach(t=>{const tabEl=document.getElementById('ud-tab-'+t);if(tabEl)tabEl.style.display=t===tab?'block':'none'});
  document.querySelectorAll('.tab-btn').forEach(b=>{b.style.color='var(--gray)';b.style.borderBottom='2px solid transparent'});
  if(el){el.style.color='var(--primary)';el.style.borderBottom='2px solid var(--primary)'}
  else{document.querySelector('.tab-btn').style.color='var(--primary)';document.querySelector('.tab-btn').style.borderBottom='2px solid var(--primary)'}
}

function quickBalance(amount){document.getElementById('ud-amount').value=amount}

async function adjustBalance(){
  const amount=parseFloat(document.getElementById('ud-amount').value);
  const reason=document.getElementById('ud-reason').value;
  if(!amount){toast('请输入调整金额','error');return}
  const r=await fetch(API+'/users/'+currentUserId+'/balance',{method:'POST',headers:h(),body:JSON.stringify({amount,reason})});
  const d=await r.json();
  if(d.error){toast(d.error,'error');return}
  toast('余额调整成功');viewUser(currentUserId);loadUsers()
}

async function exportUserData(){
  if(!currentUserId){toast('请先选择用户','error');return}
  try{
    const r=await fetch(API+'/users/'+currentUserId+'/export',{headers:h()});
    const d=await r.json();
    if(d.error){toast(d.error,'error');return}
    const json=JSON.stringify(d.data,null,2);
    const blob=new Blob([json],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;a.download='user_'+currentUserId+'_export_'+new Date().toISOString().slice(0,10)+'.json';
    document.body.appendChild(a);a.click();document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast('导出成功','success');
  }catch(e){toast('导出失败: '+e.message,'error')}
}

async function restoreItem(type,id){
  if(!confirm('确定要恢复此记录吗？'))return;
  let url='';
  if(type==='card'){url=API+'/products/0/cards/'+id+'/restore'}
  else if(type==='redeem'){url=API+'/redeem-cards/'+id+'/restore'}
  else{toast('未知类型','error');return}
  try{
    const r=await fetch(url,{method:'PATCH',headers:h()});
    const d=await r.json();
    if(d.error){toast(d.error,'error');return}
    toast('恢复成功','success');
    if(currentUserId)viewUser(currentUserId);
  }catch(e){toast('恢复失败: '+e.message,'error')}
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
  if(!await showConfirm(isBanned?'确定要解封此用户？':'确定要封禁此用户？'))return;
  await fetch(API+'/users/'+uid+'/ban',{method:'PATCH',headers:h(),body:JSON.stringify({is_banned:!isBanned})});
  toast(isBanned?'已解封':'已封禁');loadUsers()
}

function copyRC(el){navigator.clipboard.writeText(el.textContent);toast('已复制')}
let _genCards=[];
async function loadRedeemCards(){
  const r=await fetch(API+'/redeem-cards',{headers:h()});const d=await r.json();
  if(d.stats){
    document.getElementById('rc-total').textContent=d.stats.total;
    document.getElementById('rc-unused').textContent=d.stats.unused;
    document.getElementById('rc-used').textContent=d.stats.used||0;
    document.getElementById('rc-total-amount').textContent='¥'+Math.floor(d.stats.totalAmount||0);
  }
  delete PG.allData._redeem_all;
  document.getElementById('rc-search').value='';
  document.getElementById('rc-filter').value='all';
  pgInit('redeem',10);pgSetData('redeem',d.data||[]);
  window['_pgRender_redeem']=()=>pgRender('redeem',renderRedeemCards,'redeemCardsList');
  window['_pgRenderItems_redeem']=renderRedeemCards;
  window['_pgContainer_redeem']='redeemCardsList';
  pgRender('redeem',renderRedeemCards,'redeemCardsList');
}
function filterRedeemCards(){
  const q=(document.getElementById('rc-search').value||'').trim().toUpperCase();
  const st=document.getElementById('rc-filter').value;
  const all=PG.allData._redeem_all||(PG.allData._redeem_all=PG.allData.redeem.slice());
  let filtered=all;
  if(st==='unused')filtered=filtered.filter(c=>!c.is_used);
  else if(st==='used')filtered=filtered.filter(c=>c.is_used);
  if(q)filtered=filtered.filter(c=>c.code.includes(q));
  PG.allData.redeem=filtered;
  PG.page.redeem=1;PG.selected.redeem.clear();
  pgRender('redeem',renderRedeemCards,'redeemCardsList');
}
function renderRedeemCards(items){
  return items.map(c=>{
    const st=c.is_used?'<span class="tag tag-info">已使用</span>':'<span class="tag tag-success">未使用</span>';
    const ud=c.used_by?'<code>'+c.used_by+'</code>':'<span style="color:var(--gray-light)">-</span>';
    const ut=c.used_at?fmt(c.used_at):'<span style="color:var(--gray-light)">-</span>';
    const ct=fmt(c.created_at);
    const del='<button class="btn btn-danger btn-sm" onclick="deleteRedeemCard('+c.id+')"><i class="fas fa-trash"></i></button>';
    return '<tr><td class="checkbox-col"><input type="checkbox" class="checkbox" '+(PG.selected.redeem.has(c.id)?'checked':'')+' onchange="pgToggle(&apos;redeem&apos;,'+c.id+',this)"></td><td>'+c.id+'</td><td><code style="font-size:12px;cursor:pointer;user-select:all" onclick="copyRC(this)" title="点击复制">'+c.code+'</code></td><td style="font-weight:600;color:var(--primary)">'+money(c.amount)+'</td><td>'+st+'</td><td>'+ud+'</td><td>'+ut+'</td><td>'+ct+'</td><td>'+del+'</td></tr>';
  }).join('');
}
async function batchDeleteRedeemCards(){
  const sel=pgGetSelected('redeem');
  if(!sel.length)return;
  if(!await showConfirm('确定删除选中的 '+sel.length+' 张充值卡？'))return;
  for(const id of sel){await fetch(API+'/redeem-cards/'+id,{method:'DELETE',headers:h()})}
  toast('已删除 '+sel.length+' 张充值卡');PG.selected.redeem.clear();loadRedeemCards()
}
async function batchCopyRedeemCards(){
  const sel=pgGetSelected('redeem');
  if(!sel.length)return;
  const cards=PG.allData.redeem.filter(c=>sel.includes(c.id)&&!c.is_used);
  if(!cards.length){toast('选中的都是已使用的卡','error');return}
  navigator.clipboard.writeText(cards.map(c=>c.code).join('\\n'));
  toast('已复制 '+cards.length+' 张未使用卡码')
}

async function generateRedeemCards(){
  const amount=parseFloat(document.getElementById('rc-amount').value);
  const count=parseInt(document.getElementById('rc-count').value)||1;
  if(!amount||amount<=0){toast('请输入有效金额','error');return}
  if(count<1||count>100){toast('数量范围1-100','error');return}
  document.getElementById('rc-gen-hint').textContent='生成中...';
  const r=await fetch(API+'/redeem-cards',{method:'POST',headers:h(),body:JSON.stringify({amount,count})});
  const d=await r.json();
  if(d.error){toast(d.error,'error');document.getElementById('rc-gen-hint').textContent='';return}
  _genCards=d.data||[];
  document.getElementById('rc-gen-hint').textContent='成功生成 '+_genCards.length+' 张充值卡';
  setTimeout(()=>{document.getElementById('rc-gen-hint').textContent=''},3000);
  const resultDiv=document.getElementById('rc-gen-result');
  resultDiv.style.display='block';
  document.getElementById('rc-gen-cards').innerHTML=_genCards.map(c=>'<div style="background:var(--light);border:1px solid var(--light-2);border-radius:8px;padding:8px 12px;font-size:13px;cursor:pointer;user-select:all" onclick="copyRC(this)" title="点击复制"><code>'+c.code+'</code> <span style="color:var(--primary);font-weight:600">'+money(c.amount)+'</span></div>').join('');
  loadRedeemCards()
}
function copyAllGenCards(){
  if(!_genCards.length)return;
  navigator.clipboard.writeText(_genCards.map(c=>c.code).join('\\n'));
  toast('已复制 '+_genCards.length+' 张卡码');
}

async function deleteRedeemCard(id){
  if(!await showConfirm('确定删除此充值卡？'))return;
  await fetch(API+'/redeem-cards/'+id,{method:'DELETE',headers:h()});toast('已删除');loadRedeemCards()
}

async function loadSettings(){
  const r=await fetch(API+'/settings',{headers:h()});const d=await r.json();
  (d.data||[]).forEach(s=>{
    const el=document.getElementById('set-'+s.key);
    if(el){
      if(el.type==='checkbox'){el.checked=s.value==='1'}
      else{el.value=s.value}
    }
  });
  // 支付方式开关联动
  ['usdt','yipay','codepay'].forEach(p=>{
    const cb=document.getElementById('set-payment_'+p+'_enabled');
    const fields=document.getElementById(p+'-fields');
    if(cb&&fields){fields.style.display=cb.checked?'block':'none';cb.onchange=function(){fields.style.display=this.checked?'block':'none'}}
  });
  loadLoginSettings();
}

async function saveSettings(){
  const keys=['shop_name','welcome_message','welcome_parse_mode','support_username','commission_rate','order_expire_minutes','min_withdraw'];
  for(const k of keys){const el=document.getElementById('set-'+k);if(el)await fetch(API+'/settings',{method:'PUT',headers:h(),body:JSON.stringify({key:k,value:el.value})})}
  toast('设置已保存')
}

async function savePaymentSettings(){
  const keys=[
    'payment_stars_enabled',
    'payment_usdt_enabled','payment_usdt_address','payment_usdt_rate','payment_usdt_network',
    'payment_yipay_enabled','payment_yipay_url','payment_yipay_pid','payment_yipay_key',
    'payment_codepay_enabled','payment_codepay_url','payment_codepay_id','payment_codepay_key'
  ];
  for(const k of keys){
    const el=document.getElementById('set-'+k);
    if(el){
      const val=el.type==='checkbox'?(el.checked?'1':'0'):el.value;
      await fetch(API+'/settings',{method:'PUT',headers:h(),body:JSON.stringify({key:k,value:val})})
    }
  }
  toast('支付配置已保存')
}

// 保存 Bot 配置
async function saveBotConfig(){
  const keys=['bot_token','webhook_secret'];
  for(const k of keys){const el=document.getElementById('set-'+k);if(el&&el.value)await fetch(API+'/settings',{method:'PUT',headers:h(),body:JSON.stringify({key:k,value:el.value})})}
  toast('Bot 配置已保存')
}

// 设置 Webhook
async function setWebhook(){
  const r=await fetch(API+'/bot/set-webhook',{method:'POST',headers:h()});
  const d=await r.json();
  if(d.ok){toast('Webhook 设置成功')}else{toast('Webhook 设置失败: '+(d.error||'未知错误'),'error')}
}

// 一键恢复出厂设置
async function factoryReset(){
  if(!confirm('⚠️ 警告：此操作将物理删除所有数据！\n\n包括：\n- 所有用户数据\n- 所有订单记录\n- 所有商品和卡密\n- 所有充值卡\n- 所有系统设置\n\n此操作不可恢复！确定要继续吗？'))return;
  if(!confirm('最后确认：确定要恢复出厂设置吗？\n\n请输入 "RESET" 确认：'))return;

  try{
    const r=await fetch(API+'/system/factory-reset',{method:'POST',headers:h()});
    const d=await r.json();
    if(d.message){
      toast('恢复出厂设置成功，系统将在3秒后刷新');
      setTimeout(()=>location.reload(),3000);
    }else{
      toast('恢复失败: '+(d.error||'未知错误'),'error');
    }
  }catch(e){
    toast('恢复失败: '+e.message,'error');
  }
}

function openM(id){document.getElementById(id).classList.add('show')}
function closeM(id){document.getElementById(id).classList.remove('show')}

var loginSettings={};
function loadLoginSettings(){
  try{
    var s=localStorage.getItem('login_settings');
    if(s)loginSettings=JSON.parse(s);
    document.getElementById('set-login_brand').value=loginSettings.brand||'';
    document.getElementById('set-login_desc').value=loginSettings.desc||'';
    document.getElementById('set-login_feat1').value=loginSettings.feat1||'';
    document.getElementById('set-login_feat2').value=loginSettings.feat2||'';
    document.getElementById('set-login_feat3').value=loginSettings.feat3||'';
    document.getElementById('set-login_feat4').value=loginSettings.feat4||'';
    document.getElementById('set-login_footer').value=loginSettings.footer||'';
    document.getElementById('set-login_left_bg').value=loginSettings.leftBg||'';
    document.getElementById('set-login_btn_bg').value=loginSettings.btnBg||'';
  }catch(e){}
}

function saveLoginSettings(){
  loginSettings={
    brand:document.getElementById('set-login_brand').value,
    desc:document.getElementById('set-login_desc').value,
    feat1:document.getElementById('set-login_feat1').value,
    feat2:document.getElementById('set-login_feat2').value,
    feat3:document.getElementById('set-login_feat3').value,
    feat4:document.getElementById('set-login_feat4').value,
    footer:document.getElementById('set-login_footer').value,
    leftBg:document.getElementById('set-login_left_bg').value,
    btnBg:document.getElementById('set-login_btn_bg').value
  };
  localStorage.setItem('login_settings',JSON.stringify(loginSettings));
  applyLoginSettings();
  toast('Login settings saved','success');
}

function applyLoginSettings(){
  var s=loginSettings;
  if(!s.brand&&!s.desc)return;
  var b=document.querySelector('.login-page .brand-info h2');
  if(b&&s.brand)b.innerHTML='<i class="fas fa-rocket"></i> '+s.brand;
  var d=document.querySelector('.login-page .brand-info .brand-desc');
  if(d&&s.desc)d.textContent=s.desc;
  var fs=document.querySelectorAll('.login-page .feature-list li');
  if(fs[0]&&s.feat1)fs[0].innerHTML='<i class="fas fa-chart-pie"></i> '+s.feat1;
  if(fs[1]&&s.feat2)fs[1].innerHTML='<i class="fas fa-bolt"></i> '+s.feat2;
  if(fs[2]&&s.feat3)fs[2].innerHTML='<i class="fas fa-shield-alt"></i> '+s.feat3;
  if(fs[3]&&s.feat4)fs[3].innerHTML='<i class="fas fa-cloud"></i> '+s.feat4;
  var ft=document.querySelector('.login-page .brand-footer');
  if(ft&&s.footer)ft.textContent=s.footer;
  var cl=document.querySelector('.login-page .card-left');
  if(cl&&s.leftBg)cl.style.background='linear-gradient(135deg,'+s.leftBg+' 0%,#0f1a24 100%)';
  var bl=document.querySelector('.login-page .btn-login');
  if(bl&&s.btnBg)bl.style.background=s.btnBg;
}

function previewLogin(){
  saveLoginSettings();
  window.open(location.origin+'?preview=1','_blank');
}

function toggleSidebar(){
  var sb=document.getElementById('sidebar');
  var ov=document.getElementById('sidebarOverlay');
  var hb=document.querySelector('.hamburger');
  sb.classList.toggle('open');
  ov.classList.toggle('show');
  if(hb)hb.classList.toggle('open');
}
</script>
</body>
</html>`;
}
