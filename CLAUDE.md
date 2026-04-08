# Mindful Drinking App — 引き継ぎ書

## プロジェクト概要

夫婦二人でお酒の量と費用を記録・管理する節酒サポートアプリ。
子供2人・住宅ローンあり → お酒を減らして貯金するモチベーション管理が目的。

### 主な機能
- 飲酒記録（商品マスターから選択、価格自動入力）
- 禁酒記録（「飲まなかった日」の節約額ログ）
- 目標設定（旅行など）と貯金進捗
- 統計（週次/月次/半期/年次、理論値との比較）
- 記録履歴カレンダー
- 商品マスター管理
- 設定（ユーザー名、理論値 = 登録商品から数量選択）

### ユーザー構成
- 固定2ユーザー（橋本史哉・妻）、ログインなし、URLアクセスのみ
- 各ユーザーは異なるURLパスからアクセス（将来的な拡張余地あり）

---

## セッション起動方法

```bash
cd ~/maindful-drinking-app
claude --remote-control
```

iPhoneからアクセスする場合は表示されるQRコードをClaudeアプリでスキャン。

---

## 技術スタック

| 項目 | 内容 |
|------|------|
| フレームワーク | Hono（SSR、Cloudflare Workers） |
| ビルド | Vite + @hono/vite-build |
| DB | Cloudflare D1（SQLite互換） |
| デプロイ | Cloudflare Pages（wrangler pages deploy） |
| 言語 | TypeScript |
| PWA | manifest.json + apple-touch-icon（canvas生成アイコン） |

---

## アカウント情報

- **GitHub**: github.com/sanie0421
- **Cloudflare**: fumiya89@gmail.com
- **Cloudflare プロジェクト名**: maindful-drinking-app
- **D1 DB名**: maindful-drinking-db
- **D1 DB ID**: cfad411a-e970-48b2-9464-8dcff0409f92

---

## ファイル構成

```
maindful-drinking-app/
├── src/index.tsx         # メインアプリ（全ルート・HTML・CSS）
├── migrations/
│   └── 0001_init.sql     # DBスキーマ（users/products/records/goals/settings）
├── public/
│   ├── manifest.json     # PWAマニフェスト
│   └── icon-*.png        # アイコン（32/180/192/512px）
├── generate-icon.mjs     # アイコン生成スクリプト（canvas使用）
├── wrangler.jsonc        # Cloudflare設定（D1バインディング）
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 設計上の重要な決定事項

### layout()関数
`src/index.tsx` の `layout()` は **通常のテンプレートリテラル**を使う（Honoの `html` タグは使わない）。
→ 理由: Honoの `html` タグは `${content}` をエスケープしてしまうため、HTMLが文字列として表示される。

### 静的ファイル（アイコン・manifest）
`_routes.json` の exclude に `/icon-*.png` と `/manifest.json` を追加しないとWorkerに吸われて404になる。
→ `package.json` の buildスクリプトで自動パッチ済み。

### D1バインディング
CloudflareダッシュボードのUIが壊れている場合はREST APIで設定する。
OAuthトークン: `~/Library/Preferences/.wrangler/config/default.toml`

### 統計の理論値計算
- 月次: 月初〜今日のdaysInPeriodを使う
- 半期: 上半期(1-6月)は6/30まで、下半期(7-12月)は12/31まで
- 年次: 365日 or 366日（うるう年）

### 設定の理論値（daily_budget）
- 登録商品ごとに `budget_qty_{id}` として数量をsettingsテーブルに保存
- `daily_budget` = 各商品の（数量 × 価格）の合計を自動計算して保存

---

## デプロイ手順

```bash
npm run build
npx wrangler pages deploy ./dist
```

### ローカル開発
```bash
npm run dev
# → http://localhost:8788
```

---

## 開発ルール

- **コミュニケーションは日本語**
- コードにトークン・APIキー等の秘密情報を含めない（環境変数 or Cloudflare Secrets使用）
- iCloud上の元ファイル（`~/Library/Mobile Documents/iCloud~md~obsidian/Documents/アプリ制作/maindful_drinking_app/`）は参考資料として残す（削除しない）
- シンプルさ優先。余分な機能追加・抽象化はしない
- UIはダーク・スタイリッシュ路線を維持

---

## DBスキーマ概要

```sql
users       -- id, name, icon
products    -- id, name, price, alcohol_percent, volume_ml, category, icon
records     -- id, user_id, product_id, quantity, date, type(drink/skip), note, created_at
goals       -- id, name, target_amount, target_date, created_at
settings    -- key, value（daily_budget, budget_qty_{id}, user_{id}_name等）
```

---

## 参考リンク

- Cloudflare Pages: https://dash.cloudflare.com/
- Wrangler docs: https://developers.cloudflare.com/workers/wrangler/


---

## 横断ルール（main-office から展開・2026-04-08追加）

このセクションは main-office Claude（親会社）から全 vault に直接展開された横断ルール。
出典: `~/fumiya-world/main-office/CLAUDE.md` §5 八原則+1 / §4-1-bis

### 1. 編集する前に読め

ローカルファイル・既存コード・既存ドキュメントを編集する前に必ず読む。
**「読んでないファイルは絶対に変更するな」。**

理由: Claude Code のデフォルト思考予算が2026年初頭から「中程度の労力」に下げられた。
読まずに編集すると過去の文脈を無視した変更が起きる。マルチファイル作業では致命的。

出典: GitHub issue #42796 / 渡辺大知 投稿 / Theo @t3.gg のClaude Codeナーフ報告

### 2. 重い作業の前に /effort high

複雑な作業（マルチファイル編集・整合性チェック・横断的判断・大規模リファクタリング）の前に必ず打つ：

```
/effort high
```

または特に重い場合は `/effort max`（Opus でのデバッグ等）。

セッションごとに設定が必要。重い作業に入る前のおまじない。

### 3. showThinkingSummaries 有効化（マシン全体）

`~/.claude/settings.json` で `"showThinkingSummaries": true` を有効化済み（main-office Claude が 2026-04-08 に設定）。
マシン全体に効くので、このセッションでも次回起動時から思考の要約が見える。
判断ミスの早期発見・自分の動きの可視化に有用。

---

**展開日:** 2026-04-08
**展開元:** main-office Claude（親会社）
**橋本さん承認:** 済み
