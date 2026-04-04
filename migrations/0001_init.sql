-- ユーザーテーブル（2人固定）
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🍺',
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- 初期ユーザーデータ（あとで名前変更可能）
INSERT INTO users (name, icon) VALUES ('ふみや', '🍺');
INSERT INTO users (name, icon) VALUES ('奥さん', '🍷');

-- 商品マスター
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,  -- 円
  alcohol_percent REAL NOT NULL,  -- アルコール度数 (%)
  volume_ml INTEGER NOT NULL,  -- 容量 (ml)
  category TEXT NOT NULL DEFAULT 'ビール',  -- ビール/チューハイ/ワイン/日本酒/焼酎/その他
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- 飲酒・節約記録
CREATE TABLE IF NOT EXISTS records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  record_date TEXT NOT NULL,  -- YYYY-MM-DD
  type TEXT NOT NULL CHECK(type IN ('drink', 'skip')),  -- drink: 飲んだ / skip: 飲まなかった
  product_id INTEGER REFERENCES products(id),  -- type=drinkのとき
  custom_name TEXT,  -- 手動入力の場合
  price INTEGER NOT NULL DEFAULT 0,  -- 実際の金額
  alcohol_ml REAL NOT NULL DEFAULT 0,  -- アルコール量 (ml)
  note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- 目標テーブル
CREATE TABLE IF NOT EXISTS goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  target_amount INTEGER NOT NULL,  -- 目標金額（円）
  target_date TEXT NOT NULL,  -- 目標日 YYYY-MM-DD
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);
