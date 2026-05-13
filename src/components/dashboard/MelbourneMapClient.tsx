"use client";

import dynamic from "next/dynamic";
import type { MelbourneMapData } from "./MelbourneMap";

const MelbourneMap = dynamic(
  () => import("./MelbourneMap").then((mod) => mod.MelbourneMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[460px] items-center justify-center rounded-sm border border-stone-300 bg-stone-50 text-sm text-stone-500">
        Loading map...
      </div>
    ),
  }
);

export type { MelbourneMapData } from "./MelbourneMap";

export default function MelbourneMapClient({ data }: { data: MelbourneMapData }) {
  return <MelbourneMap data={data} />;
}
