import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Drop, Wrench, Clock } from "@phosphor-icons/react";

const HERO_BG =
  "https://images.unsplash.com/photo-1581037417787-dda6c19e06ad?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxmcmVzaGx5JTIwc2VhbGVkJTIwYXNwaGFsdCUyMGRyaXZld2F5fGVufDB8fHx8MTc3ODY5NTY1OXww&ixlib=rb-4.1.0&q=85";

const SEAL_IMG =
  "https://images.unsplash.com/photo-1774296690468-4bfb6aec8c95?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwyfHxmcmVzaGx5JTIwc2VhbGVkJTIwYXNwaGFsdCUyMGRyaXZld2F5fGVufDB8fHx8MTc3ODY5NTY1OXww&ixlib=rb-4.1.0&q=85";

const CRACK_IMG =
  "https://images.unsplash.com/photo-1773118330236-d812832b5b71?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzN8MHwxfHNlYXJjaHwxfHxhc3BoYWx0JTIwY3JhY2slMjBmaWxsaW5nJTIwcmVwYWlyfGVufDB8fHx8MTc3ODY5NTY1OHww&ixlib=rb-4.1.0&q=85";

const FEATURES = [
  { icon: ShieldCheck, title: "Premium Sealants", body: "Commercial-grade coal-tar and asphalt emulsion. No big-box-store fillers." },
  { icon: Drop, title: "Weather-Proof", body: "Repels water, oil, gasoline, and UV damage. Extends pavement life 2-3×." },
  { icon: Wrench, title: "Satisfaction Guaranteed", body: "We don't leave until you're happy. If something isn't right, we make it right — full stop." },
  { icon: Clock, title: "Built To Last", body: "A proper sealcoat lasts 3-5 years. Quality crack filling lasts even longer. Real protection, not a paint job." },
];

