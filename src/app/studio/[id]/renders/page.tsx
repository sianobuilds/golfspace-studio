"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ImageIcon,
  Layers,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { currency, equipment } from "@/lib/golfspace";

type SavedItem = {
  uid: string;
  productId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

const LAYOUT_KEY = "golfspace-konva-v1";
const ROOM_KEY = "golfspace-room-template-v1";

export default function RenderStudioPage() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [room, setRoom] = useState("classic");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LAYOUT_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(
            parsed.filter(
              (item): item is SavedItem =>
                item !== null &&
                typeof item === "object" &&
                typeof item.uid === "string" &&
                typeof item.productId === "string" &&
                ["x", "y", "width", "height", "rotation"].every(
                  (key) =>
                    typeof item[key] === "number" &&
                    Number.isFinite(item[key])
                )
            )
          );
        }
      }
      setRoom(localStorage.getItem(ROOM_KEY) ?? "classic");
    } catch {
      // Invalid local data: display an empty project.
    }
    setLoaded(true);
  }, []);

  const total = items.reduce(
    (sum, item) =>
      sum + (equipment.find((p) => p.id === item.productId)?.price ?? 0),
    0
  );

  const roomName =
    room === "premium"
      ? "Premium Private Bay"
      : room === "commercial"
      ? "Commercial Golf Bay"
      : "Classic Planning";

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-14">
      <Link
        href="/studio/demo"
        className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-white"
      >
        <ArrowLeft size={17} /> Back to Editor
      </Link>

      <div className="mt-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#c8ae7d]">
            <Sparkles size={16} /> Visualization Workspace
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Render Studio.
          </h1>
          <p className="mt-5 max-w-2xl leading-7 text-white/50">
            Review your saved equipment configuration and prepare it for
            photorealistic AI visualization.
          </p>
        </div>
        <span className="rounded-full border border-[#c8ae7d]/30 px-4 py-2 text-xs text-[#c8ae7d]">
          AI integration pending
        </span>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#15251e]">
          <div className="flex items-center justify-between border-b border-white/10 p-6">
            <h2 className="text-lg font-medium">Visualization Preview</h2>
            <ImageIcon size={20} className="text-[#c8ae7d]" />
          </div>

          <div className="flex min-h-[370px] flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,#294438,#111d17_70%)] px-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[#c8ae7d]/25 bg-[#c8ae7d]/10">
              <Sparkles size={34} className="text-[#c8ae7d]" />
            </div>
            <h3 className="mt-7 text-2xl font-medium">
              AI rendering is not connected yet
            </h3>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/45">
              A future AI service will use the room image and equipment
              layout to generate a realistic installation concept.
              No image has been generated on this page.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 p-6">
            <span className="flex items-center gap-2 text-xs text-white/45">
              <ShieldCheck size={16} /> No external image requests are made
            </span>
            <button
              disabled
              className="flex items-center gap-2 rounded-full bg-[#c8ae7d] px-5 py-3 text-sm font-semibold text-[#13221b]"
            >
              Generate AI Render <Sparkles size={16} />
            </button>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-white/10 bg-[#15251e] p-6">
            <div className="flex items-center gap-2 text-[#c8ae7d]">
              <Layers size={19} />
              <h2 className="font-medium">Project Summary</h2>
            </div>

            <div className="mt-7 space-y-5">
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-white/45">Project</span>
                <span>Signature Golf Bay</span>
              </div>
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-white/45">Room template</span>
                <span className="text-right">{roomName}</span>
              </div>
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-white/45">Equipment count</span>
                <span>{loaded ? items.length : "..."}</span>
              </div>
              <div className="border-t border-white/10 pt-5">
                <p className="text-xs text-white/45">Estimated equipment cost</p>
                <p className="mt-2 text-2xl font-semibold text-[#c8ae7d]">
                  {currency(total)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#15251e] p-6">
            <h2 className="font-medium">Equipment Configuration</h2>
            <div className="mt-5 space-y-3">
              {items.length === 0 && (
                <p className="text-sm text-white/45">
                  No saved equipment. Return to the editor and save your layout.
                </p>
              )}
              {items.map((item) => {
                const product = equipment.find(
                  (p) => p.id === item.productId
                );
                return (
                  <div
                    key={item.uid}
                    className="flex items-center justify-between gap-3 rounded-lg border border-white/10 px-3 py-3 text-sm"
                  >
                    <span className="truncate">
                      {product?.name ?? "Unknown Equipment"}
                    </span>
                    <CheckCircle2
                      size={16}
                      className="shrink-0 text-[#c8ae7d]"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <Link
            href="/studio/demo"
            className="flex items-center justify-between rounded-xl border border-[#c8ae7d]/40 px-5 py-4 text-sm text-[#c8ae7d]"
          >
            Continue Editing <ArrowRight size={18} />
          </Link>
        </aside>
      </div>

      <p className="mt-8 text-xs text-white/35">
        Portfolio demonstration. Equipment specifications and prices are illustrative.
      </p>
    </main>
  );
}
