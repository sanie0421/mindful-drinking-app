import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// ============================================================
// HTML レイアウト
// ============================================================

const layout = (title: string, content: string, activeNav?: string) => `
  <!doctype html>
  <html lang="ja">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title} | Mindful Drinking</title>
      <link rel="icon" type="image/png" href="/icon-32.png" sizes="32x32" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" href="/icon-180.png" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Mindful" />
      <meta name="theme-color" content="#1a1a24" />
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #0f0f13;
          --bg2: #1a1a24;
          --bg3: #22223a;
          --accent: #7c6af7;
          --accent2: #a78bfa;
          --gold: #f59e0b;
          --green: #10b981;
          --red: #ef4444;
          --text: #e2e8f0;
          --text2: #94a3b8;
          --border: #2d2d45;
          --radius: 12px;
          --radius-sm: 8px;
        }
        body {
          background: var(--bg);
          color: var(--text);
          font-family: -apple-system, BlinkMacSystemFont, 'Hiragino Sans', 'Noto Sans JP', sans-serif;
          min-height: 100vh;
          padding-bottom: 80px;
        }
        .header {
          background: var(--bg2);
          border-bottom: 1px solid var(--border);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .header h1 {
          font-size: 18px;
          font-weight: 700;
          background: linear-gradient(135deg, var(--accent2), var(--gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .header-logo { font-size: 24px; }
        .container { max-width: 640px; margin: 0 auto; padding: 20px 16px; }
        .nav {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          background: var(--bg2);
          border-top: 1px solid var(--border);
          display: flex;
          z-index: 100;
        }
        .nav a {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px 4px;
          color: var(--text2);
          text-decoration: none;
          font-size: 10px;
          gap: 4px;
          transition: color 0.2s;
        }
        .nav a .nav-icon { font-size: 20px; }
        .nav a.active { color: var(--accent2); }
        .card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 16px;
          margin-bottom: 12px;
        }
        .card-title {
          font-size: 12px;
          color: var(--text2);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 20px;
          border-radius: var(--radius-sm);
          border: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
        }
        .btn-primary {
          background: var(--accent);
          color: white;
        }
        .btn-primary:hover { background: var(--accent2); }
        .btn-success {
          background: var(--green);
          color: white;
        }
        .btn-danger {
          background: var(--red);
          color: white;
        }
        .btn-ghost {
          background: var(--bg3);
          color: var(--text);
          border: 1px solid var(--border);
        }
        .btn-ghost:hover { border-color: var(--accent); color: var(--accent2); }
        .btn-sm { padding: 6px 12px; font-size: 12px; }
        .btn-full { width: 100%; }
        input, select, textarea {
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--text);
          padding: 10px 14px;
          font-size: 14px;
          width: 100%;
          outline: none;
          transition: border-color 0.2s;
        }
        input:focus, select:focus, textarea:focus {
          border-color: var(--accent);
        }
        label {
          display: block;
          font-size: 13px;
          color: var(--text2);
          margin-bottom: 6px;
        }
        .form-group { margin-bottom: 14px; }
        .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 600;
        }
        .badge-drink { background: rgba(239,68,68,0.15); color: #fca5a5; }
        .badge-skip { background: rgba(16,185,129,0.15); color: #6ee7b7; }
        .amount-big {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, var(--accent2), var(--gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .amount-label { font-size: 12px; color: var(--text2); margin-top: 2px; }
        .progress-bar-wrap {
          background: var(--bg3);
          border-radius: 99px;
          height: 8px;
          overflow: hidden;
          margin: 8px 0;
        }
        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--accent), var(--accent2));
          border-radius: 99px;
          transition: width 0.3s;
        }
        .stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid var(--border);
        }
        .stat-row:last-child { border-bottom: none; }
        .stat-label { color: var(--text2); font-size: 13px; }
        .stat-value { font-weight: 700; font-size: 15px; }
        .stat-value.up { color: var(--red); }
        .stat-value.down { color: var(--green); }
        .user-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }
        .user-tab {
          flex: 1;
          padding: 12px;
          background: var(--bg2);
          border: 2px solid var(--border);
          border-radius: var(--radius);
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          color: var(--text);
        }
        .user-tab.active {
          border-color: var(--accent);
          background: rgba(124, 106, 247, 0.1);
        }
        .user-tab .tab-icon { font-size: 28px; margin-bottom: 4px; }
        .user-tab .tab-name { font-size: 13px; font-weight: 600; }
        .section-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .divider {
          border: none;
          border-top: 1px solid var(--border);
          margin: 16px 0;
        }
        .record-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
        }
        .record-item:last-child { border-bottom: none; }
        .record-icon { font-size: 24px; flex-shrink: 0; }
        .record-info { flex: 1; }
        .record-name { font-size: 14px; font-weight: 600; }
        .record-date { font-size: 11px; color: var(--text2); margin-top: 2px; }
        .record-amount { font-size: 15px; font-weight: 700; }
        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: var(--text2);
        }
        .empty-state .empty-icon { font-size: 48px; margin-bottom: 12px; }
        .flash {
          background: rgba(16,185,129,0.15);
          border: 1px solid rgba(16,185,129,0.3);
          color: #6ee7b7;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          margin-bottom: 16px;
          font-size: 14px;
        }
        .flash.error {
          background: rgba(239,68,68,0.1);
          border-color: rgba(239,68,68,0.3);
          color: #fca5a5;
        }
        select option { background: var(--bg3); }
        .period-tabs {
          display: flex;
          gap: 6px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .period-tab {
          padding: 6px 14px;
          border-radius: 99px;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          background: var(--bg3);
          color: var(--text2);
          border: 1px solid var(--border);
          transition: all 0.2s;
        }
        .period-tab.active {
          background: var(--accent);
          color: white;
          border-color: var(--accent);
        }
      </style>
    </head>
    <body>
      <a href="/" style="text-decoration:none;display:flex;align-items:center;gap:10px" class="header">
        <span class="header-logo">🍃</span>
        <h1>Mindful Drinking</h1>
      </a>
      <div class="container">
        ${content}
      </div>
      <nav class="nav">
        <a href="/" class="${activeNav === "home" ? "active" : ""}">
          <span class="nav-icon">🏠</span>記録
        </a>
        <a href="/calendar" class="${activeNav === "calendar" ? "active" : ""}">
          <span class="nav-icon">📅</span>カレンダー
        </a>
        <a href="/stats" class="${activeNav === "stats" ? "active" : ""}">
          <span class="nav-icon">📊</span>統計
        </a>
        <a href="/goals" class="${activeNav === "goals" ? "active" : ""}">
          <span class="nav-icon">🎯</span>目標
        </a>
        <a href="/products" class="${activeNav === "products" ? "active" : ""}">
          <span class="nav-icon">🍺</span>商品
        </a>
        <a href="/settings" class="${activeNav === "settings" ? "active" : ""}">
          <span class="nav-icon">⚙️</span>設定
        </a>
      </nav>
    </body>
  </html>
`;

