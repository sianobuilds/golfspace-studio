"use client";

import { useEffect, useState } from "react";
import { Image as KonvaImage } from "react-konva";
import {
  getProductImages,
  type ProductImageMap,
} from "@/lib/product-images";

type Props = {
  productId: string;
  width: number;
  height: number;
};

export default function EquipmentKonvaImage({
  productId,
  width,
  height,
}: Props) {
  const [urls, setUrls] = useState<ProductImageMap>({});
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const update = () => setUrls(getProductImages());
    update();

    window.addEventListener("storage", update);
    window.addEventListener("golfspace-images-changed", update);

    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("golfspace-images-changed", update);
    };
  }, []);

  const src = urls[productId];

  useEffect(() => {
    if (!src) {
      setImage(null);
      return;
    }

    let active = true;
    const img = new window.Image();

    img.onload = () => {
      if (active) setImage(img);
    };

    img.onerror = () => {
      if (active) setImage(null);
    };

    img.src = src;

    return () => {
      active = false;
    };
  }, [src]);

  if (!image || width <= 0 || height <= 0) return null;

  const padding = Math.min(width, height) * 0.08;
  const availableW = Math.max(1, width - padding * 2);
  const availableH = Math.max(1, height - padding * 2);

  const ratio = Math.min(
    availableW / image.width,
    availableH / image.height
  );

  const drawW = image.width * ratio;
  const drawH = image.height * ratio;

  return (
    <KonvaImage
      image={image}
      x={(width - drawW) / 2}
      y={(height - drawH) / 2}
      width={drawW}
      height={drawH}
      listening={false}
      shadowColor="#000000"
      shadowBlur={7}
      shadowOpacity={0.3}
    />
  );
}
