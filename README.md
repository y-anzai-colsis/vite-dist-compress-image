# vite-dist-compress-image

Viteのビルド出力ディレクトリ内の画像を自動的に圧縮するプラグインです。

## 特徴

- 画像の自動圧縮（JPG, PNG, SVG）
- WebPとAVIFフォーマットの自動生成
- SVGの最適化
- 除外パターンの指定が可能
- 圧縮品質のカスタマイズ
- WebPとAVIFの拡張子形式のカスタマイズ

## 主な機能

### 画像圧縮機能
- JPG/PNGの圧縮
  - 元の画像ファイルを圧縮
  - 圧縮品質をカスタマイズ可能
- WebP/AVIFの生成
  - 同じディレクトリにWebPとAVIFファイルを生成
  - 拡張子形式をカスタマイズ可能
- SVGの最適化
  - SVGOを使用した最適化
  - SVGOの設定をカスタマイズ可能

### カスタマイズ可能なオプション
- 圧縮品質の設定
  - 各フォーマット（JPG, PNG, WebP, AVIF）の品質を個別に設定
- SVGOの設定
  - SVGの最適化設定をカスタマイズ
- 除外パターンの指定
  - globパターンを使用して特定のファイルやディレクトリを除外
- 拡張子形式のカスタマイズ
  - WebPとAVIFの出力ファイル名をカスタマイズ

### 堅牢な実装
- パス処理の適切な実装
  - OSに依存しないパス処理
  - 安全なファイル操作
- エラーハンドリング
  - エラー発生時の適切な処理
  - エラーメッセージの出力
- 重複実行の防止
  - ビルド時の重複実行を防止
  - 効率的な処理の実現

## インストール

```bash
npm install -D vite-dist-compress-image
```

## 使用方法

`vite.config.js`（または`vite.config.ts`）に以下のように設定します：

```js
import { defineConfig } from 'vite';
import { compressImage } from 'vite-dist-compress-image';

export default defineConfig({
  plugins: [
    compressImage({
      // オプション
    })
  ]
});
```

## オプション

### quality

各フォーマットの圧縮品質を指定します。

```js
compressImage({
  quality: {
    jpg: 80,  // JPGの品質（0-100）
    png: 80,  // PNGの品質（0-100）
    webp: 80, // WebPの品質（0-100）
    avif: 45  // AVIFの品質（0-100）
  }
})
```

デフォルト値：
- jpg: 80
- png: 80
- webp: 80
- avif: 45

### svgoConfig

SVGの最適化設定を指定します。SVGOの設定オプションを使用できます。

```js
compressImage({
  svgoConfig: {
    multipass: true,
    plugins: [
      'preset-default',
      {
        name: 'removeViewBox',
        active: false
      }
    ]
  }
})
```

### exclude

圧縮処理から除外するファイルやディレクトリを指定します。globパターンを使用できます。

```js
compressImage({
  exclude: [
    '**/icons/**',     // iconsディレクトリ内のファイルを除外
    '**/*.min.*',      // すでに圧縮済みのファイルを除外
    '**/original/**'   // originalディレクトリ内のファイルを除外
  ]
})
```

### extension

WebPとAVIFの拡張子形式を指定します。

```js
compressImage({
  extension: {
    webp: 'replace',  // 'append': .jpg.webp, 'replace': .webp
    avif: 'replace'   // 'append': .jpg.avif, 'replace': .avif
  }
})
```

デフォルト値：
- webp: 'append'（例：`image.jpg.webp`、`image.png.webp`）
- avif: 'append'（例：`image.jpg.avif`、`image.png.avif`）

`replace`を指定した場合：
- webp: `image.webp`
- avif: `image.avif`

## 出力

- 元の画像ファイルが圧縮されます
- JPG/PNGファイルの場合、同じディレクトリにWebPとAVIFファイルが生成されます
- SVGファイルは最適化されます

## 注意事項

- このプラグインはビルド出力ディレクトリ（`dist`など）内の画像を処理します
- 元の画像ファイルは上書きされます
- 圧縮処理は`closeBundle`フックで実行されます

## ライセンス

MIT