// ============================================================
// ホーム（記録画面）
// ============================================================

app.get("/", async (c) => {
  const db = c.env.DB;
  const userId = c.req.query("user") || "1";

  const users = await db.prepare("SELECT * FROM users ORDER BY id").all<{
    id: number; name: string; icon: string;
  }>();

  const products = await db.prepare(
    "SELECT * FROM products ORDER BY name"
  ).all<{ id: number; name: string; price: number; alcohol_percent: number; volume_ml: number; category: string }>();

  const recentRecords = await db.prepare(`
    SELECT r.*, p.name as product_name, u.name as user_name, u.icon as user_icon
    FROM records r
    LEFT JOIN products p ON r.product_id = p.id
    LEFT JOIN users u ON r.user_id = u.id
    ORDER BY r.record_date DESC, r.created_at DESC
    LIMIT 10
  `).all<{
    id: number; user_id: number; record_date: string; type: string;
    product_name: string | null; custom_name: string | null;
    price: number; alcohol_ml: number; note: string | null;
    user_name: string; user_icon: string;
  }>();

  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });

  const userTabs = (users.results || []).map(u => `
    <a href="/?user=${u.id}" class="user-tab ${userId == String(u.id) ? "active" : ""}">
      <div class="tab-icon">${u.icon}</div>
      <div class="tab-name">${u.name}</div>
    </a>
  `).join("");

  const productOptions = (products.results || []).map(p =>
    `<option value="${p.id}" data-price="${p.price}" data-alcohol="${(p.alcohol_percent / 100 * p.volume_ml).toFixed(1)}">${p.name}（¥${p.price}）</option>`
  ).join("");

  const recordItems = (recentRecords.results || []).map(r => {
    const name = r.product_name || r.custom_name || "手動入力";
    const icon = r.type === "drink" ? "🍺" : "✨";
    const badge = r.type === "drink"
      ? `<span class="badge badge-drink">飲んだ</span>`
      : `<span class="badge badge-skip">節約</span>`;
    const amount = r.type === "drink"
      ? `<span class="record-amount" style="color:var(--red)">-¥${r.price}</span>`
      : `<span class="record-amount" style="color:var(--green)">+¥${r.price}</span>`;
    return `
      <div class="record-item">
        <div class="record-icon">${r.user_icon}</div>
        <div class="record-info">
          <div class="record-name">${r.user_name} · ${name} ${badge}</div>
          <div class="record-date">${r.record_date}</div>
        </div>
        ${amount}
      </div>
    `;
  }).join("") || `<div class="empty-state"><div class="empty-icon">📝</div><div>まだ記録がありません</div></div>`;

  const currentUser = (users.results || []).find(u => String(u.id) === userId);

  const content = `
    <div class="user-tabs">${userTabs}</div>

    <div class="card">
      <div class="card-title">📝 記録 — ${currentUser?.name || ""}${currentUser?.icon || ""}</div>
      <form method="POST" action="/record" id="record-form">
        <input type="hidden" name="user_id" value="${userId}" />
        <div class="form-group">
          <label>日付</label>
          <input type="date" name="record_date" value="${today}" max="${today}" required />
        </div>

        <div class="form-group">
          <label>記録タイプ</label>
          <div class="grid2">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;background:var(--bg3);border:2px solid var(--border);border-radius:var(--radius-sm);padding:12px;transition:border-color 0.2s;" id="label-drink">
              <input type="radio" name="type" value="drink" onchange="toggleType(this)" style="width:auto" checked />
              🍺 飲んだ
            </label>
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;background:var(--bg3);border:2px solid var(--border);border-radius:var(--radius-sm);padding:12px;transition:border-color 0.2s;" id="label-skip">
              <input type="radio" name="type" value="skip" onchange="toggleType(this)" style="width:auto" />
              ✨ 飲まなかった
            </label>
          </div>
        </div>

        <div id="drink-section">
          <div class="grid2">
            <div class="form-group">
              <label>商品を選ぶ</label>
              <select name="product_id" id="product-select" onchange="onProductSelect(this)">
                <option value="">-- 選択または手動入力 --</option>
                ${productOptions}
              </select>
            </div>
            <div class="form-group">
              <label>数量</label>
              <select name="quantity" id="quantity-select" onchange="recalculate()">
                <option value="0.5">0.5本</option>
                <option value="1" selected>1本</option>
                <option value="1.5">1.5本</option>
                <option value="2">2本</option>
                <option value="3">3本</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>商品名（手動）</label>
            <input type="text" name="custom_name" id="custom-name" placeholder="例: 生ビール（居酒屋）" />
          </div>
          <div class="grid2">
            <div class="form-group">
              <label>金額（円）</label>
              <input type="number" name="price" id="price-input" placeholder="例: 351" min="0" required />
            </div>
            <div class="form-group">
              <label>アルコール量（ml）</label>
              <input type="number" name="alcohol_ml" id="alcohol-input" placeholder="例: 17.6" step="0.1" min="0" />
            </div>
          </div>
        </div>

        <div id="skip-section" style="display:none">
          <div class="form-group">
            <label>節約金額（円）— 飲まなかった分</label>
            <select name="skip_product_id" id="skip-product-select" onchange="onSkipProductSelect(this)">
              <option value="">-- 商品を選んで自動入力 --</option>
              ${productOptions}
            </select>
          </div>
          <div class="form-group">
            <input type="number" name="skip_price" id="skip-price-input" placeholder="金額（円）" min="0" />
          </div>
        </div>

        <div class="form-group">
          <label>メモ（任意）</label>
          <input type="text" name="note" placeholder="例: 仕事帰りに我慢した！" />
        </div>

        <button type="submit" class="btn btn-primary btn-full">記録する</button>
      </form>
    </div>

    <div class="card">
      <div class="card-title">📋 最近の記録（全員）</div>
      ${recordItems}
    </div>

    <script>
      function toggleType(radio) {
        const isDrink = radio.value === 'drink';
        document.getElementById('drink-section').style.display = isDrink ? 'block' : 'none';
        document.getElementById('skip-section').style.display = isDrink ? 'none' : 'block';
        const labelDrink = document.getElementById('label-drink');
        const labelSkip = document.getElementById('label-skip');
        labelDrink.style.borderColor = isDrink ? 'var(--accent)' : 'var(--border)';
        labelSkip.style.borderColor = !isDrink ? 'var(--green)' : 'var(--border)';
      }
      function onProductSelect(sel) {
        const opt = sel.options[sel.selectedIndex];
        if (opt.value) {
          document.getElementById('custom-name').value = '';
          recalculate();
        }
      }
      function recalculate() {
        const sel = document.getElementById('product-select');
        const opt = sel.options[sel.selectedIndex];
        if (!opt.value) return;
        const qty = parseFloat(document.getElementById('quantity-select').value) || 1;
        document.getElementById('price-input').value = Math.round(parseFloat(opt.dataset.price) * qty);
        document.getElementById('alcohol-input').value = (parseFloat(opt.dataset.alcohol) * qty).toFixed(1);
      }
      function onSkipProductSelect(sel) {
        const opt = sel.options[sel.selectedIndex];
        if (opt.value) {
          document.getElementById('skip-price-input').value = opt.dataset.price;
        }
      }
      // 初期スタイル
      document.getElementById('label-drink').style.borderColor = 'var(--accent)';
    </script>
  `;

  return c.html(layout("ホーム", content, "home"));
});

