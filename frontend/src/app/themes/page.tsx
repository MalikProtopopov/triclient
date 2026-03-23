"use client";

import { useState } from "react";

import { ClinicalAuraHome } from "./ClinicalAuraHome";
import { EditorialLuxeHome } from "./EditorialLuxeHome";
import { SwissPrecisionHome } from "./SwissPrecisionHome";

type VariantKey = "clinical-aura" | "editorial-luxe" | "swiss-precision";

const variants: { key: VariantKey; label: string; sublabel: string }[] = [
  { key: "clinical-aura", label: "Clinical Aura", sublabel: "Светлый, glassmorphism, bento-grid" },
  { key: "editorial-luxe", label: "Editorial Luxe", sublabel: "Премиум, serif, тёмный/светлый" },
  { key: "swiss-precision", label: "Swiss Precision", sublabel: "Минимализм, mono, flat" },
];

export default function ThemesPage() {
  const [active, setActive] = useState<VariantKey>("clinical-aura");

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="sticky top-0 z-[60] border-b border-[#e0e0e0] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <h1 className="mb-3 text-center text-xl font-bold text-[#4a4a4a]">
            Прототипы дизайна — выберите вариант
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

      <div>
        {active === "clinical-aura" && <ClinicalAuraHome />}
        {active === "editorial-luxe" && <EditorialLuxeHome />}
        {active === "swiss-precision" && <SwissPrecisionHome />}
      </div>
    </div>
  );
}
