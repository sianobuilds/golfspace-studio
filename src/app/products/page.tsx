"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Camera,
  Check,
  ImagePlus,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  VISUAL_PRODUCTS,
  getProductImages,
  optimizeProductImage,
  removeProductImage,
  saveProductImage,
  type ProductImageMap,
} from "@/lib/product-images";

const categories = [
  "All Equipment",
  "Screens",
  "Sensors",
  "Hitting Mats",
  "Projectors",
  "Furniture",
  "Controls",
];

function ProductPlaceholder({
  id,
  color,
}: {
  id: string;
  color: string;
}) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_35%,#34483e,#101d18_78%)]">
      <svg
        viewBox="0 0 240 180"
        className="h-[78%] w-[78%] drop-shadow-2xl"
        aria-hidden="true"
      >
        {id === "screen" && (
          <>
            <rect x="19" y="20" width="202" height="140" rx="9" fill="#101615" stroke="#ad9671" strokeWidth="7" />
            <rect x="29" y="29" width="182" height="119" fill="#7dabb1" />
            <path d="M29 110 L72 77 L112 100 L157 55 L211 110 V148 H29Z" fill="#547c68" />
            <path d="M29 134 Q105 103 211 134 V148 H29Z" fill="#81a77b" />
            <path d="M114 146 L119 90" stroke="#e7e6ce" strokeWidth="2" />
          </>
        )}
        {id === "monitor" && (
          <>
            <path d="M75 147 L85 40 Q120 18 155 40 L166 147Z" fill="#253b3d" stroke="#7d9693" strokeWidth="3" />
            <rect x="93" y="46" width="54" height="45" rx="7" fill="#071c27" />
            <circle cx="120" cy="68" r="13" fill="#4c94ac" />
            <circle cx="120" cy="68" r="6" fill="#0a202a" />
            <rect x="98" y="112" width="44" height="5" rx="2" fill="#b8c9bc" />
          </>
        )}
        {id === "mat" && (
          <>
            <path d="M34 122 L82 45 L198 45 L222 122 L177 150 L19 150Z" fill="#1b2922" />
            <path d="M43 116 L87 53 L191 53 L211 116 L174 141 L31 141Z" fill="#568858" />
            {Array.from({ length: 9 }, (_, i) => (
              <path key={i} d={`M${42+i*18} 135 L${89+i*12} 55`} stroke="#83a47a" strokeWidth="1" opacity=".45" />
            ))}
            <circle cx="123" cy="98" r="6" fill="#f1f1e9" />
          </>
        )}
        {id === "projector" && (
          <>
            <path d="M40 66 L171 44 L207 74 L82 103Z" fill="#f1f1ed" />
            <path d="M40 66 L82 103 V138 L40 105Z" fill="#a4ada9" />
            <path d="M82 103 L207 74 V111 L82 138Z" fill="#cbd2ce" />
            <ellipse cx="151" cy="94" rx="23" ry="18" fill="#293d46" />
            <circle cx="151" cy="94" r="11" fill="#75a4b6" />
          </>
        )}
        {id === "sofa" && (
          <>
            <rect x="32" y="52" width="176" height="92" rx="19" fill="#987b62" />
            <rect x="42" y="69" width="76" height="51" rx="12" fill="#c4a384" />
            <rect x="122" y="69" width="76" height="51" rx="12" fill="#c4a384" />
            <rect x="21" y="100" width="35" height="52" rx="11" fill="#9f8067" />
            <rect x="184" y="100" width="35" height="52" rx="11" fill="#9f8067" />
            <rect x="48" y="119" width="144" height="31" rx="9" fill="#b59475" />
          </>
        )}
        {id === "kiosk" && (
          <>
            <path d="M92 32 H148 L155 153 H85Z" fill="#202f35" stroke="#81928f" strokeWidth="3" />
            <rect x="96" y="42" width="48" height="65" rx="3" fill="#426d79" />
            <rect x="102" y="49" width="36" height="10" rx="2" fill="#8fbdc0" />
            <rect x="102" y="67" width="36" height="5" rx="2" fill="#a9c8c6" />
            <rect x="102" y="78" width="36" height="5" rx="2" fill="#a9c8c6" />
            <circle cx="120" cy="124" r="5" fill="#c7ae79" />
          </>
        )}
      </svg>
      <span className="sr-only">{color} product illustration</span>
    </div>
  );
}

