import { extname, basename, dirname, join } from "node:path";
import { writeFile, readFile, stat } from "node:fs/promises";

import { glob } from "glob";
import sharp from "sharp";
import { optimize } from "svgo";
import type { Config } from "svgo";

import type { Plugin, ResolvedConfig } from "vite";

const kb = 1000;

type CompressImageOptions = {
  quality?: {
    jpg?: number;
    png?: number;
    webp?: number;
    avif?: number;
  };
  svgoConfig?: Config;
  exclude?: string[];
  extension?: {
    webp?: 'append' | 'replace';  // 'append': .jpg.webp, 'replace': .webp
    avif?: 'append' | 'replace';  // 'append': .jpg.avif, 'replace': .avif
  };
};

export const compressImage = (options: CompressImageOptions = {}): Plugin => {
  let config: ResolvedConfig;
  let isProcessed = false;

  const {
    quality = {
      jpg: 80,
      png: 80,
      webp: 80,
      avif: 45
    },
    svgoConfig,
    exclude = [],
    extension = {
      webp: 'append',
      avif: 'append'
    }
  } = options;

  return {
    name: "compress-image",
    configResolved(resolvedConfig: ResolvedConfig) {
      config = resolvedConfig;
    },
    async closeBundle() {
      if (isProcessed) return;

      try {
        const files = await glob(`${config.build.outDir}/**/*.{png,jpg,svg}`, {
          ignore: exclude
        });

        if (files.length === 0) return;
        console.log('画像の圧縮を開始します');

        for (const file of files) {
          const ext = extname(file);
          const baseName = basename(file, ext);
          const dir = dirname(file);

          switch (ext) {
            case ".jpg": {
              const pic = await stat(file);
              const jpg = await sharp(file).toFormat("jpg", { quality: quality.jpg }).toBuffer();
              await writeFile(file, jpg);
              const webp = await sharp(file).toFormat("webp", { quality: quality.webp }).toBuffer();
              await writeFile(join(dir, `${baseName}${extension.webp === 'replace' ? '.webp' : '.jpg.webp'}`), webp);
              const avif = await sharp(file).toFormat("avif", { quality: quality.avif }).toBuffer();
              await writeFile(join(dir, `${baseName}${extension.avif === 'replace' ? '.avif' : '.jpg.avif'}`), avif);

              console.log(`${file} の圧縮が完了しました`);
              console.log(`元：${Math.floor(pic.size / kb)}kb、圧縮後：${Math.floor(jpg.length / kb)}kb、webp：${Math.floor(webp.length / kb)}kb、avif：${Math.floor(avif.length / kb)}kb`);
              break;
            }
            case ".png": {
              const pic = await stat(file);
              const png = await sharp(file).toFormat("png", { quality: quality.png }).toBuffer();
              await writeFile(file, png);
              const webp = await sharp(file).toFormat("webp", { quality: quality.webp }).toBuffer();
              await writeFile(join(dir, `${baseName}${extension.webp === 'replace' ? '.webp' : '.png.webp'}`), webp);
              const avif = await sharp(file).toFormat("avif", { quality: quality.avif }).toBuffer();
              await writeFile(join(dir, `${baseName}${extension.avif === 'replace' ? '.avif' : '.png.avif'}`), avif);

              console.log(`${file} の圧縮が完了しました`);
              console.log(`元：${Math.floor(pic.size / kb)}kb、圧縮後：${Math.floor(png.length / kb)}kb、webp：${Math.floor(webp.length / kb)}kb、avif：${Math.floor(avif.length / kb)}kb`);
              break;
            }
            case ".svg": {
              const pic = await stat(file);
              const svg = (await readFile(file)).toString();
              const result = optimize(svg, svgoConfig);
              await writeFile(file, result.data);
              console.log(`${file} の圧縮が完了しました`);
              console.log(`元：${Math.floor(pic.size)}byte、圧縮後：${Math.floor(result.data.length)}byte`);
              break;
            }
          }
        }

        isProcessed = true;
        console.log('すべての画像の圧縮が完了しました');
      } catch (error) {
        console.error('画像の圧縮中にエラーが発生しました:', error);
      }
    }
  }
}