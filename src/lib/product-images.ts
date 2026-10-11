export const PRODUCT_IMAGE_KEY = "golfspace-product-images-v1";

export type ProductImageMap = Record<string, string>;

export const PRODUCT_IDS = [
  "screen",
  "monitor",
  "mat",
  "projector",
  "sofa",
  "kiosk",
] as const;

export const VISUAL_PRODUCTS = [
  {
    id: "screen",
    name: "Impact Screen Pro",
    category: "Screens",
    description: "Commercial-grade projection enclosure",
    price: 4200000,
    color: "#557266",
  },
  {
    id: "monitor",
    name: "Launch Monitor X1",
    category: "Sensors",
    description: "Precision ball and club tracking",
    price: 7800000,
    color: "#829b96",
  },
  {
    id: "mat",
    name: "Performance Hitting Mat",
    category: "Hitting Mats",
    description: "Premium impact-absorbing turf",
    price: 950000,
    color: "#6f946b",
  },
  {
    id: "projector",
    name: "Laser Projector 4K",
    category: "Projectors",
    description: "High-brightness short-throw projection",
    price: 3100000,
    color: "#aab6b3",
  },
  {
    id: "sofa",
    name: "Lounge Seating",
    category: "Furniture",
    description: "Premium customer lounge seating",
    price: 1350000,
    color: "#b99d80",
  },
  {
    id: "kiosk",
    name: "Control Kiosk",
    category: "Controls",
    description: "Integrated touchscreen control station",
    price: 1850000,
    color: "#596f7e",
  },
];

export function getProductImages(): ProductImageMap {
  if (typeof window === "undefined") return {};

  try {
    const value = JSON.parse(
      localStorage.getItem(PRODUCT_IMAGE_KEY) || "{}"
    );

    return value && typeof value === "object" && !Array.isArray(value)
      ? value
      : {};
  } catch {
    return {};
  }
}

export function saveProductImage(id: string, dataUrl: string) {
  const images = getProductImages();
  images[id] = dataUrl;

  localStorage.setItem(
    PRODUCT_IMAGE_KEY,
    JSON.stringify(images)
  );

  window.dispatchEvent(new Event("golfspace-images-changed"));
}

export function removeProductImage(id: string) {
  const images = getProductImages();
  delete images[id];

  localStorage.setItem(
    PRODUCT_IMAGE_KEY,
    JSON.stringify(images)
  );

  window.dispatchEvent(new Event("golfspace-images-changed"));
}

export async function optimizeProductImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please upload an image file.");
  }

  if (file.size > 15 * 1024 * 1024) {
    throw new Error("Image must be smaller than 15 MB.");
  }

  const bitmap = await createImageBitmap(file);

  try {
    const maxSize = 960;
    const scale = Math.min(
      1,
      maxSize / Math.max(bitmap.width, bitmap.height)
    );

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not process image.");

    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    // PNG preserves transparent backgrounds.
    if (file.type === "image/png" || file.type === "image/webp") {
      return canvas.toDataURL("image/png");
    }

    return canvas.toDataURL("image/jpeg", 0.8);
  } finally {
    bitmap.close();
  }
}
