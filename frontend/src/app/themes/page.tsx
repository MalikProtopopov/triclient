"use client";

import { useState } from "react";

import { ClinicalElegance } from "./ClinicalElegance";
import { ModernMedical } from "./ModernMedical";
import { WarmProfessionalism } from "./WarmProfessionalism";

type VariantKey = "clinical" | "modern" | "warm";

const variants: { key: VariantKey; label: string; sublabel: string }[] = [
  { key: "clinical", label: "Клиническая элегантность", sublabel: "Clinical Elegance" },
  { key: "modern", label: "Современная медицина", sublabel: "Modern Medical" },
  { key: "warm", label: "Тёплый профессионализм", sublabel: "Warm Professionalism" },
];

export default function ThemesPage() {
  const [active, setActive] = useState<VariantKey>("clinical");

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="sticky top-0 z-50 border-b border-[#e0e0e0] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <h1 className="mb-3 text-center text-xl font-bold text-[#4a4a4a]">
            Ассоциация трихологов — Прототипы дизайна
          </h1>
          <div className="flex justify-center gap-2">
            {variants.map((v) => (
              <button
                key={v.key}
                onClick={() => setActive(v.key)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                  active === v.key
                    ? "bg-[#edbecc] text-[#4a4a4a] shadow-md"
                    : "bg-white text-[#808080] hover:bg-[#edbecc]/20 hover:text-[#4a4a4a]"
                }`}
              >
                <span className="block">{v.label}</span>
                <span className="block text-[10px] opacity-60">{v.sublabel}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {active === "clinical" && <ClinicalElegance />}
        {active === "modern" && <ModernMedical />}
        {active === "warm" && <WarmProfessionalism />}
      </div>
    </div>
  );
}
