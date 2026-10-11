"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Layers3 } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Equipment" },
  { href: "/dashboard", label: "My Projects" },
  { href: "/studio/demo", label: "Design Studio" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0c1715]/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-5 px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c8ae7d] text-[#11201b]">
            <Layers3 size={22} />
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">
            GolfSpace <span className="font-light text-[#c8ae7d]">Studio</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition hover:text-[#d5bd8c] ${
                pathname === link.href ? "text-[#d5bd8c]" : "text-white/65"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/studio/demo"
          className="inline-flex items-center gap-2 rounded-full bg-[#c8ae7d] px-5 py-3 text-sm font-semibold text-[#102019] transition hover:bg-[#e0c998]"
        >
          Open Studio <ArrowUpRight size={16} />
        </Link>
      </div>
    </header>
  );
}