export default function ProductsPage() {
  const [category, setCategory] = useState("All Equipment");
  const [search, setSearch] = useState("");
  const [images, setImages] = useState<ProductImageMap>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    setImages(getProductImages());
  }, []);

  async function upload(id: string, file?: File) {
    if (!file) return;

    setBusy(id);
    setError("");

    try {
      const data = await optimizeProductImage(file);
      saveProductImage(id, data);
      setImages(getProductImages());
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Image upload failed."
      );
    } finally {
      setBusy(null);
    }
  }

  const filtered = VISUAL_PRODUCTS.filter((p) => {
    const matchesCategory =
      category === "All Equipment" || p.category === category;
    const matchesSearch =
      `${p.name} ${p.category} ${p.description}`
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#0c1713] text-[#f4f2ea]">
      <div className="mx-auto max-w-[1380px] px-5 pb-24 pt-16 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[.32em] text-[#cbb181]">
              Professional Equipment
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
              The Equipment <span className="text-[#cbb181]">Collection.</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/50">
              Explore a curated demonstration catalog of golf simulator
              equipment. Upload your own product photos and use them
              directly in Design Studio.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-full border border-[#cbb181]/30 px-5 py-3 text-sm text-[#cbb181]">
            <Check size={15} />
            {VISUAL_PRODUCTS.length} products
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-5 border-b border-white/10 pb-7">
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-full border px-4 py-2 text-xs transition ${
                  category === item
                    ? "border-[#d3b780] bg-[#d3b780] text-[#102019]"
                    : "border-white/15 text-white/65 hover:border-[#d3b780]/50 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2.5">
            <Search size={17} className="text-white/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search equipment"
              className="w-44 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
            />
          </div>
        </div>

        {error && (
          <div role="alert" className="mt-5 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <article
              key={product.id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-[#15251f] transition hover:-translate-y-1 hover:border-[#cbb181]/40"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {images[product.id] ? (
                  <div className="flex h-full items-center justify-center bg-[#24342c] p-5">
                    <img
                      src={images[product.id]}
                      alt={product.name}
                      className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <ProductPlaceholder id={product.id} color={product.color} />
                )}

                <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-[#102019]/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.15em] text-white/75 backdrop-blur">
                  Demo Product
                </span>

                <div className="absolute bottom-4 right-4 flex gap-2">
                  <input
                    ref={(node) => { fileRefs.current[product.id] = node; }}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      void upload(product.id, e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />

                  <button
                    onClick={() => fileRefs.current[product.id]?.click()}
                    disabled={busy === product.id}
                    className="flex items-center gap-2 rounded-full border border-white/20 bg-[#102019]/90 px-3 py-2 text-xs text-white backdrop-blur hover:bg-[#294536]"
                  >
                    <Camera size={14} />
                    {busy === product.id ? "Processing" : images[product.id] ? "Change Photo" : "Upload Photo"}
                  </button>

                  {images[product.id] && (
                    <button
                      aria-label={`Remove ${product.name} photo`}
                      onClick={() => {
                        removeProductImage(product.id);
                        setImages(getProductImages());
                      }}
                      className="rounded-full border border-white/20 bg-[#102019]/90 p-2 text-white/75 hover:text-red-300"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6">
                <p className="text-xs uppercase tracking-[.18em] text-[#cbb181]">
                  {product.category}
                </p>
                <h2 className="mt-3 text-xl font-semibold">{product.name}</h2>
                <p className="mt-2 text-sm text-white/45">
                  {product.description}
                </p>

                <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="text-lg font-semibold text-[#e3c88e]">
                    ₩{product.price.toLocaleString("ko-KR")}
                  </span>
                  <Link
                    href={`/studio/demo?add=${product.id}`}
                    className="flex items-center gap-1 text-sm text-white transition hover:text-[#e3c88e]"
                  >
                    Place in Studio <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-24 text-center text-white/45">
            <ImagePlus size={30} className="mx-auto mb-4" />
            No equipment matches your search.
          </div>
        )}

        <p className="mt-12 text-xs leading-6 text-white/35">
          Demo product names, specifications and prices are illustrative.
          Uploaded images are stored locally in this browser.
        </p>
      </div>
    </main>
  );
}
