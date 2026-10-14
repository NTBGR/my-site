import meta from "@/data/image-meta.json";

type Meta = { w: number; h: number; blur: string };
const table = meta as Record<string, Meta>;

// ფოტოს ზომა და blur: ავტომატურად იგენერირება build-ზე (scripts/image-meta.mjs)
export function imageMeta(src: string | undefined): Meta | undefined {
  return src ? table[src] : undefined;
}
