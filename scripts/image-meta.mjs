// ფოტოების ზომები და ბუნდოვანი წინასწარი გამოსახულება (blur) ავტომატურად: public/artists/** → src/data/image-meta.json
// ხელით არაფერი იწერება: ახალი ფოტო საქაღალდეში რომ ჩაიდება, build-ზე ეს ფაილი თავად განახლდება.
import { readdir, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve("public");
const EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (EXT.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

const meta = {};
for (const file of (await walk(path.join(ROOT, "artists"))).sort()) {
  const image = sharp(file).rotate(); // EXIF-ის მიხედვით სწორი ორიენტაცია
  const info = await image.metadata();
  const oriented = info.orientation && info.orientation >= 5;
  const width = oriented ? info.height : info.width;
  const height = oriented ? info.width : info.height;
  const buf = await sharp(file).rotate().resize(16).blur(1).jpeg({ quality: 55 }).toBuffer();
  const key = "/" + path.relative(ROOT, file).split(path.sep).join("/");
  meta[key] = { w: width, h: height, blur: `data:image/jpeg;base64,${buf.toString("base64")}` };
}

await mkdir(path.resolve("src/data"), { recursive: true });
await writeFile(path.resolve("src/data/image-meta.json"), JSON.stringify(meta, null, 1) + "\n");
console.log(`image-meta: ${Object.keys(meta).length} images`);
