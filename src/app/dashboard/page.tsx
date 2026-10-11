"use client";

import Link from "next/link";
import { ArrowUpRight, FolderOpen, Plus, Clock3, LayoutGrid } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [hasProject, setHasProject] = useState(false);

  useEffect(() => {
    setHasProject(localStorage.getItem("golfspace-layout-demo") !== null);
  }, []);

  return (
    <main className="mx-auto min-h-[80vh] max-w-7xl px-6 py-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#c8ae7d]">Your workspace</p>
          <h1 className="text-5xl font-semibold tracking-tight">My Projects.</h1>
          <p className="mt-4 text-white/50">Manage your golf space concepts and configurations.</p>
        </div>
        <Link href="/studio/demo" className="flex items-center gap-2 rounded-full bg-[#c8ae7d] px-6 py-3 font-semibold text-[#13221b]">
          <Plus size={18} /> Open Studio
        </Link>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {[
          { icon: FolderOpen, label: "Saved Concepts", value: hasProject ? "01" : "00" },
          { icon: LayoutGrid, label: "Workspace", value: "Demo" },
          { icon: Clock3, label: "Storage", value: "Local" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/10 bg-[#15261f] p-6">
            <stat.icon size={22} className="text-[#c8ae7d]" />
            <div className="mt-7 text-4xl font-semibold">{stat.value}</div>
            <div className="mt-2 text-sm text-white/45">{stat.label}</div>
          </div>
        ))}
      </div>

      <h2 className="mb-5 mt-14 text-2xl font-medium">Recent Designs</h2>
      {hasProject ? (
        <Link href="/studio/demo" className="flex max-w-lg items-center justify-between rounded-2xl border border-white/15 bg-[#15261f] p-7 transition hover:border-[#c8ae7d]/60">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#c8ae7d]">Saved locally</div>
            <div className="mt-3 text-xl font-medium">Signature Golf Bay</div>
            <div className="mt-2 text-sm text-white/45">Continue editing your equipment layout</div>
          </div>
          <ArrowUpRight size={22} />
        </Link>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/15 p-14 text-center">
          <FolderOpen className="mx-auto text-[#c8ae7d]" size={35} />
          <h3 className="mt-5 text-xl font-medium">No saved projects yet</h3>
          <p className="mt-3 text-white/45">Create your first layout in the design studio.</p>
          <Link href="/studio/demo" className="mt-6 inline-flex items-center gap-2 text-[#c8ae7d]">
            Start designing <ArrowUpRight size={17} />
          </Link>
        </div>
      )}
    </main>
  );
}
