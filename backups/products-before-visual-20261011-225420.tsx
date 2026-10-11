"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, SlidersHorizontal } from "lucide-react";
import { currency, equipment } from "@/lib/golfspace";

const categories = ["All Equipment", ...Array.from(new Set(equipment.map((p) => p.category)))];

export default function ProductsPage() {
  const [category, setCategory] = useState("All Equipment");
  const [search, setSearch] = useState("");

  const products = useMemo(
    () =>
      equipment.filter(
        (p) =>
          (category === "All Equipment" || p.category === category) &&
          `${p.name} ${p.category}`.toLowerCase().includes(search.toLowerCase())
      ),
    [category, search]
  );

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-16">
      <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#c8ae7d]">Professional equipment</p>
      <h1 className="text-5xl font-semibold tracking-tight">The Equipment Collection.</h1>
      <p className="mt-5 max-w-2xl text-lg text-white/50">
        Explore a curated demonstration catalog of essential golf simulator equipment.
      </p>
      <div className="mt-12 flex flex-wrap items-center gap-4">
        <div className="flex min-w-60 flex-1 items-center gap-3 rounded-xl border border-white/15 bg-[#17271f] px-4 py-3">
          <Search size={19} className="text-white/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search equipment..."
            className="w-full bg-transparent text-sm text-white placeholder:text-white/35"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-white/50">
          <SlidersHorizontal size={18} /> {products.length} products
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              category === item ? "bg-[#c8ae7d] text-[#13221b]" : "border border-white/15 text-white/60 hover:text-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <article key={product.id} className="overflow-hidden rounded-2xl border border-white/10 bg-[#14241d]">
            <div className="relative flex aspect-[1.3] items-center justify-center bg-[radial-gradient(ellipse,#304a3d,#14241d_70%)]">
              <div
                className="flex h-28 w-40 items-center justify-center rounded-xl border-4 border-white/15 shadow-2xl"
                style={{ backgroundColor: product.color }}
              >
                <span className="px-3 text-center text-xs font-medium uppercase tracking-widest text-white/80">
                  {product.category}
                </span>
              </div>
              <span className="absolute left-5 top-5 rounded-full border border-white/15 px-3 py-1 text-[11px] text-white/55">
                DEMO PRODUCT
              </span>
            </div>
            <div className="p-6">
              <p className="text-xs uppercase tracking-widest text-[#c8ae7d]">{product.category}</p>
              <h2 className="mt-2 text-xl font-medium">{product.name}</h2>
              <p className="mt-2 text-sm text-white/45">{product.description}</p>
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                <span className="font-semibold text-[#d8bf90]">{currency(product.price)}</span>
                <Link href="/studio/demo" className="flex items-center gap-1 text-sm text-white/75 hover:text-white">
                  Place in Studio <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      {products.length === 0 && <p className="py-20 text-center text-white/45">No equipment found.</p>}
      <p className="mt-10 text-xs text-white/35">All products and prices are fictional demonstration data.</p>
    </main>
  );
}
