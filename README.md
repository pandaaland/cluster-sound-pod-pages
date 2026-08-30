# cluster-sound-pod-pages

cluster-sound-pod 関連のプレゼンテーション・ドキュメントを GitHub Pages で配信するためのリポジトリです。

## 構成

- `index.html` : プレゼンテーション・ページ一覧ポータル
- `presentation/`
  - `cluster-creators.html` : cluster経験者向けプレゼンテーションスライド
  - `sound-creators.html` : 音楽クリエイター向けプレゼンテーションスライド

## ローカル開発（プレビュー配信）

依存関係をインストール後、ローカルHTTPサーバーを起動してプレビューできます（ファイル変更時に自動リロードされます）。

```bash
# 初回のみ依存関係をインストール
npm install

# 開発サーバーを起動 (http://localhost:3000)
npm run dev
```

## GitHub Pages 設定

1. GitHub リポジトリの **Settings** > **Pages** を開きます。
2. **Build and deployment** の Source で **Deploy from a branch** を選択します。
3. Branch で `main`（または使用ブランチ）の `/ (root)` を選択し、**Save** をクリックします。