export default function Home() {
  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section
        className="relative min-h-screen flex items-center pt-16 overflow-hidden grain"
        data-testid="hero-section"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${HERO_BG}')` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/75 to-black/95" aria-hidden />
        <div className="absolute inset-0 stripes-bg opacity-50" aria-hidden />

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 w-full">
          <div className="lg:col-span-8">
            <div className="overline fade-up" data-testid="hero-overline">
              Driveway Protection · Free Quotes
            </div>
            <h1
              className="brand-wordmark text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] leading-[0.85] mt-6 text-white fade-up fade-up-delay-1"
              data-testid="hero-title"
            >
              ARMOUR<br />
              YOUR <span className="text-yellow-400">DRIVE</span>.
            </h1>
            <p
              className="mt-8 text-lg sm:text-xl text-zinc-300 max-w-xl leading-relaxed fade-up fade-up-delay-2"
              data-testid="hero-subtitle"
            >
              Industrial sealcoating and crack filling that protects asphalt from
              water, UV, oil and time. Done right, the first time.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4 fade-up fade-up-delay-3">
              <Link to="/quote" className="btn-primary" data-testid="hero-cta-quote">
                Free Quote <ArrowRight size={18} weight="bold" />
              </Link>
              <Link to="/services" className="btn-ghost" data-testid="hero-cta-services">
                Our Services
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex lg:flex-col gap-6 lg:gap-0 lg:justify-end fade-up fade-up-delay-3">
            <div className="flex-1 border-l border-yellow-400/40 pl-5">
              <div className="brand-wordmark text-5xl text-yellow-400">3-5 yr</div>
              <div className="text-xs uppercase tracking-widest text-zinc-400 mt-1">Sealcoat lifespan</div>
            </div>
            <div className="flex-1 border-l border-yellow-400/40 pl-5 lg:mt-6">
              <div className="brand-wordmark text-5xl text-yellow-400">100%</div>
              <div className="text-xs uppercase tracking-widest text-zinc-400 mt-1">Satisfaction guaranteed</div>
            </div>
            <div className="flex-1 border-l border-yellow-400/40 pl-5 lg:mt-6">
              <div className="brand-wordmark text-5xl text-yellow-400">FREE</div>
              <div className="text-xs uppercase tracking-widest text-zinc-400 mt-1">Quotes always</div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="bg-yellow-400 border-y-2 border-yellow-500 overflow-hidden" data-testid="marquee-section">
        <div className="marquee-track py-5">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex shrink-0 items-center">
              {["DRIVEWAY SEALCOATING", "CRACK FILLING", "ASPHALT ARMOUR", "RESIDENTIAL · COMMERCIAL", "FREE QUOTES", "BUILT TO LAST"].map(
                (t) => (
                  <span
                    key={`${i}-${t}`}
                    className="brand-wordmark text-3xl text-black px-10 tracking-wide flex items-center"
                  >
                    {t}
                    <span className="inline-block w-2 h-2 bg-black ml-10" />
                  </span>
                )
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="bg-zinc-950 py-24 sm:py-32 px-6 md:px-10" data-testid="services-preview">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="overline">What we do</div>
              <h2 className="heading-display text-4xl sm:text-5xl md:text-6xl mt-4 font-bold text-white max-w-2xl">
                Two services. Done <span className="text-yellow-400">exceptionally</span>.
              </h2>
            </div>
            <Link to="/services" className="text-sm font-semibold tracking-[0.18em] uppercase text-yellow-400 hover:text-white inline-flex items-center gap-2" data-testid="see-all-services">
              All Services <ArrowRight size={16} weight="bold" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/services"
              className="group relative overflow-hidden border border-white/5 bg-zinc-900/50 hover:border-yellow-400/60 transition-colors duration-300 cursor-pointer block"
              data-testid="preview-card-sealcoating"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={SEAL_IMG}
                  alt="Driveway sealcoating"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-8">
                <div className="overline">01 — Service</div>
                <h3 className="brand-wordmark text-4xl mt-3 text-white group-hover:text-yellow-400 transition-colors">Driveway Sealcoating</h3>
                <p className="mt-4 text-zinc-400 leading-relaxed">
                  Premium asphalt emulsion sealcoat that locks out moisture, blocks UV,
                  and restores that fresh-paved jet-black finish.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More <ArrowRight size={14} weight="bold" />
                </div>
              </div>
            </Link>

            <Link
              to="/services"
              className="group relative overflow-hidden border border-white/5 bg-zinc-900/50 hover:border-yellow-400/60 transition-colors duration-300 cursor-pointer block"
              data-testid="preview-card-crackfilling"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={CRACK_IMG}
                  alt="Crack filling"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-8">
                <div className="overline">02 — Service</div>
                <h3 className="brand-wordmark text-4xl mt-3 text-white group-hover:text-yellow-400 transition-colors">Crack Filling</h3>
                <p className="mt-4 text-zinc-400 leading-relaxed">
                  Premium flexible crack sealant that moves with the pavement,
                  stopping small cracks before they become expensive failures.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More <ArrowRight size={14} weight="bold" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-black py-24 sm:py-32 px-6 md:px-10 relative overflow-hidden" data-testid="why-section">
        <div className="absolute inset-0 stripes-bg opacity-30 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <div className="overline">Why Asphalt Armour</div>
            <h2 className="heading-display text-4xl sm:text-5xl md:text-6xl mt-4 font-bold text-white">
              Hard work. <span className="text-yellow-400">Harder armour.</span>
            </h2>
            <p className="mt-6 text-zinc-400 text-lg leading-relaxed">
              We don't cut corners. We use premium materials, take prep seriously,
              and back every job with a 100% satisfaction guarantee. If you're not
              happy, we make it right.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-black p-8 hover:bg-zinc-950 transition-colors" data-testid={`feature-${f.title.toLowerCase().replace(/\s+/g, "-")}`}>
                  <Icon size={32} weight="bold" className="text-yellow-400" />
                  <h3 className="mt-6 text-xl font-bold text-white">{f.title}</h3>
                  <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{f.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BIG CTA */}
      <section className="bg-yellow-400 py-24 sm:py-32 px-6 md:px-10" data-testid="bottom-cta">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <h2 className="brand-wordmark text-5xl sm:text-7xl md:text-8xl text-black leading-[0.9] max-w-3xl">
            Ready to armour<br /> your driveway?
          </h2>
          <Link
            to="/quote"
            className="inline-flex items-center gap-3 bg-black text-yellow-400 font-bold uppercase tracking-[0.18em] text-sm px-10 py-5 hover:bg-zinc-900 transition-colors"
            data-testid="bottom-cta-button"
          >
            Get Free Quote <ArrowRight size={18} weight="bold" />
          </Link>
        </div>
      </section>
    </div>
  );
}
