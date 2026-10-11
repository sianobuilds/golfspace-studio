"use client";

import dynamic from "next/dynamic";

const GolfEditor = dynamic(() => import("@/components/golf-editor"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[70vh] items-center justify-center text-white/50">
      Loading GolfSpace Studio...
    </div>
  ),
});

export default function StudioPage() {
  return <GolfEditor />;
}
