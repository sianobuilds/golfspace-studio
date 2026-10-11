import EquipmentKonvaImage from "@/components/equipment-konva-image";
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import {
  Stage,
  Layer,
  Rect,
  Text,
  Image as KonvaImage,
  Transformer,
  Group,
} from "react-konva";
import type Konva from "konva";
import {
  ArrowLeft,
  Download,
  ImagePlus,
  Minus,
  Plus,
  Redo2,
  RotateCcw,
  Save,
  Trash2,
  Undo2,
  Copy,
  Maximize,
  Sparkles,
  Building2,
} from "lucide-react";
import { equipment, currency } from "@/lib/golfspace";

type Item = {
  uid: string;
  productId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

type Viewport = {
  scale: number;
  x: number;
  y: number;
};

const W = 900;
const H = 540;
const KEY = "golfspace-konva-v1";
const ROOM_KEY = "golfspace-room-template-v1";

type RoomTemplate = "classic" | "premium" | "commercial";

const rooms: Record<RoomTemplate, {
  name: string;
  floor: string;
  grid: string;
  border: string;
}> = {
  classic: {
    name: "Classic Planning",
    floor: "#c4cec1",
    grid: "#a4b2a5",
    border: "#465c4c",
  },
  premium: {
    name: "Premium Private Bay",
    floor: "#8b9485",
    grid: "#6c786b",
    border: "#293b31",
  },
  commercial: {
    name: "Commercial Golf Bay",
    floor: "#b8b6aa",
    grid: "#96978e",
    border: "#414b45",
  },
};

const starter: Item[] = [
  {
    uid: "screen-1",
    productId: "screen",
    x: 300,
    y: 65,
    width: 300,
    height: 45,
    rotation: 0,
  },
  {
    uid: "mat-1",
    productId: "mat",
    x: 380,
    y: 300,
    width: 140,
    height: 100,
    rotation: 0,
  },
  {
    uid: "monitor-1",
    productId: "monitor",
    x: 585,
    y: 320,
    width: 75,
    height: 55,
    rotation: 0,
  },
];

function getProduct(id: string) {
  return equipment.find((item) => item.id === id);
}

function clone(items: Item[]) {
  return items.map((item) => ({ ...item }));
}

function isValidItem(value: unknown): value is Item {
  if (!value || typeof value !== "object") return false;

  const item = value as Record<string, unknown>;
  return (
    typeof item.uid === "string" &&
    typeof item.productId === "string" &&
    ["x", "y", "width", "height", "rotation"].every(
      (key) =>
        typeof item[key] === "number" &&
        Number.isFinite(item[key])
    )
  );
}

export default function GolfEditor() {
  const [items, setItems] = useState<Item[]>(starter);
  const [selected, setSelected] = useState<string | null>("mat-1");
  const [history, setHistory] = useState<Item[][]>([]);
  const [future, setFuture] = useState<Item[][]>([]);
  const [status, setStatus] = useState("Ready");
  const [roomTemplate, setRoomTemplate] =
    useState<RoomTemplate>("classic");
  const [loaded, setLoaded] = useState(false);
  const [containerWidth, setContainerWidth] = useState(900);
  const [viewport, setViewport] = useState<Viewport>({
    scale: 1,
    x: 0,
    y: 0,
  });
  const [roomImage, setRoomImage] =
    useState<HTMLImageElement | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const nodeRefs = useRef<Record<string, Konva.Group | null>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef(items);
  const gestureRef = useRef<{
    distance: number;
    center: { x: number; y: number };
  } | null>(null);
  const gestureActiveRef = useRef(false);
  const previousRef = useRef<Item[] | null>(null);

  const fitScale = Math.min(1, containerWidth / W);
  const stageHeight = Math.max(320, H * fitScale + 60);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (
          Array.isArray(parsed) &&
          parsed.every(isValidItem)
        ) {
          setItems(parsed);
          itemsRef.current = parsed;
          setStatus("Saved layout restored");
        }
      }
    } catch {
      setStatus("Could not restore saved layout");
    }

    const savedRoom = localStorage.getItem(ROOM_KEY);
    if (
      savedRoom === "classic" ||
      savedRoom === "premium" ||
      savedRoom === "commercial"
    ) {
      setRoomTemplate(savedRoom);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(items));
        localStorage.setItem(ROOM_KEY, roomTemplate);
        setStatus((current) =>
          current === "Unsaved changes" ? "Autosaved" : current
        );
      } catch {
        setStatus("Autosave failed: browser storage unavailable");
      }
    }, 900);

    return () => window.clearTimeout(timer);
  }, [items, roomTemplate, loaded]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      setContainerWidth(Math.max(300, element.clientWidth - 24));
    });

    observer.observe(element);
    setContainerWidth(Math.max(300, element.clientWidth - 24));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const transformer = transformerRef.current;
    if (!transformer) return;

    const node = selected ? nodeRefs.current[selected] : null;
    transformer.nodes(node ? [node] : []);
    transformer.getLayer()?.batchDraw();
  }, [selected, items]);

  const commit = useCallback((next: Item[], previous?: Item[]) => {
    const before = previous ?? itemsRef.current;
    setHistory((h) => [...h.slice(-49), clone(before)]);
    setFuture([]);
    itemsRef.current = next;
    setItems(next);
    setStatus("Unsaved changes");
  }, []);

  const updateItem = (uid: string, patch: Partial<Item>) => {
    commit(
      itemsRef.current.map((item) =>
        item.uid === uid ? { ...item, ...patch } : item
      )
    );
  };

  const addItem = (productId: string) => {
    const product = getProduct(productId);
    if (!product) return;

    const uid = crypto.randomUUID();
    const next: Item = {
      uid,
      productId,
      x: 330,
      y: 230,
      width: product.width,
      height: product.height,
      rotation: 0,
    };

    commit([...itemsRef.current, next]);
    setSelected(uid);
  };

  const removeItem = () => {
    if (!selected) return;
    commit(itemsRef.current.filter((item) => item.uid !== selected));
    setSelected(null);
  };

  const duplicateItem = () => {
    const item = itemsRef.current.find((x) => x.uid === selected);
    if (!item) return;

    const copy: Item = {
      ...item,
      uid: crypto.randomUUID(),
      x: item.x + 25,
      y: item.y + 25,
    };

    commit([...itemsRef.current, copy]);
    setSelected(copy.uid);
  };

  const undo = () => {
    if (!history.length) return;

    const previous = history[history.length - 1];
    setFuture((f) => [clone(itemsRef.current), ...f]);
    setHistory((h) => h.slice(0, -1));
    itemsRef.current = previous;
    setItems(previous);
    setStatus("Unsaved changes");
  };

  const redo = () => {
    if (!future.length) return;

    const next = future[0];
    setHistory((h) => [...h, clone(itemsRef.current)]);
    setFuture((f) => f.slice(1));
    itemsRef.current = next;
    setItems(next);
    setStatus("Unsaved changes");
  };

  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(itemsRef.current));
      setStatus("Saved locally");
    } catch {
      setStatus("Save failed");
    }
  };

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA"
      ) return;

      const mod = event.metaKey || event.ctrlKey;
      if (!mod) return;

      if (event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const changeZoom = (factor: number, center?: { x: number; y: number }) => {
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const newScale = Math.max(
      fitScale * 0.5,
      Math.min(fitScale * 3, oldScale * factor)
    );

    const point = center ?? {
      x: stage.width() / 2,
      y: stage.height() / 2,
    };

    const relative = {
      x: (point.x - stage.x()) / oldScale,
      y: (point.y - stage.y()) / oldScale,
    };

    setViewport({
      scale: newScale / fitScale,
      x: point.x - relative.x * newScale,
      y: point.y - relative.y * newScale,
    });
  };

  const onWheel = (event: Konva.KonvaEventObject<WheelEvent>) => {
    event.evt.preventDefault();

    const stage = stageRef.current;
    if (!stage) return;

    const pointer = stage.getPointerPosition();
    changeZoom(
      event.evt.deltaY > 0 ? 0.92 : 1.08,
      pointer ?? undefined
    );
  };

  const onTouchMove = (
    event: Konva.KonvaEventObject<TouchEvent>
  ) => {
    const stage = stageRef.current;
    if (!stage || event.evt.touches.length !== 2) return;

    event.evt.preventDefault();
    gestureActiveRef.current = true;
    stage.stopDrag();

    const rect = stage.container().getBoundingClientRect();
    const a = event.evt.touches[0];
    const b = event.evt.touches[1];

    const center = {
      x: (a.clientX + b.clientX) / 2 - rect.left,
      y: (a.clientY + b.clientY) / 2 - rect.top,
    };

    const distance = Math.hypot(
      a.clientX - b.clientX,
      a.clientY - b.clientY
    );

    const previous = gestureRef.current;
    if (previous) {
      const oldScale = stage.scaleX();
      const newScale = Math.max(
        fitScale * 0.5,
        Math.min(
          fitScale * 3,
          oldScale * (distance / previous.distance)
        )
      );

      const relative = {
        x: (previous.center.x - stage.x()) / oldScale,
        y: (previous.center.y - stage.y()) / oldScale,
      };

      setViewport({
        scale: newScale / fitScale,
        x: center.x - relative.x * newScale,
        y: center.y - relative.y * newScale,
      });
    }

    gestureRef.current = { distance, center };
  };

  const endTouch = () => {
    gestureRef.current = null;
    gestureActiveRef.current = false;
  };

  const uploadImage = (file?: File) => {
    if (!file) return;

    if (
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 8 * 1024 * 1024
    ) {
      setStatus("Use JPG, PNG or WebP under 8 MB");
      return;
    }

    const url = URL.createObjectURL(file);
    const image = new window.Image();

    image.onload = () => {
      setRoomImage(image);
      setStatus("Room photo loaded for this session");
      URL.revokeObjectURL(url);
    };

    image.onerror = () => {
      setStatus("Could not open image");
      URL.revokeObjectURL(url);
    };

    image.src = url;
  };

  const exportPng = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const oldSelected = selected;
    setSelected(null);

    requestAnimationFrame(() => {
      const transformer = transformerRef.current;
      transformer?.hide();

      const data = stage.toDataURL({
        pixelRatio: 2,
        mimeType: "image/png",
      });

      const a = document.createElement("a");
      a.href = data;
      a.download = "golfspace-layout.png";
      a.click();

      transformer?.show();
      setSelected(oldSelected);
    });
  };

  const exportJson = () => {
    const blob = new Blob(
      [JSON.stringify(itemsRef.current, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "golfspace-layout.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const active = items.find((item) => item.uid === selected);
  const total = items.reduce(
    (sum, item) => sum + (getProduct(item.productId)?.price ?? 0),
    0
  );

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#0d1713] text-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-white/50 hover:text-white">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-semibold">Signature Golf Bay</h1>
            <p className="text-xs text-white/40">
              GolfSpace Studio · Interactive Editor
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={undo} disabled={!history.length} title="Undo" className="rounded-lg border border-white/15 p-2.5">
            <Undo2 size={17} />
          </button>
          <button onClick={redo} disabled={!future.length} title="Redo" className="rounded-lg border border-white/15 p-2.5">
            <Redo2 size={17} />
          </button>
          <button onClick={exportJson} className="rounded-lg border border-white/15 px-3 py-2.5 text-sm">
            JSON
          </button>
          <button onClick={exportPng} className="flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2.5 text-sm">
            <Download size={16} /> PNG
          </button>
          <Link
            href="/studio/demo/renders"
            className="flex items-center gap-2 rounded-lg border border-[#c8ae7d]/50 px-4 py-2.5 text-sm text-[#d8bd87]"
          >
            <Sparkles size={16} /> Render Studio
          </Link>
          <button onClick={save} className="flex items-center gap-2 rounded-lg bg-[#c8ae7d] px-4 py-2.5 text-sm font-semibold text-[#13221b]">
            <Save size={16} /> Save
          </button>
        </div>
      </div>

      <div className="grid min-w-0 xl:grid-cols-[220px_minmax(0,1fr)_240px]">
        <aside className="border-b border-white/10 bg-[#15251e] p-5 xl:min-h-[760px] xl:border-b-0 xl:border-r">
          <h2 className="text-lg font-semibold">Equipment Library</h2>
          <p className="mt-2 text-xs leading-5 text-white/45">
            Add equipment to your golf simulator layout.
          </p>

          <div className="mt-6 space-y-3">
            {equipment.map((product) => (
              <button
                key={product.id}
                onClick={() => addItem(product.id)}
                className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-3 text-left hover:border-[#c8ae7d]/60"
              >
                <span
                  className="h-11 w-11 shrink-0 rounded-lg border border-white/15"
                  style={{ backgroundColor: product.color }}
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">
                    {product.name}
                  </span>
                  <span className="block text-xs text-white/40">
                    {product.category}
                  </span>
                </span>
                <Plus size={16} className="ml-auto shrink-0 text-[#c8ae7d]" />
              </button>
            ))}
          </div>

          <div className="mt-7 border-t border-white/10 pt-6">
            <div className="mb-3 flex items-center gap-2">
              <Building2 size={16} className="text-[#c8ae7d]" />
              <h3 className="text-sm font-semibold">Room Templates</h3>
            </div>
            <div className="space-y-2">
              {(Object.keys(rooms) as RoomTemplate[]).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setRoomTemplate(key);
                    setStatus("Room template changed");
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left text-xs transition ${
                    roomTemplate === key
                      ? "border-[#c8ae7d] bg-[#c8ae7d]/10 text-[#e5c995]"
                      : "border-white/10 text-white/60 hover:border-white/30"
                  }`}
                >
                  <span
                    className="h-6 w-6 shrink-0 rounded"
                    style={{ background: rooms[key].floor }}
                  />
                  {rooms[key].name}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => fileRef.current?.click()}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#c8ae7d]/50 px-3 py-3 text-sm text-[#c8ae7d]"
          >
            <ImagePlus size={17} /> Upload Room Photo
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(event) => uploadImage(event.target.files?.[0])}
          />
          <p className="mt-3 text-xs leading-5 text-white/35">
            Uploaded photos are temporary and are not sent to a server.
          </p>
        </aside>

        <section className="min-w-0 p-4 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#c8ae7d]">
                Design Workspace
              </p>
              <h2 className="mt-1 text-xl font-medium">Equipment Placement</h2>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#17271f] p-1">
              <button onClick={() => changeZoom(0.85)} className="rounded-lg p-2 hover:bg-white/10" title="Zoom out">
                <Minus size={17} />
              </button>
              <span className="min-w-12 text-center text-xs">
                {Math.round(viewport.scale * 100)}%
              </span>
              <button onClick={() => changeZoom(1.15)} className="rounded-lg p-2 hover:bg-white/10" title="Zoom in">
                <Plus size={17} />
              </button>
              <button
                onClick={() => setViewport({ scale: 1, x: 0, y: 0 })}
                className="rounded-lg p-2 hover:bg-white/10"
                title="Fit canvas"
              >
                <Maximize size={17} />
              </button>
            </div>
          </div>

          <div
            ref={containerRef}
            className="flex min-h-[480px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#1b2921] p-3"
            style={{ touchAction: "none" }}
          >
            <Stage
              ref={stageRef}
              width={containerWidth}
              height={stageHeight}
              scaleX={fitScale * viewport.scale}
              scaleY={fitScale * viewport.scale}
              x={viewport.x}
              y={viewport.y}
              onWheel={onWheel}
              onTouchMove={onTouchMove}
              onTouchEnd={endTouch}
              onTouchCancel={endTouch}
              onMouseDown={(event) => {
                if (event.target === event.target.getStage()) {
                  setSelected(null);
                }
              }}
              onTap={(event) => {
                if (event.target === event.target.getStage()) {
                  setSelected(null);
                }
              }}
            >
              <Layer>
                <Rect
                  width={W}
                  height={H}
                  fill={rooms[roomTemplate].floor}
                  stroke={rooms[roomTemplate].border}
                  strokeWidth={12}
                  onClick={() => setSelected(null)}
                  onTap={() => setSelected(null)}
                />

                {roomImage && (
                  <KonvaImage
                    image={roomImage}
                    width={W}
                    height={H}
                    listening={false}
                  />
                )}

                {!roomImage &&
                  Array.from({ length: 18 }, (_, i) => (
                    <Rect
                      key={`vertical-${i}`}
                      x={i * 50}
                      width={1}
                      height={H}
                      fill={rooms[roomTemplate].grid}
                      listening={false}
                    />
                  ))}

                {!roomImage &&
                  Array.from({ length: 11 }, (_, i) => (
                    <Rect
                      key={`horizontal-${i}`}
                      y={i * 50}
                      height={1}
                      width={W}
                      fill={rooms[roomTemplate].grid}
                      listening={false}
                    />
                  ))}

                {items.map((item) => {
                  const product = getProduct(item.productId);
                  if (!product) return null;

                  return (
                    <Group
                      key={item.uid}
                      ref={(node) => {
                        nodeRefs.current[item.uid] = node;
                      }}
                      x={item.x}
                      y={item.y}
                      rotation={item.rotation}
                      draggable
                      onMouseDown={(event) => {
                        event.cancelBubble = true;
                        setSelected(item.uid);
                      }}
                      onTap={(event) => {
                        event.cancelBubble = true;
                        setSelected(item.uid);
                      }}
                      onDragStart={() => {
                        previousRef.current = clone(itemsRef.current);
                      }}
                      onDragEnd={(event) => {
                        if (gestureActiveRef.current) return;

                        const next = itemsRef.current.map((obj) =>
                          obj.uid === item.uid
                            ? {
                                ...obj,
                                x: event.target.x(),
                                y: event.target.y(),
                              }
                            : obj
                        );

                        commit(next, previousRef.current ?? undefined);
                        previousRef.current = null;
                      }}
                      onTransformStart={() => {
                        previousRef.current = clone(itemsRef.current);
                      }}
                      onTransformEnd={(event) => {
                        const node = event.target;
                        const sx = node.scaleX();
                        const sy = node.scaleY();

                        node.scaleX(1);
                        node.scaleY(1);

                        const next = itemsRef.current.map((obj) =>
                          obj.uid === item.uid
                            ? {
                                ...obj,
                                x: node.x(),
                                y: node.y(),
                                width: Math.max(20, obj.width * sx),
                                height: Math.max(20, obj.height * sy),
                                rotation: node.rotation(),
                              }
                            : obj
                        );

                        commit(next, previousRef.current ?? undefined);
                        previousRef.current = null;
                      }}
                    >
                      <Rect
                        width={item.width}
                        height={item.height}
                        fill={product.color}
                        cornerRadius={5}
                        stroke={selected === item.uid ? "#f1d18d" : "#ffffff88"}
                        strokeWidth={selected === item.uid ? 3 : 1}
                        shadowColor="#000000"
                        shadowBlur={12}
                        shadowOpacity={0.25}
                      />
                      {item.productId === "screen" && (
                        <>
                          <Rect
                            x={8}
                            y={5}
                            width={Math.max(1, item.width - 16)}
                            height={Math.max(1, item.height - 10)}
                            fill="#c3d7c0"
                            stroke="#273b31"
                            strokeWidth={2}
                            cornerRadius={2}
                            listening={false}
                          />
                          <Rect
                            x={item.width * 0.12}
                            y={item.height * 0.6}
                            width={item.width * 0.76}
                            height={2}
                            fill="#6e9271"
                            listening={false}
                          />
                        </>
                      )}

                      {item.productId === "mat" && (
                        <>
                          <Rect
                            x={6}
                            y={6}
                            width={Math.max(1, item.width - 12)}
                            height={Math.max(1, item.height - 12)}
                            fill="#427c4d"
                            stroke="#a5bca0"
                            strokeWidth={2}
                            cornerRadius={4}
                            listening={false}
                          />
                          <Rect
                            x={item.width / 2 - 2}
                            y={item.height * 0.15}
                            width={4}
                            height={item.height * 0.7}
                            fill="#a4c6a1"
                            listening={false}
                          />
                        </>
                      )}

                      {item.productId === "monitor" && (
                        <Rect
                          x={item.width * 0.2}
                          y={item.height * 0.2}
                          width={item.width * 0.6}
                          height={item.height * 0.6}
                          fill="#263c39"
                          stroke="#e1c58b"
                          strokeWidth={3}
                          cornerRadius={8}
                          listening={false}
                        />
                      )}

                      {item.productId === "projector" && (
                        <>
                          <Rect
                            x={6}
                            y={6}
                            width={Math.max(1, item.width - 12)}
                            height={Math.max(1, item.height - 12)}
                            fill="#e1e5de"
                            cornerRadius={8}
                            listening={false}
                          />
                          <Rect
                            x={item.width * 0.34}
                            y={item.height * 0.22}
                            width={item.width * 0.32}
                            height={item.height * 0.56}
                            fill="#354e58"
                            cornerRadius={15}
                            listening={false}
                          />
                        </>
                      )}

                      {item.productId === "sofa" && (
                        <>
                          <Rect
                            x={5}
                            y={5}
                            width={Math.max(1, item.width - 10)}
                            height={Math.max(1, item.height - 10)}
                            fill="#c1a88c"
                            cornerRadius={12}
                            listening={false}
                          />
                          <Rect
                            x={8}
                            y={8}
                            width={Math.max(1, item.width - 16)}
                            height={Math.max(1, item.height * 0.23)}
                            fill="#866c56"
                            cornerRadius={5}
                            listening={false}
                          />
                        </>
                      )}

                      {item.productId === "kiosk" && (
                        <Rect
                          x={item.width * 0.18}
                          y={item.height * 0.12}
                          width={item.width * 0.64}
                          height={item.height * 0.76}
                          fill="#1e353c"
                          stroke="#d3b77f"
                          strokeWidth={3}
                          cornerRadius={5}
                          listening={false}
                        />
                      )}

                      <EquipmentKonvaImage
                        productId={item.productId}
                        width={item.width}
                        height={item.height}
                      />

                      <Text
                        text={product.name}
                        width={item.width}
                        height={item.height}
                        align="center"
                        verticalAlign="middle"
                        fontSize={Math.min(13, item.width / 9)}
                        fontStyle="bold"
                        fill={
                          item.productId === "screen" ||
                          item.productId === "projector"
                            ? "#213b2e"
                            : "#ffffff"
                        }
                        shadowColor={
                          item.productId === "screen" ||
                          item.productId === "projector"
                            ? "#ffffff"
                            : "#000000"
                        }
                        shadowBlur={2}
                        listening={false}
                        padding={3}
                      />
                    </Group>
                  );
                })}

                <Transformer
                  ref={transformerRef}
                  rotateEnabled
                  flipEnabled={false}
                  keepRatio={false}
                  borderStroke="#f1d18d"
                  anchorFill="#f1d18d"
                  anchorStroke="#183023"
                  anchorSize={11}
                  boundBoxFunc={(_old, next) =>
                    next.width < 20 || next.height < 20
                      ? _old
                      : next
                  }
                />
              </Layer>
            </Stage>
          </div>

          <div className="mt-4 flex flex-wrap justify-between gap-3 text-xs text-white/45">
            <span>{status}</span>
            <span>{items.length} objects · Drag / Resize / Rotate</span>
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-[#17271f] p-4 text-xs leading-6 text-white/45">
            Mouse: select and drag equipment, use transformer handles to resize or rotate,
            and scroll to zoom. iPad: drag with one finger and pinch with two fingers.
            This is a visual planning demo, not a verified installation plan.
          </div>
        </section>

        <aside className="border-t border-white/10 bg-[#15251e] p-5 xl:border-l xl:border-t-0">
          <h2 className="text-lg font-semibold">Properties</h2>

          {active ? (
            <>
              <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-widest text-[#c8ae7d]">
                  Selected Equipment
                </p>
                <h3 className="mt-2 font-medium">
                  {getProduct(active.productId)?.name}
                </h3>
              </div>

              <div className="mt-6 space-y-4">
                {(
                  [
                    ["Position X", "x"],
                    ["Position Y", "y"],
                    ["Width", "width"],
                    ["Height", "height"],
                    ["Rotation", "rotation"],
                  ] as const
                ).map(([label, field]) => (
                  <label key={field} className="block">
                    <span className="mb-2 block text-xs text-white/50">
                      {label}
                    </span>
                    <input
                      type="number"
                      value={Math.round(active[field])}
                      onChange={(event) => {
                        const value = Number(event.target.value);
                        if (!Number.isFinite(value)) return;

                        updateItem(active.uid, {
                          [field]:
                            field === "width" || field === "height"
                              ? Math.max(20, value)
                              : value,
                        });
                      }}
                      className="w-full rounded-lg border border-white/15 bg-[#0d1713] px-3 py-2.5 text-sm"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateItem(active.uid, { rotation: active.rotation - 15 })}
                  className="flex items-center justify-center gap-2 rounded-lg border border-white/15 p-3 text-xs"
                >
                  <RotateCcw size={15} /> -15°
                </button>
                <button
                  onClick={() => updateItem(active.uid, { rotation: active.rotation + 15 })}
                  className="flex items-center justify-center gap-2 rounded-lg border border-white/15 p-3 text-xs"
                >
                  <RotateCcw size={15} className="scale-x-[-1]" /> +15°
                </button>
                <button
                  onClick={duplicateItem}
                  className="flex items-center justify-center gap-2 rounded-lg border border-white/15 p-3 text-xs"
                >
                  <Copy size={15} /> Duplicate
                </button>
                <button
                  onClick={removeItem}
                  className="flex items-center justify-center gap-2 rounded-lg border border-red-400/25 p-3 text-xs text-red-300"
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-white/15 p-8 text-center text-sm leading-6 text-white/45">
              Select equipment on the canvas to edit its properties.
            </div>
          )}

          <div className="mt-9 border-t border-white/10 pt-6">
            <p className="text-xs uppercase tracking-widest text-white/45">
              Estimated Equipment Cost
            </p>
            <p className="mt-3 text-2xl font-semibold text-[#c8ae7d]">
              {currency(total)}
            </p>
            <p className="mt-2 text-xs leading-5 text-white/35">
              Demo prices only. Installation and taxes excluded.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