// ============================================================
// 記録 POST
// ============================================================

app.post("/record", async (c) => {
  const db = c.env.DB;
  const form = await c.req.formData();
  const userId = form.get("user_id") as string;
  const recordDate = form.get("record_date") as string;
  const type = form.get("type") as string;
  const note = form.get("note") as string || null;

  if (type === "drink") {
    const productId = form.get("product_id") as string || null;
    const customName = form.get("custom_name") as string || null;
    const price = parseInt(form.get("price") as string) || 0;
    const alcoholMl = parseFloat(form.get("alcohol_ml") as string) || 0;

    await db.prepare(`
      INSERT INTO records (user_id, record_date, type, product_id, custom_name, price, alcohol_ml, note)
      VALUES (?, ?, 'drink', ?, ?, ?, ?, ?)
    `).bind(userId, recordDate, productId || null, customName || null, price, alcoholMl, note).run();
  } else {
    const price = parseInt(form.get("skip_price") as string) || 0;
    await db.prepare(`
      INSERT INTO records (user_id, record_date, type, price, alcohol_ml, note)
      VALUES (?, ?, 'skip', ?, 0, ?)
    `).bind(userId, recordDate, price, note).run();
  }

  return c.redirect(`/?user=${userId}`);
});

// ============================================================
// 商品マスター
// ============================================================

