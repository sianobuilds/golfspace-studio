"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Check, Copy, Download, Maximize, Minus, Plus,
  RotateCcw, RotateCw, Save, Trash2, Undo2, Redo2, Layers,
} from "lucide-react";
import { equipment, currency } from "@/lib/golfspace";

type Placed = {
  uid: string;
  productId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

const STORAGE_KEY = "golfspace-layout-demo";
const BASE_W = 900;
const BASE_H = 540;

const initial: Placed[] = [
  { uid: "demo-screen", productId: "screen", x: 320, y: 70, width: 260, height: 32, rotation: 0 },
  { uid: "demo-mat", productId: "mat", x: 385, y: 310, width: 130, height: 85, rotation: 0 },
  { uid: "demo-monitor", productId: "monitor", x: 590, y: 330, width: 65, height: 45, rotation: 0 },
];

const productOf = (id: string) => equipment.find((p) => p.id === id);

export default function GolfEditor() {
  const [objects, setObjects] = useState<Placed[]>(initial);
  const [selected, setSelected] = useState<string | null>("demo-mat");
  const [zoom, setZoom] = useState(1);
  const [status, setStatus] = useState("Ready");
  const [history, setHistory] = useState<Placed[][]>([]);
  const [future, setFuture] = useState<Placed[][]>([]);
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const dragRef = useRef<{ uid: string; x: number; y: number; startX: number; startY: number; original: Placed[] } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const objectsRef = useRef(objects);

  useEffect(() => { objectsRef.current = objects; }, [objects]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.every((o) =>
          o && typeof o.uid === "string" && typeof o.productId === "string" &&
          ["x", "y", "width", "height", "rotation"].every((k) => typeof o[k] === "number" && Number.isFinite(o[k]))
        )) setObjects(parsed as Placed[]);
      }
    } catch { /* Keep starter layout if saved data is invalid. */ }
    setReady(true);
  }, []);

  const commit = useCallback((next: Placed[], previous = objectsRef.current) => {
    setHistory((h) => [...h.slice(-39), previous.map((o) => ({ ...o }))]);
    setFuture([]);
    setObjects(next);
    objectsRef.current = next;
    setStatus("Unsaved changes");
  }, []);

  const add = (id: string) => {
    const product = productOf(id);
    if (!product) return;
    const uid = `${id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    commit([...objectsRef.current, {
      uid, productId: id, x: 300, y: 210,
      width: product.width, height: product.height, rotation: 0,
    }]);
    setSelected(uid);
  };

  const update = (patch: Partial<Placed>) => {
    if (!selected) return;
    commit(objectsRef.current.map((o) => o.uid === selected ? { ...o, ...patch } : o));
  };

  const remove = () => {
    if (!selected) return;
    commit(objectsRef.current.filter((o) => o.uid !== selected));
    setSelected(null);
  };

  const duplicate = () => {
    const obj = objectsRef.current.find((o) => o.uid === selected);
    if (!obj) return;
    const uid = `${obj.productId}-${Date.now()}`;
    commit([...objectsRef.current, { ...obj, uid, x: obj.x + 25, y: obj.y + 25 }]);
    setSelected(uid);
  };

  const undo = () => {
    if (!history.length) return;
    const previous = history[history.length - 1];
    setFuture((f) => [objectsRef.current, ...f]);
    setHistory((h) => h.slice(0, -1));
    setObjects(previous);
    objectsRef.current = previous;
    setStatus("Unsaved changes");
  };

  const redo = () => {
    if (!future.length) return;
    const next = future[0];
    setHistory((h) => [...h, objectsRef.current]);
    setFuture((f) => f.slice(1));
    setObjects(next);
    objectsRef.current = next;
    setStatus("Unsaved changes");
  };

  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(objectsRef.current));
      setStatus("Saved locally");
    } catch {
      setStatus("Save failed");
    }
  };

  const pointerDown = (e: React.PointerEvent, obj: Placed) => {
    e.preventDefault();
    e.stopPropagation();
    setSelected(obj.uid);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragRef.current = {
      uid: obj.uid, x: e.clientX, y: e.clientY,
      startX: obj.x, startY: obj.y,
      original: objectsRef.current.map((o) => ({ ...o })),
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const pointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const sx = BASE_W / rect.width;
    const sy = BASE_H / rect.height;
    const next = objectsRef.current.map((o) =>
      o.uid === drag.uid
        ? {
            ...o,
            x: Math.max(0, Math.min(BASE_W - o.width, drag.startX + (e.clientX - drag.x) * sx)),
            y: Math.max(0, Math.min(BASE_H - o.height, drag.startY + (e.clientY - drag.y) * sy)),
          }
        : o
    );
    objectsRef.current = next;
    setObjects(next);
    setStatus("Unsaved changes");
  };

  const pointerUp = () => {
    if (dragRef.current) {
      const drag = dragRef.current;
      const changed = objectsRef.current.some((o) => {
        const original = drag.original.find((p) => p.uid === o.uid);
        return original && (o.x !== original.x || o.y !== original.y);
      });
      if (changed) {
        setHistory((h) => [...h.slice(-39), drag.original]);
        setFuture([]);
      }
      dragRef.current = null;
    }
  };

  const exportLayout = () => {
    const data = JSON.stringify({ project: "Signature Golf Bay", objects }, null, 2);
    const url = URL.createObjectURL(new Blob([data], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "golfspace-layout.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const uploadRoom = (file?: File) => {
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 8 * 1024 * 1024) {
      setStatus("Use PNG, JPG or WebP under 8 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setRoomImage(reader.result);
        setStatus("Room image loaded (session only)");
      }
    };
    reader.readAsDataURL(file);
  };

  const active = objects.find((o) => o.uid === selected);
  const total = objects.reduce((sum, o) => sum + (productOf(o.productId)?.price ?? 0), 0);

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#101b17]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-white/45 hover:text-white"><ArrowLeft size={19} /></Link>
          <div>
            <h1 className="font-semibold">Signature Golf Bay</h1>
            <p className="text-xs text-white/40">Interactive Design Studio · Demo Workspace</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={undo} disabled={!history.length} title="Undo" className="rounded-lg border border-white/10 p-2.5"><Undo2 size={17} /></button>
          <button onClick={redo} disabled={!future.length} title="Redo" className="rounded-lg border border-white/10 p-2.5"><Redo2 size={17} /></button>
          <button onClick={exportLayout} className="flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm"><Download size={16} /> Export</button>
          <button onClick={save} className="flex items-center gap-2 rounded-lg bg-[#c8ae7d] px-4 py-2.5 text-sm font-semibold text-[#12221b]"><Save size={16} /> Save Layout</button>
        </div>
      </div>

      <div className="grid min-h-[720px] lg:grid-cols-[250px_minmax(0,1fr)_270px]">
        <aside className="border-b border-white/10 bg-[#14221c] p-5 lg:border-b-0 lg:border-r">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-semibold">Equipment Library</h2>
            <Layers size={17} className="text-[#c8ae7d]" />
          </div>
          <p className="mb-5 text-xs leading-5 text-white/40">Select equipment to add it to your room.</p>
          <div className="space-y-3">
            {equipment.map((p) => (
              <button key={p.id} onClick={() => add(p.id)} className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-3 text-left transition hover:border-[#c8ae7d]/60 hover:bg-white/[0.07]">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/10" style={{ backgroundColor: p.color }}>
                  <Plus size={20} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{p.name}</span>
                  <span className="mt-1 block text-xs text-white/40">{p.category}</span>
                </span>
              </button>
            ))}
          </div>
          <button onClick={() => fileRef.current?.click()} className="mt-7 w-full rounded-xl border border-dashed border-[#c8ae7d]/45 px-4 py-3 text-sm text-[#c8ae7d] hover:bg-[#c8ae7d]/10">
            Upload Room Photo
          </button>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => uploadRoom(e.target.files?.[0])} />
          <p className="mt-3 text-xs leading-5 text-white/35">Room photos are displayed locally and are not uploaded to a server.</p>
        </aside>

        <section className="flex min-w-0 flex-col bg-[#0c1512] p-4 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#c8ae7d]">Workspace</p>
              <h2 className="mt-1 text-xl font-medium">Equipment Placement</h2>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#17261e] p-1">
              <button onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(1)))} className="rounded-lg p-2 hover:bg-white/10"><Minus size={17} /></button>
              <span className="min-w-12 text-center text-xs">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom((z) => Math.min(1.8, +(z + 0.1).toFixed(1)))} className="rounded-lg p-2 hover:bg-white/10"><Plus size={17} /></button>
              <button onClick={() => setZoom(1)} className="rounded-lg p-2 hover:bg-white/10"><Maximize size={17} /></button>
            </div>
          </div>

          <div className="flex min-h-[450px] flex-1 items-center justify-center overflow-auto rounded-2xl border border-white/10 bg-[#19231d] p-4">
            <div style={{ width: `${zoom * 100}%`, minWidth: zoom > 1 ? 680 : undefined }} className="relative max-w-none">
              <div
                ref={canvasRef}
                onClick={() => setSelected(null)}
                className="relative aspect-[5/3] w-full overflow-hidden rounded-lg border-[10px] border-[#48554c] bg-[#bbc2b6] shadow-[0_25px_60px_#0008]"
                style={{
                  backgroundImage: roomImage ? `url("${roomImage}")` : "linear-gradient(90deg,#aeb7ab 1px,transparent 1px),linear-gradient(#aeb7ab 1px,transparent 1px),linear-gradient(135deg,#d4d9cd,#9ba99b)",
                  backgroundSize: roomImage ? "cover" : "5% 8.33%,5% 8.33%,cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="pointer-events-none absolute left-1/2 top-[3%] -translate-x-1/2 rounded bg-[#152a20]/80 px-3 py-1 text-[9px] uppercase tracking-widest text-white/70">Front Wall</div>
                {objects.map((o) => {
                  const product = productOf(o.productId);
                  if (!product) return null;
                  const isSelected = o.uid === selected;
                  return (
                    <div
                      key={o.uid}
                      onPointerDown={(e) => pointerDown(e, o)}
                      onPointerMove={pointerMove}
                      onPointerUp={pointerUp}
                      onPointerCancel={pointerUp}
                      onClick={(e) => e.stopPropagation()}
                      className={`absolute flex cursor-grab select-none items-center justify-center rounded-md border-2 text-center shadow-lg active:cursor-grabbing ${
                        isSelected ? "border-[#f1cf85] ring-2 ring-[#f1cf85]/35" : "border-white/30"
                      }`}
                      style={{
                        left: `${(o.x / BASE_W) * 100}%`,
                        top: `${(o.y / BASE_H) * 100}%`,
                        width: `${(o.width / BASE_W) * 100}%`,
                        height: `${(o.height / BASE_H) * 100}%`,
                        transform: `rotate(${o.rotation}deg)`,
                        backgroundColor: product.color,
                        touchAction: "none",
                      }}
                    >
                      <span className="pointer-events-none truncate px-1 text-[clamp(6px,0.7vw,11px)] font-semibold text-white drop-shadow">
                        {product.name}
                      </span>
                      {isSelected && <span className="absolute -right-2 -top-2 h-3 w-3 rounded-full border-2 border-[#12221b] bg-[#f1cf85]" />}
                    </div>
                  );
                })}
                <div className="pointer-events-none absolute bottom-3 left-3 rounded bg-[#13251d]/75 px-3 py-2 text-[10px] text-white/75">
                  DEMO FLOOR PLAN · 9.0 × 5.4 m
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-white/45">
            <span className="flex items-center gap-2"><Check size={14} className="text-[#c8ae7d]" /> {ready ? status : "Loading workspace..."}</span>
            <span>{objects.length} objects · Drag to move · Select to edit properties</span>
          </div>
        </section>

        <aside className="border-t border-white/10 bg-[#14221c] p-5 lg:border-l lg:border-t-0">
          <h2 className="mb-6 font-semibold">Properties</h2>
          {active ? (
            <div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-widest text-[#c8ae7d]">Selected equipment</p>
                <h3 className="mt-2 font-medium">{productOf(active.productId)?.name}</h3>
              </div>
              <div className="mt-6 space-y-4">
                {([
                  ["X Position", "x"],
                  ["Y Position", "y"],
                  ["Width", "width"],
                  ["Height", "height"],
                  ["Rotation", "rotation"],
                ] as const).map(([label, key]) => (
                  <label key={key} className="block">
                    <span className="mb-2 block text-xs text-white/50">{label}</span>
                    <input
                      type="number"
                      value={Math.round(active[key])}
                      min={key === "width" || key === "height" ? 10 : undefined}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (!Number.isFinite(value)) return;
                        update({ [key]: key === "width" || key === "height" ? Math.max(10, value) : value });
                      }}
                      className="w-full rounded-lg border border-white/15 bg-[#0c1715] px-3 py-2.5 text-sm"
                    />
                  </label>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-2">
                <button onClick={() => update({ rotation: active.rotation - 15 })} className="flex items-center justify-center gap-2 rounded-lg border border-white/15 p-3 text-xs"><RotateCcw size={15} /> -15°</button>
                <button onClick={() => update({ rotation: active.rotation + 15 })} className="flex items-center justify-center gap-2 rounded-lg border border-white/15 p-3 text-xs"><RotateCw size={15} /> +15°</button>
                <button onClick={duplicate} className="flex items-center justify-center gap-2 rounded-lg border border-white/15 p-3 text-xs"><Copy size={15} /> Duplicate</button>
                <button onClick={remove} className="flex items-center justify-center gap-2 rounded-lg border border-red-400/25 p-3 text-xs text-red-300"><Trash2 size={15} /> Delete</button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/15 px-5 py-12 text-center text-sm leading-6 text-white/40">
              Select an equipment item on the canvas to edit its properties.
            </div>
          )}

          <div className="mt-9 border-t border-white/10 pt-6">
            <p className="text-xs uppercase tracking-widest text-white/45">Estimated Equipment Cost</p>
            <p className="mt-3 text-2xl font-semibold text-[#c8ae7d]">{currency(total)}</p>
            <p className="mt-2 text-xs leading-5 text-white/35">Illustrative equipment prices only. Installation and tax not included.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
