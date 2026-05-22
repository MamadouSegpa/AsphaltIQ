import { useState, useRef } from "react";
import { ArrowsHorizontal } from "@phosphor-icons/react";
import { useLang } from "../lib/i18n";

// Curated before/after image pairs from Unsplash (driveway / asphalt)
// Replace these URLs with your own before/after photos when ready.
const PAIRS = [
  {
    before:
      "https://images.unsplash.com/photo-1717419497032-d6a9d4ed8881?crop=entropy&cs=srgb&fm=jpg&ixid=M3w0NDA4ODh8MHwxfHNlYXJjaHwxfHxjcmFja2VkJTIwYXNwaGFsdCUyMGRyaXZld2F5JTIwYmVmb3JlfGVufDB8fHx8MTc3OTg2MDg3M3ww&ixlib=rb-4.1.0&q=85",
    after:
      "https://images.unsplash.com/photo-1774296690468-4bfb6aec8c95?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwyfHxmcmVzaGx5JTIwc2VhbGVkJTIwYXNwaGFsdCUyMGRyaXZld2F5fGVufDB8fHx8MTc3ODY5NTY1OXww&ixlib=rb-4.1.0&q=85",
    keyEN: "Residential — Pointe-Claire",
    keyFR: "Résidentiel — Pointe-Claire",
  },
  {
    before:
      "https://images.unsplash.com/photo-1773118330236-d812832b5b71?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzN8MHwxfHNlYXJjaHwxfHxhc3BoYWx0JTIwY3JhY2slMjBmaWxsaW5nJTIwcmVwYWlyfGVufDB8fHx8MTc3ODY5NTY1OHww&ixlib=rb-4.1.0&q=85",
    after:
      "https://images.unsplash.com/photo-1581037417787-dda6c19e06ad?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxmcmVzaGx5JTIwc2VhbGVkJTIwYXNwaGFsdCUyMGRyaXZld2F5fGVufDB8fHx8MTc3ODY5NTY1OXww&ixlib=rb-4.1.0&q=85",
    keyEN: "Crack repair + sealcoat — Beaconsfield",
    keyFR: "Réparation de fissures + scellement — Beaconsfield",
  },
];

function BeforeAfterSlider({ pair, label }) {
  const [pct, setPct] = useState(50);
  const wrap = useRef(null);
  const dragging = useRef(false);

  const move = (clientX) => {
    if (!wrap.current) return;
    const rect = wrap.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPct(Math.max(0, Math.min(100, x)));
  };

  const onMouseDown = (e) => {
    e.preventDefault();
    dragging.current = true;
    move(e.clientX);
    const onMove = (ev) => dragging.current && move(ev.clientX);
    const onUp = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const onTouchMove = (e) => move(e.touches[0].clientX);

  return (
    <div
      ref={wrap}
      className="relative aspect-[4/3] overflow-hidden select-none cursor-ew-resize bg-zinc-200 border border-zinc-200"
      onMouseDown={onMouseDown}
      onTouchMove={onTouchMove}
      data-testid="before-after-slider"
    >
      {/* AFTER (full image, bottom layer) */}
      <img src={pair.after} alt="After" className="absolute inset-0 w-full h-full object-cover pointer-events-none" draggable="false" />

      {/* BEFORE (clipped layer on top) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ width: `${pct}%` }}>
        <img
          src={pair.before}
          alt="Before"
          className="absolute inset-0 h-full object-cover"
          style={{ width: wrap.current ? `${wrap.current.clientWidth}px` : "100%", maxWidth: "none" }}
          draggable="false"
        />
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 text-white text-[10px] tracking-widest uppercase font-bold">
        Before
      </div>
      <div className="absolute top-3 right-3 px-2 py-1 bg-amber-500 text-black text-[10px] tracking-widest uppercase font-bold">
        After
      </div>

      {/* Drag handle */}
      <div
        className="absolute top-0 bottom-0 w-px bg-white pointer-events-none"
        style={{ left: `${pct}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-zinc-300 flex items-center justify-center shadow-lg">
          <ArrowsHorizontal size={18} weight="bold" className="text-zinc-900" />
        </div>
      </div>

      {/* Location label */}
      {label && (
        <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/70 text-white text-xs uppercase tracking-wider font-semibold">
          {label}
        </div>
      )}
    </div>
  );
}

export default function BeforeAfterGallery() {
  const { t, lang } = useLang();

  return (
    <section className="bg-stone-100 py-24 sm:py-32 px-6 md:px-10 border-t border-zinc-200" data-testid="gallery-section">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="overline">{t("Before & After", "Avant et Après")}</div>
            <h2 className="heading-display text-4xl sm:text-5xl md:text-6xl mt-4 font-bold text-zinc-900 max-w-2xl">
              {t("See the ", "Voyez la ")}
              <span className="text-amber-600">{t("difference.", "différence.")}</span>
            </h2>
          </div>
          <p className="text-zinc-600 max-w-md text-sm leading-relaxed">
            {t(
              "Drag the slider to compare. Same driveway, weeks apart. Real protection that lasts.",
              "Glissez le curseur pour comparer. Même allée, à quelques semaines d'intervalle. Une vraie protection durable."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="gallery-grid">
          {PAIRS.map((pair, i) => (
            <BeforeAfterSlider key={i} pair={pair} label={lang === "fr" ? pair.keyFR : pair.keyEN} />
          ))}
        </div>

        <p className="mt-6 text-xs text-zinc-500 italic">
          {t(
            "Photos shown as examples. Your results will look this good — or we'll come back and make it right.",
            "Photos à titre d'exemple. Vos résultats seront aussi beaux — sinon nous revenons les corriger."
          )}
        </p>
      </div>
    </section>
  );
}