app.get("/products", async (c) => {
  const db = c.env.DB;
  const msg = c.req.query("msg");

  const products = await db.prepare(
    "SELECT * FROM products ORDER BY category, name"
  ).all<{ id: number; name: string; price: number; alcohol_percent: number; volume_ml: number; category: string; icon: string }>();

  const categories = ["ビール", "チューハイ", "ワイン", "日本酒", "焼酎", "ウイスキー", "その他"];
  const iconOptions = ["🍺","🍻","🍷","🥂","🍸","🍹","🥃","🍶","🫗","🧃"].map(e =>
    `<option value="${e}">${e}</option>`
  ).join("");

  const productList = (products.results || []).map(p => {
    const alcoholMl = (p.alcohol_percent / 100 * p.volume_ml).toFixed(1);
    const catOptions = categories.map(cat =>
      `<option value="${cat}" ${cat === p.category ? "selected" : ""}>${cat}</option>`
    ).join("");
    const iconOpts = ["🍺","🍻","🍷","🥂","🍸","🍹","🥃","🍶","🫗","🧃"].map(e =>
      `<option value="${e}" ${e === p.icon ? "selected" : ""}>${e}</option>`
    ).join("");
    return `
      <div style="border-bottom:1px solid var(--border);padding-bottom:12px;margin-bottom:12px">
        <div class="record-item" style="border-bottom:none;padding-bottom:0;margin-bottom:0">
          <div class="record-icon">${p.icon || "🍺"}</div>
          <div class="record-info">
            <div class="record-name">${p.name}</div>
            <div class="record-date">${p.category} · ${p.volume_ml}ml · ${p.alcohol_percent}% · アルコール${alcoholMl}ml</div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
            <span style="font-weight:700">¥${p.price}</span>
            <div style="display:flex;gap:6px">
              <button type="button" class="btn btn-ghost btn-sm" onclick="toggleEdit(${p.id})">編集</button>
              <form method="POST" action="/products/delete" onsubmit="return confirm('削除しますか？')" style="margin:0">
                <input type="hidden" name="id" value="${p.id}" />
                <button type="submit" class="btn btn-danger btn-sm">削除</button>
              </form>
            </div>
          </div>
        </div>
        <div id="edit-${p.id}" style="display:none;margin-top:12px;padding-top:12px;border-top:1px solid var(--border)">
          <form method="POST" action="/products/edit">
            <input type="hidden" name="id" value="${p.id}" />
            <div class="grid2">
              <div class="form-group">
                <label>商品名</label>
                <input type="text" name="name" value="${p.name}" required />
              </div>
              <div class="form-group">
                <label>アイコン</label>
                <select name="icon">${iconOpts}</select>
              </div>
            </div>
            <div class="grid2">
              <div class="form-group">
                <label>金額（円）</label>
                <input type="number" name="price" value="${p.price}" min="0" required />
              </div>
              <div class="form-group">
                <label>カテゴリ</label>
                <select name="category">${catOptions}</select>
              </div>
            </div>
            <div class="grid2">
              <div class="form-group">
                <label>容量（ml）</label>
                <input type="number" name="volume_ml" value="${p.volume_ml}" min="1" required />
              </div>
              <div class="form-group">
                <label>度数（%）</label>
                <input type="number" name="alcohol_percent" value="${p.alcohol_percent}" step="0.1" min="0" max="100" required />
              </div>
            </div>
            <div style="display:flex;gap:8px">
              <button type="submit" class="btn btn-primary" style="flex:1">保存</button>
              <button type="button" class="btn btn-ghost" onclick="toggleEdit(${p.id})">キャンセル</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }).join("") || `<div class="empty-state"><div class="empty-icon">🍺</div><div>商品が登録されていません</div></div>`;

  const categoryOptions = categories.map(c => `<option value="${c}">${c}</option>`).join("");

  const content = `
    ${msg ? `<div class="flash">✅ ${msg}</div>` : ""}

    <div class="card">
      <div class="section-title">➕ 商品を追加</div>
      <form method="POST" action="/products/add">
        <div class="grid2">
          <div class="form-group">
            <label>商品名</label>
            <input type="text" name="name" placeholder="例: スーパードライ 350ml缶" required />
          </div>
          <div class="form-group">
            <label>アイコン</label>
            <select name="icon">${iconOptions}</select>
          </div>
        </div>
        <div class="grid2">
          <div class="form-group">
            <label>金額（円）</label>
            <input type="number" name="price" placeholder="351" min="0" required />
          </div>
          <div class="form-group">
            <label>カテゴリ</label>
            <select name="category">${categoryOptions}</select>
          </div>
        </div>
        <div class="grid2">
          <div class="form-group">
            <label>容量（ml）</label>
            <input type="number" name="volume_ml" placeholder="350" min="1" required />
          </div>
          <div class="form-group">
            <label>アルコール度数（%）</label>
            <input type="number" name="alcohol_percent" placeholder="5.0" step="0.1" min="0" max="100" required />
          </div>
        </div>
        <button type="submit" class="btn btn-primary btn-full">追加する</button>
      </form>
    </div>

    <div class="card">
      <div class="section-title">📦 登録済み商品</div>
      ${productList}
    </div>
    <script>
      function toggleEdit(id) {
        const el = document.getElementById('edit-' + id);
        el.style.display = el.style.display === 'none' ? 'block' : 'none';
      }
    </script>
  `;

  return c.html(layout("商品マスター", content, "products"));
});

app.post("/products/add", async (c) => {
  const db = c.env.DB;
  const form = await c.req.formData();
  await db.prepare(`
    INSERT INTO products (name, price, alcohol_percent, volume_ml, category, icon)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    form.get("name"),
    parseInt(form.get("price") as string),
    parseFloat(form.get("alcohol_percent") as string),
    parseInt(form.get("volume_ml") as string),
    form.get("category"),
    form.get("icon") || "🍺"
  ).run();
  return c.redirect("/products?msg=商品を追加しました");
});

app.post("/products/edit", async (c) => {
  const db = c.env.DB;
  const form = await c.req.formData();
  await db.prepare(`
    UPDATE products SET name=?, price=?, alcohol_percent=?, volume_ml=?, category=?, icon=? WHERE id=?
  `).bind(
    form.get("name"),
    parseInt(form.get("price") as string),
    parseFloat(form.get("alcohol_percent") as string),
    parseInt(form.get("volume_ml") as string),
    form.get("category"),
    form.get("icon") || "🍺",
    form.get("id")
  ).run();
  return c.redirect("/products?msg=商品を更新しました");
});

app.post("/products/delete", async (c) => {
  const db = c.env.DB;
  const form = await c.req.formData();
  await db.prepare("DELETE FROM products WHERE id = ?").bind(form.get("id")).run();
  return c.redirect("/products?msg=商品を削除しました");
});

// ============================================================
// カレンダー画面
// ============================================================

app.get("/calendar", async (c) => {
  const db = c.env.DB;
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const monthParam = c.req.query("month") || now.toLocaleDateString("sv-SE").slice(0, 7);
  const [year, month] = monthParam.split("-").map(Number);

  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const startStr = `${year}-${String(month).padStart(2, "0")}-01`;
  const endStr = lastDay.toLocaleDateString("sv-SE");

  const [records, users] = await Promise.all([
    db.prepare(`
      SELECT r.record_date, r.type, r.price, u.name, u.icon
      FROM records r
      JOIN users u ON r.user_id = u.id
      WHERE r.record_date BETWEEN ? AND ?
      ORDER BY r.record_date, u.id
    `).bind(startStr, endStr).all<{ record_date: string; type: string; price: number; name: string; icon: string }>(),
    db.prepare("SELECT * FROM users ORDER BY id").all<{ id: number; name: string; icon: string }>()
  ]);

  // 日付→記録のマップを作成
  const dayMap: Record<string, { drink: number; skip: number; cost: number; icons: string[] }> = {};
  for (const r of records.results || []) {
    if (!dayMap[r.record_date]) dayMap[r.record_date] = { drink: 0, skip: 0, cost: 0, icons: [] };
    if (r.type === "drink") { dayMap[r.record_date].drink++; dayMap[r.record_date].cost += r.price; }
    else dayMap[r.record_date].skip++;
    if (!dayMap[r.record_date].icons.includes(r.icon)) dayMap[r.record_date].icons.push(r.icon);
  }

  // 月の統計
  const monthDrinkCost = Object.values(dayMap).reduce((s, d) => s + d.cost, 0);
  const monthSkipDays = Object.values(dayMap).filter(d => d.skip > 0 && d.drink === 0).length;
  const monthDrinkDays = Object.values(dayMap).filter(d => d.drink > 0).length;

  // 前月・翌月
  const prevMonth = new Date(year, month - 2, 1);
  const nextMonth = new Date(year, month, 1);
  const prevStr = prevMonth.toLocaleDateString("sv-SE").slice(0, 7);
  const nextStr = nextMonth.toLocaleDateString("sv-SE").slice(0, 7);
  const today = now.toLocaleDateString("sv-SE");
  const isCurrentMonth = monthParam === today.slice(0, 7);

  // カレンダーグリッド生成
  const startDow = (firstDay.getDay() + 6) % 7; // 月曜始まり
  const totalDays = lastDay.getDate();
  const weeks: string[][] = [];
  let week: string[] = Array(startDow).fill("");
  for (let d = 1; d <= totalDays; d++) {
    week.push(String(d).padStart(2, "0"));
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length) { while (week.length < 7) week.push(""); weeks.push(week); }

  const dowLabels = ["月","火","水","木","金","土","日"].map((l, i) =>
    `<div style="text-align:center;font-size:11px;color:${i >= 5 ? "var(--accent2)" : "var(--text2)"};font-weight:600;padding:4px 0">${l}</div>`
  ).join("");

  const cells = weeks.map(week =>
    week.map(d => {
      if (!d) return `<div></div>`;
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${d}`;
      const rec = dayMap[dateStr];
      const isToday = dateStr === today;
      const dow = new Date(year, month - 1, parseInt(d)).getDay();
      const isWeekend = dow === 0 || dow === 6;
      const isFuture = dateStr > today;

      let bg = "transparent";
      let indicator = "";
      if (rec) {
        if (rec.drink > 0 && rec.skip === 0) { bg = "rgba(239,68,68,0.12)"; indicator = `<div style="font-size:10px;color:var(--red);font-weight:600">¥${rec.cost.toLocaleString()}</div>`; }
        else if (rec.skip > 0 && rec.drink === 0) { bg = "rgba(16,185,129,0.12)"; indicator = `<div style="font-size:10px;color:var(--green);font-weight:600">節約</div>`; }
        else if (rec.drink > 0 && rec.skip > 0) { bg = "rgba(245,158,11,0.12)"; indicator = `<div style="font-size:10px;color:var(--gold);font-weight:600">複合</div>`; }
      }

      return `
        <div style="background:${bg};border-radius:8px;padding:4px;min-height:52px;${isToday ? "border:1.5px solid var(--accent);" : ""}cursor:pointer;opacity:${isFuture ? "0.3" : "1"}"
             onclick="${isFuture ? "" : `showDay('${dateStr}')`}">
          <div style="font-size:13px;font-weight:${isToday ? "800" : "600"};color:${isWeekend ? "var(--accent2)" : "var(--text)"};margin-bottom:2px">${parseInt(d)}</div>
          ${rec ? `<div style="font-size:16px;line-height:1">${rec.icons.join("")}</div>` : ""}
          ${indicator}
        </div>
      `;
    }).join("")
  ).map(row => `<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px">${row}</div>`).join("");

  // 日別詳細用データ（JSON）
  const dayDataJson = JSON.stringify(dayMap);

  // 凡例
  const legend = `
    <div style="display:flex;gap:12px;flex-wrap:wrap;font-size:11px;margin-top:12px">
      <span style="display:flex;align-items:center;gap:4px"><span style="width:12px;height:12px;background:rgba(239,68,68,0.25);border-radius:3px;display:inline-block"></span>飲んだ</span>
      <span style="display:flex;align-items:center;gap:4px"><span style="width:12px;height:12px;background:rgba(16,185,129,0.25);border-radius:3px;display:inline-block"></span>飲まなかった</span>
      <span style="display:flex;align-items:center;gap:4px"><span style="width:12px;height:12px;background:rgba(245,158,11,0.25);border-radius:3px;display:inline-block"></span>両方あり</span>
    </div>
  `;

  const content = `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <a href="/calendar?month=${prevStr}" class="btn btn-ghost btn-sm">‹ 前月</a>
        <div style="font-size:17px;font-weight:700">${year}年${month}月</div>
        <a href="/calendar?month=${nextStr}" class="btn btn-ghost btn-sm" ${isCurrentMonth ? "style='opacity:0.3;pointer-events:none'" : ""}>翌月 ›</a>
      </div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin-bottom:4px">${dowLabels}</div>
      ${cells}
      ${legend}
    </div>

    <div class="card">
      <div class="card-title">📊 ${month}月のサマリー</div>
      <div class="stat-row">
        <span class="stat-label">飲んだ日</span>
        <span class="stat-value" style="color:var(--red)">${monthDrinkDays}日</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">飲まなかった日</span>
        <span class="stat-value" style="color:var(--green)">${monthSkipDays}日</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">飲酒費用合計</span>
        <span class="stat-value">¥${monthDrinkCost.toLocaleString()}</span>
      </div>
    </div>

    <div id="day-detail" style="display:none" class="card">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div id="day-detail-title" style="font-weight:700;font-size:15px"></div>
        <button onclick="document.getElementById('day-detail').style.display='none'" class="btn btn-ghost btn-sm">閉じる</button>
      </div>
      <div id="day-detail-body" style="margin-top:8px"></div>
    </div>

    <script>
      const dayData = ${dayDataJson};
      const userList = ${JSON.stringify((users.results || []).map(u => ({ name: u.name, icon: u.icon })))};
      const allRecords = ${JSON.stringify(records.results || [])};

      function showDay(date) {
        const detail = document.getElementById('day-detail');
        const title = document.getElementById('day-detail-title');
        const body = document.getElementById('day-detail-body');
        const recs = allRecords.filter(r => r.record_date === date);
        if (!recs.length) return;
        title.textContent = date;
        body.innerHTML = recs.map(r => {
          const badge = r.type === 'drink'
            ? '<span class="badge badge-drink">飲んだ</span>'
            : '<span class="badge badge-skip">節約</span>';
          const amt = r.type === 'drink'
            ? '<span style="color:var(--red);font-weight:700">-¥' + r.price.toLocaleString() + '</span>'
            : '<span style="color:var(--green);font-weight:700">+¥' + r.price.toLocaleString() + '</span>';
          return '<div class="stat-row"><span>' + r.icon + ' ' + r.name + ' ' + badge + '</span>' + amt + '</div>';
        }).join('');
        detail.style.display = 'block';
        detail.scrollIntoView({ behavior: 'smooth' });
      }
    </script>
  `;

  return c.html(layout(`${year}年${month}月`, content, "calendar"));
});

// ============================================================
// 統計画面
// ============================================================

app.get("/stats", async (c) => {
  const db = c.env.DB;
  const period = c.req.query("period") || "week";

  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const today = now.toLocaleDateString("sv-SE");

  let currentStart: string, currentEnd: string, prevStart: string, prevEnd: string, periodLabel: string;

  if (period === "week") {
    const dow = now.getDay();
    const monday = new Date(now); monday.setDate(now.getDate() - ((dow + 6) % 7));
    const prevMonday = new Date(monday); prevMonday.setDate(monday.getDate() - 7);
    const prevSunday = new Date(monday); prevSunday.setDate(monday.getDate() - 1);
    currentStart = monday.toLocaleDateString("sv-SE");
    currentEnd = today;
    prevStart = prevMonday.toLocaleDateString("sv-SE");
    prevEnd = prevSunday.toLocaleDateString("sv-SE");
    periodLabel = "今週";
  } else if (period === "month") {
    currentStart = `${today.slice(0, 7)}-01`;
    currentEnd = today;
    const pm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    prevStart = pm.toLocaleDateString("sv-SE");
    prevEnd = new Date(now.getFullYear(), now.getMonth(), 0).toLocaleDateString("sv-SE");
    periodLabel = "今月";
  } else if (period === "half") {
    const month = now.getMonth() + 1;
    const isFirstHalf = month <= 6;
    currentStart = isFirstHalf ? `${now.getFullYear()}-01-01` : `${now.getFullYear()}-07-01`;
    currentEnd = today;
    prevStart = isFirstHalf ? `${now.getFullYear() - 1}-07-01` : `${now.getFullYear()}-01-01`;
    prevEnd = isFirstHalf ? `${now.getFullYear() - 1}-12-31` : `${now.getFullYear()}-06-30`;
    periodLabel = isFirstHalf ? `${now.getFullYear()}年 上半期` : `${now.getFullYear()}年 下半期`;
  } else {
    currentStart = `${now.getFullYear()}-01-01`;
    currentEnd = today;
    prevStart = `${now.getFullYear() - 1}-01-01`;
    prevEnd = `${now.getFullYear() - 1}-12-31`;
    periodLabel = `${now.getFullYear()}年`;
  }

  // 期間の日数を計算（半期はフル半期日数、年間はフル年日数で理論値を算出）
  const msPerDay = 86400000;
  let daysInPeriod: number;
  if (period === "half") {
    const month = now.getMonth() + 1;
    const isFirstHalf = month <= 6;
    const halfEnd = isFirstHalf
      ? new Date(now.getFullYear(), 5, 30)  // 6/30
      : new Date(now.getFullYear(), 11, 31); // 12/31
    const halfStart = new Date(currentStart);
    daysInPeriod = Math.round((halfEnd.getTime() - halfStart.getTime()) / msPerDay) + 1;
  } else if (period === "year") {
    const isLeap = new Date(now.getFullYear(), 1, 29).getMonth() === 1;
    daysInPeriod = isLeap ? 366 : 365;
  } else {
    daysInPeriod = Math.round(
      (new Date(currentEnd).getTime() - new Date(currentStart).getTime()) / msPerDay
    ) + 1;
  }

  const [currentStats, prevStats, budgetSetting] = await Promise.all([
    db.prepare(`
      SELECT
        u.id, u.name, u.icon,
        SUM(CASE WHEN r.type='drink' THEN r.price ELSE 0 END) as drink_cost,
        SUM(CASE WHEN r.type='skip' THEN r.price ELSE 0 END) as saved_cost,
        SUM(CASE WHEN r.type='drink' THEN r.alcohol_ml ELSE 0 END) as total_alcohol,
        COUNT(CASE WHEN r.type='drink' THEN 1 END) as drink_days,
        COUNT(CASE WHEN r.type='skip' THEN 1 END) as skip_days
      FROM users u
      LEFT JOIN records r ON u.id = r.user_id AND r.record_date BETWEEN ? AND ?
      GROUP BY u.id
    `).bind(currentStart, currentEnd).all<{
      id: number; name: string; icon: string;
      drink_cost: number; saved_cost: number; total_alcohol: number;
      drink_days: number; skip_days: number;
    }>(),
    db.prepare(`
      SELECT
        SUM(CASE WHEN type='drink' THEN price ELSE 0 END) as drink_cost,
        SUM(CASE WHEN type='skip' THEN price ELSE 0 END) as saved_cost,
        SUM(CASE WHEN type='drink' THEN alcohol_ml ELSE 0 END) as total_alcohol
      FROM records
      WHERE record_date BETWEEN ? AND ?
    `).bind(prevStart, prevEnd).first<{
      drink_cost: number; saved_cost: number; total_alcohol: number;
    }>(),
    db.prepare("SELECT value FROM settings WHERE key = 'daily_budget'").first<{ value: string }>()
  ]);

  const dailyBudget = parseInt(budgetSetting?.value || "0");
  const theoretical = dailyBudget * daysInPeriod;

  const periodTabs = [
    ["week", "週次"],
    ["month", "月次"],
    ["half", "半期"],
    ["year", "年間"],
  ].map(([p, label]) =>
    `<a href="/stats?period=${p}" class="period-tab ${period === p ? "active" : ""}">${label}</a>`
  ).join("");

  const totalDrinkCost = (currentStats.results || []).reduce((s, u) => s + (u.drink_cost || 0), 0);
  const totalSaved = (currentStats.results || []).reduce((s, u) => s + (u.saved_cost || 0), 0);
  const totalAlcohol = (currentStats.results || []).reduce((s, u) => s + (u.total_alcohol || 0), 0);
  const prevDrinkCost = prevStats?.drink_cost || 0;
  const prevAlcohol = prevStats?.total_alcohol || 0;

  const diffCost = totalDrinkCost - prevDrinkCost;
  const diffAlcohol = totalAlcohol - prevAlcohol;
  const theoreticalSaving = theoretical - totalDrinkCost;
  const reductionPct = theoretical > 0 ? Math.round((theoreticalSaving / theoretical) * 100) : 0;

  const userCards = (currentStats.results || []).map(u => `
    <div class="card">
      <div class="card-title">${u.icon} ${u.name}</div>
      <div class="stat-row">
        <span class="stat-label">飲酒費用</span>
        <span class="stat-value">¥${(u.drink_cost || 0).toLocaleString()}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">節約額（記録ベース）</span>
        <span class="stat-value" style="color:var(--green)">¥${(u.saved_cost || 0).toLocaleString()}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">アルコール摂取量</span>
        <span class="stat-value">${(u.total_alcohol || 0).toFixed(1)}ml</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">飲んだ日 / 飲まなかった日</span>
        <span class="stat-value">${u.drink_days}日 / <span style="color:var(--green)">${u.skip_days}日</span></span>
      </div>
    </div>
  `).join("");

  const theoreticalCard = theoretical > 0 ? `
    <div class="card" style="border-color:rgba(245,158,11,0.3)">
      <div class="card-title">📐 理論値との比較（${currentStart} 〜 ${currentEnd}・${daysInPeriod}日間）</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px;text-align:center">
        <div>
          <div style="font-size:11px;color:var(--text2);margin-bottom:4px">毎日飲んだ場合</div>
          <div style="font-size:22px;font-weight:800;color:var(--red)">¥${theoretical.toLocaleString()}</div>
          <div style="font-size:11px;color:var(--text2)">¥${dailyBudget.toLocaleString()}/日 × ${daysInPeriod}日</div>
        </div>
        <div>
          <div style="font-size:11px;color:var(--text2);margin-bottom:4px">実際の飲酒費用</div>
          <div style="font-size:22px;font-weight:800">¥${totalDrinkCost.toLocaleString()}</div>
        </div>
        <div>
          <div style="font-size:11px;color:var(--text2);margin-bottom:4px">節約できた額</div>
          <div style="font-size:22px;font-weight:800;color:var(--green)">¥${theoreticalSaving.toLocaleString()}</div>
          <div style="font-size:11px;color:var(--green)">${reductionPct}% 削減</div>
        </div>
      </div>
      <div class="progress-bar-wrap" style="height:12px">
        <div class="progress-bar" style="width:${Math.min(100, reductionPct)}%;background:linear-gradient(90deg,var(--green),#34d399)"></div>
      </div>
    </div>
  ` : `<div class="card"><div style="color:var(--text2);font-size:13px">⚙️ 設定画面で「1日の想定飲酒額」を設定すると理論値比較が表示されます</div></div>`;

  const content = `
    <div class="period-tabs">${periodTabs}</div>

    ${theoreticalCard}

    <div class="card">
      <div class="card-title">🏠 ${periodLabel}・2人合計（実績）</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
        <div>
          <div class="amount-big">¥${totalDrinkCost.toLocaleString()}</div>
          <div class="amount-label">飲酒費用</div>
        </div>
        <div>
          <div class="amount-big" style="background:linear-gradient(135deg,var(--green),#34d399);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">¥${totalSaved.toLocaleString()}</div>
          <div class="amount-label">節約累計</div>
        </div>
      </div>
      <hr class="divider" />
      <div class="stat-row">
        <span class="stat-label">前期比 飲酒費用</span>
        <span class="stat-value ${diffCost > 0 ? "up" : "down"}">${diffCost > 0 ? "+" : ""}¥${diffCost.toLocaleString()}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">前期比 アルコール量</span>
        <span class="stat-value ${diffAlcohol > 0 ? "up" : "down"}">${diffAlcohol > 0 ? "+" : ""}${diffAlcohol.toFixed(1)}ml</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">前期 飲酒費用</span>
        <span class="stat-value" style="color:var(--text2)">¥${prevDrinkCost.toLocaleString()}</span>
      </div>
    </div>

    ${userCards}
  `;

  return c.html(layout("統計", content, "stats"));
});

// ============================================================
// 目標画面
// ============================================================

app.get("/goals", async (c) => {
  const db = c.env.DB;
  const msg = c.req.query("msg");

  const goals = await db.prepare("SELECT * FROM goals WHERE is_active = 1 ORDER BY target_date ASC").all<{
    id: number; title: string; target_amount: number; target_date: string;
  }>();

  const totalSaved = await db.prepare(`
    SELECT SUM(price) as total FROM records WHERE type = 'skip'
  `).first<{ total: number }>();

  const saved = totalSaved?.total || 0;

  const goalCards = (goals.results || []).map(g => {
    const pct = Math.min(100, Math.round((saved / g.target_amount) * 100));
    const remaining = Math.max(0, g.target_amount - saved);
    const daysLeft = Math.ceil((new Date(g.target_date).getTime() - Date.now()) / 86400000);
    return `
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
          <div>
            <div style="font-size:16px;font-weight:700">🎯 ${g.title}</div>
            <div style="font-size:12px;color:var(--text2);margin-top:2px">${g.target_date} まで（残り${daysLeft}日）</div>
          </div>
          <form method="POST" action="/goals/delete">
            <input type="hidden" name="id" value="${g.id}" />
            <button type="submit" class="btn btn-ghost btn-sm">完了</button>
          </form>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
          <span style="font-size:13px;color:var(--text2)">¥${saved.toLocaleString()} / ¥${g.target_amount.toLocaleString()}</span>
          <span style="font-size:14px;font-weight:700;color:var(--accent2)">${pct}%</span>
        </div>
        <div class="progress-bar-wrap">
          <div class="progress-bar" style="width:${pct}%"></div>
        </div>
        <div style="font-size:12px;color:var(--text2);margin-top:6px">あと ¥${remaining.toLocaleString()} 節約で達成 🎉</div>
      </div>
    `;
  }).join("") || `<div class="empty-state"><div class="empty-icon">🎯</div><div>目標を設定しましょう</div></div>`;

  const content = `
    ${msg ? `<div class="flash">✅ ${msg}</div>` : ""}

    <div class="card">
      <div class="section-title">💰 節約累計</div>
      <div class="amount-big">¥${saved.toLocaleString()}</div>
      <div class="amount-label">「飲まなかった日」の節約合計</div>
    </div>

    ${goalCards}

    <div class="card">
      <div class="section-title">➕ 新しい目標を追加</div>
      <form method="POST" action="/goals/add">
        <div class="form-group">
          <label>目標タイトル</label>
          <input type="text" name="title" placeholder="例: 夏の家族旅行" required />
        </div>
        <div class="form-group">
          <label>目標金額（円）</label>
          <input type="number" name="target_amount" placeholder="例: 100000" min="1" required />
        </div>
        <div class="form-group">
          <label>目標日</label>
          <input type="date" name="target_date" required />
        </div>
        <button type="submit" class="btn btn-primary btn-full">目標を設定する</button>
      </form>
    </div>
  `;

  return c.html(layout("目標", content, "goals"));
});

app.post("/goals/add", async (c) => {
  const db = c.env.DB;
  const form = await c.req.formData();
  await db.prepare(`
    INSERT INTO goals (title, target_amount, target_date)
    VALUES (?, ?, ?)
  `).bind(form.get("title"), parseInt(form.get("target_amount") as string), form.get("target_date")).run();
  return c.redirect("/goals?msg=目標を設定しました");
});

app.post("/goals/delete", async (c) => {
  const db = c.env.DB;
  const form = await c.req.formData();
  await db.prepare("UPDATE goals SET is_active = 0 WHERE id = ?").bind(form.get("id")).run();
  return c.redirect("/goals?msg=目標を達成済みにしました");
});

// ============================================================
// 設定画面
// ============================================================

app.get("/settings", async (c) => {
  const db = c.env.DB;
  const msg = c.req.query("msg");

  const [users, budgetSetting, products] = await Promise.all([
    db.prepare("SELECT * FROM users ORDER BY id").all<{ id: number; name: string; icon: string }>(),
    db.prepare("SELECT value FROM settings WHERE key = 'daily_budget'").first<{ value: string }>(),
    db.prepare("SELECT * FROM products ORDER BY category, name").all<{ id: number; name: string; price: number; icon: string }>()
  ]);

  const dailyBudget = parseInt(budgetSetting?.value || "0");

  // 保存された商品別数量を取得
  const savedQtyRows = await db.prepare("SELECT key, value FROM settings WHERE key LIKE 'budget_qty_%'").all<{ key: string; value: string }>();
  const savedQty: Record<number, number> = {};
  for (const row of savedQtyRows.results || []) {
    const pid = parseInt(row.key.replace("budget_qty_", ""));
    savedQty[pid] = parseFloat(row.value);
  }

  const userForms = (users.results || []).map(u => `
    <div class="card">
      <div class="card-title">👤 ユーザー${u.id}</div>
      <form method="POST" action="/settings/user">
        <input type="hidden" name="id" value="${u.id}" />
        <div class="form-group">
          <label>名前</label>
          <input type="text" name="name" value="${u.name}" required />
        </div>
        <div class="form-group">
          <label>アイコン（絵文字1文字）</label>
          <input type="text" name="icon" value="${u.icon}" maxlength="2" required />
        </div>
        <button type="submit" class="btn btn-ghost btn-full">保存する</button>
      </form>
    </div>
  `).join("");

  const productRows = (products.results || []).map(p => {
    const qty = savedQty[p.id] || 0;
    return `
      <div class="stat-row">
        <span style="font-size:14px">${p.icon} ${p.name}<br><span style="font-size:11px;color:var(--text2)">¥${p.price}/本</span></span>
        <div style="display:flex;align-items:center;gap:8px">
          <select name="qty_${p.id}" onchange="calcTotal()" data-price="${p.price}" style="width:80px">
            ${[0, 0.5, 1, 1.5, 2, 3].map(v => `<option value="${v}" ${qty === v ? "selected" : ""}>${v}本</option>`).join("")}
          </select>
        </div>
      </div>
    `;
  }).join("");

  const content = `
    ${msg ? `<div class="flash">✅ ${msg}</div>` : ""}

    <div class="card">
      <div class="card-title">📐 理論値の設定（1日の想定飲酒）</div>
      <form method="POST" action="/settings/budget" id="budget-form">
        ${productRows}
        <hr class="divider" />
        <div class="stat-row">
          <span style="font-weight:700">1日合計</span>
          <span id="budget-total" style="font-size:20px;font-weight:800;color:var(--accent2)">¥${dailyBudget.toLocaleString()}</span>
        </div>
        <button type="submit" class="btn btn-primary btn-full" style="margin-top:12px">保存する</button>
      </form>
    </div>
    <script>
      function calcTotal() {
        const selects = document.querySelectorAll('[name^="qty_"]');
        let total = 0;
        selects.forEach(sel => {
          total += parseFloat(sel.value) * parseFloat(sel.dataset.price);
        });
        document.getElementById('budget-total').textContent = '¥' + Math.round(total).toLocaleString();
      }
    </script>

    <div class="section-title">⚙️ ユーザー設定</div>
    ${userForms}

    <div class="card">
      <div class="card-title">ℹ️ アプリについて</div>
      <div class="stat-row">
        <span class="stat-label">アプリ名</span>
        <span class="stat-value">Mindful Drinking</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">バージョン</span>
        <span class="stat-value">1.0.0</span>
      </div>
    </div>
  `;

  return c.html(layout("設定", content, "settings"));
});

app.post("/settings/user", async (c) => {
  const db = c.env.DB;
  const form = await c.req.formData();
  await db.prepare("UPDATE users SET name = ?, icon = ? WHERE id = ?")
    .bind(form.get("name"), form.get("icon"), form.get("id")).run();
  return c.redirect("/settings?msg=ユーザー情報を更新しました");
});

app.post("/settings/budget", async (c) => {
  const db = c.env.DB;
  const form = await c.req.formData();

  const products = await db.prepare("SELECT * FROM products ORDER BY id").all<{ id: number; price: number }>();
  let total = 0;

  for (const p of products.results || []) {
    const qty = parseFloat((form.get(`qty_${p.id}`) as string) || "0");
    await db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)")
      .bind(`budget_qty_${p.id}`, qty.toString()).run();
    total += qty * p.price;
  }

  await db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('daily_budget', ?)")
    .bind(Math.round(total).toString()).run();

  return c.redirect("/settings?msg=1日の想定飲酒額を更新しました");
});

export default app;
