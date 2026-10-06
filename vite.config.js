import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import sharp from "sharp";
import { defineConfig } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));
const imageDir = path.resolve(root, "public/images");
const imageNames = ["hero-courtyard", "concrete-patio", "block-wall", "stucco-home", "remodel-kitchen", "remodel-before", "owner-placeholder"];
const widths = [640, 1200, 1600];

async function generateResponsiveImages() {
  for (const name of imageNames) {
    const source = path.join(imageDir, `${name}.jpg`);
    const sourceStat = await fs.stat(source);
    for (const width of widths) {
      const webp = path.join(imageDir, `${name}-${width}.webp`);
      const existing = await fs.stat(webp).catch(() => null);
      if (!existing || existing.mtimeMs < sourceStat.mtimeMs) {
        await sharp(source).resize({ width, withoutEnlargement: true }).webp({ quality: 77, effort: 4 }).toFile(webp);
      }
      if (name === "hero-courtyard") {
        const avif = path.join(imageDir, `${name}-${width}.avif`);
        const avifStat = await fs.stat(avif).catch(() => null);
        if (!avifStat || avifStat.mtimeMs < sourceStat.mtimeMs) {
          await sharp(source).resize({ width, withoutEnlargement: true }).avif({ quality: 52, effort: 3 }).toFile(avif);
        }
      }
    }
  }
}

function responsiveImages() {
  return {
    name: "bighorn-responsive-images",
    async buildStart() { await generateResponsiveImages(); },
    async configureServer() { await generateResponsiveImages(); },
    async closeBundle() {
      // The public directory may have been copied before buildStart; ensure generated assets ship.
      const output = path.resolve(root, "dist/images");
      await fs.mkdir(output, { recursive: true });
      for (const name of imageNames) {
        for (const width of widths) {
          const filename = `${name}-${width}.webp`;
          await fs.copyFile(path.join(imageDir, filename), path.join(output, filename));
          if (name === "hero-courtyard") {
            const avif = `${name}-${width}.avif`;
            await fs.copyFile(path.join(imageDir, avif), path.join(output, avif));
          }
        }
      }
    },
  };
}

// Vite selects this JS config before the starter TS config. Keep route and 3D chunks separate for Vercel.
export default defineConfig({
  plugins: [react(), tailwindcss(), responsiveImages()],
  resolve: { alias: { "@": path.resolve(root, "src") } },
  build: { target: "es2020" },
});