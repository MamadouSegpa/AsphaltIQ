import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Drop, Wrench, Clock } from "@phosphor-icons/react";
import { useLang } from "../lib/i18n";
import FAQ from "../components/FAQ";

const HERO_BG =
  "https://images.unsplash.com/photo-1581037417787-dda6c19e06ad?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxmcmVzaGx5JTIwc2VhbGVkJTIwYXNwaGFsdCUyMGRyaXZld2F5fGVufDB8fHx8MTc3ODY5NTY1OXww&ixlib=rb-4.1.0&q=85";
const SEAL_IMG =
  "https://images.unsplash.com/photo-1774296690468-4bfb6aec8c95?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwyfHxmcmVzaGx5JTIwc2VhbGVkJTIwYXNwaGFsdCUyMGRyaXZld2F5fGVufDB8fHx8MTc3ODY5NTY1OXww&ixlib=rb-4.1.0&q=85";
const CRACK_IMG =
  "https://images.unsplash.com/photo-1773118330236-d812832b5b71?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzN8MHwxfHNlYXJjaHwxfHxhc3BoYWx0JTIwY3JhY2slMjBmaWxsaW5nJTIwcmVwYWlyfGVufDB8fHx8MTc3ODY5NTY1OHww&ixlib=rb-4.1.0&q=85";

export default function Home() {
  const { t } = useLang();
  const FEATURES = [
    {
      icon: ShieldCheck,
      title: t("Premium Sealants", "Scellants Premium"),
      body: t(
        "Commercial-grade coal-tar and asphalt emulsion. No big-box-store fillers.",
        "Émulsion d'asphalte de qualité commerciale. Aucun produit bas de gamme."
      ),
    },
    {
      icon: Drop,
      title: t("Weather-Proof", "Résistant aux Intempéries"),
      body: t(
        "Repels water, oil, gasoline, and UV damage. Extends pavement life 2-3×.",
        "Repousse l'eau, l'huile, l'essence et les UV. Prolonge la vie de la chaussée de 2 à 3 fois."
      ),
    },
    {
      icon: Wrench,
      title: t("Satisfaction Guaranteed", "Satisfaction Garantie"),
      body: t(
        "We don't leave until you're happy. If something isn't right, we make it right — full stop.",
        "Nous ne partons pas avant que vous soyez satisfait. Si quelque chose cloche, nous le corrigeons. Point final."
      ),
    },
    {
      icon: Clock,
      title: t("Built To Last", "Conçu Pour Durer"),
      body: t(
        "A proper sealcoat lasts 3-5 years. Quality crack filling lasts even longer. Real protection, not a paint job.",
        "Un bon scellement dure de 3 à 5 ans. Un remplissage de fissures de qualité dure encore plus. Une vraie protection, pas une peinture."
      ),
    },
  ];

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
            <div className="overline fade-up !text-amber-400" data-testid="hero-overline">
              {t("Driveway Protection · Free Quotes", "Protection des allées · Soumissions gratuites")}
            </div>
            <h1
              className="brand-wordmark text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] leading-[0.85] mt-6 text-white fade-up fade-up-delay-1"
              data-testid="hero-title"
            >
              {t("SMARTER", "ENTRETIEN")}<br />
              {t("ASPHALT", "INTELLIGENT")} <span className="text-amber-400">{t("CARE", "DE L'ASPHALTE")}</span>.
            </h1>
            <p
              className="mt-8 text-lg sm:text-xl text-zinc-200 max-w-xl leading-relaxed fade-up fade-up-delay-2"
              data-testid="hero-subtitle"
            >
              {t(
                "Smarter sealcoating and crack filling that protects asphalt from water, UV, oil and time. Done right, the first time.",
                "Un scellement et un remplissage de fissures intelligents qui protègent votre asphalte de l'eau, des UV, de l'huile et du temps. Fait correctement, dès la première fois."
              )}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4 fade-up fade-up-delay-3">
              <Link to="/quote" className="btn-primary" data-testid="hero-cta-quote">
                {t("Free Quote", "Soumission Gratuite")} <ArrowRight size={18} weight="bold" />
              </Link>
              <Link to="/services" className="btn-ghost !text-white !border-white/20 hover:!bg-white/5" data-testid="hero-cta-services">
                {t("Our Services", "Nos Services")}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex lg:flex-col gap-6 lg:gap-0 lg:justify-end fade-up fade-up-delay-3">
            <div className="flex-1 border-l border-amber-500 pl-5">
              <div className="brand-wordmark text-5xl text-amber-400">3-5 yr</div>
              <div className="text-xs uppercase tracking-widest text-zinc-300 mt-1">
                {t("Sealcoat lifespan", "Durée du scellement")}
              </div>
            </div>
            <div className="flex-1 border-l border-amber-500 pl-5 lg:mt-6">
              <div className="brand-wordmark text-5xl text-amber-400">100%</div>
              <div className="text-xs uppercase tracking-widest text-zinc-300 mt-1">
                {t("Satisfaction guaranteed", "Satisfaction garantie")}
              </div>
            </div>
            <div className="flex-1 border-l border-amber-500 pl-5 lg:mt-6">
              <div className="brand-wordmark text-5xl text-amber-400">{t("FREE", "GRATUIT")}</div>
              <div className="text-xs uppercase tracking-widest text-zinc-300 mt-1">
                {t("Quotes always", "Soumissions toujours")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="bg-yellow-400 border-y-2 border-yellow-500 overflow-hidden" data-testid="marquee-section">
        <div className="marquee-track py-5">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex shrink-0 items-center">
              {[
                t("DRIVEWAY SEALCOATING", "SCELLEMENT D'ALLÉE"),
                t("CRACK FILLING", "REMPLISSAGE DE FISSURES"),
                "ASPHALTIQ",
                t("RESIDENTIAL · COMMERCIAL", "RÉSIDENTIEL · COMMERCIAL"),
                t("FREE QUOTES", "SOUMISSIONS GRATUITES"),
                t("BUILT TO LAST", "CONÇU POUR DURER"),
              ].map((tx, j) => (
                <span key={`${i}-${j}`} className="brand-wordmark text-3xl text-black px-10 tracking-wide flex items-center">
                  {tx}
                  <span className="inline-block w-2 h-2 bg-black ml-10" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="bg-stone-100 py-24 sm:py-32 px-6 md:px-10" data-testid="services-preview">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="overline">{t("What we do", "Ce que nous faisons")}</div>
              <h2 className="heading-display text-4xl sm:text-5xl md:text-6xl mt-4 font-bold text-zinc-900 max-w-2xl">
                {t("Two services. Done ", "Deux services. Faits ")}
                <span className="text-amber-600">{t("exceptionally", "exceptionnellement")}</span>.
              </h2>
            </div>
            <Link to="/services" className="text-sm font-semibold tracking-[0.18em] uppercase text-amber-600 hover:text-zinc-900 inline-flex items-center gap-2" data-testid="see-all-services">
              {t("All Services", "Tous les Services")} <ArrowRight size={16} weight="bold" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/services"
              className="group relative overflow-hidden border border-zinc-200 bg-white hover:border-amber-500 transition-colors duration-300 cursor-pointer block"
              data-testid="preview-card-sealcoating"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={SEAL_IMG} alt={t("Driveway sealcoating", "Scellement d'allée")} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-8">
                <div className="overline">01 — {t("Service", "Service")}</div>
                <h3 className="brand-wordmark text-4xl mt-3 text-zinc-900 group-hover:text-amber-600 transition-colors">
                  {t("Driveway Sealcoating", "Scellement d'Allée")}
                </h3>
                <p className="mt-4 text-zinc-600 leading-relaxed">
                  {t(
                    "Premium asphalt emulsion sealcoat that locks out moisture, blocks UV, and restores that fresh-paved jet-black finish.",
                    "Scellant premium en émulsion d'asphalte qui bloque l'humidité et les UV, et redonne ce fini noir jais comme neuf."
                  )}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {t("Learn More", "En Savoir Plus")} <ArrowRight size={14} weight="bold" />
                </div>
              </div>
            </Link>

            <Link
              to="/services"
              className="group relative overflow-hidden border border-zinc-200 bg-white hover:border-amber-500 transition-colors duration-300 cursor-pointer block"
              data-testid="preview-card-crackfilling"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={CRACK_IMG} alt={t("Crack filling", "Remplissage de fissures")} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-8">
                <div className="overline">02 — {t("Service", "Service")}</div>
                <h3 className="brand-wordmark text-4xl mt-3 text-zinc-900 group-hover:text-amber-600 transition-colors">
                  {t("Crack Filling", "Remplissage de Fissures")}
                </h3>
                <p className="mt-4 text-zinc-600 leading-relaxed">
                  {t(
                    "Premium flexible crack sealant that moves with the pavement, stopping small cracks before they become expensive failures.",
                    "Scellant flexible premium qui suit les mouvements de la chaussée, stoppant les petites fissures avant qu'elles ne deviennent coûteuses."
                  )}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {t("Learn More", "En Savoir Plus")} <ArrowRight size={14} weight="bold" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-stone-100 py-24 sm:py-32 px-6 md:px-10 relative overflow-hidden" data-testid="why-section">
        <div className="absolute inset-0 stripes-bg opacity-30 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <div className="overline">{t("Why Asphaltiq", "Pourquoi Asphaltiq")}</div>
            <h2 className="heading-display text-4xl sm:text-5xl md:text-6xl mt-4 font-bold text-zinc-900">
              {t("Hard work. ", "Travail acharné. ")}
              <span className="text-amber-600">{t("Smarter armour.", "Protection intelligente.")}</span>
            </h2>
            <p className="mt-6 text-zinc-600 text-lg leading-relaxed">
              {t(
                "We don't cut corners. We use premium materials, take prep seriously, and back every job with a 100% satisfaction guarantee. If you're not happy, we make it right.",
                "Aucun raccourci. Des matériaux premium, une préparation minutieuse, et une garantie de satisfaction à 100% sur chaque chantier. Si vous n'êtes pas satisfait, nous le corrigeons."
              )}
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-200">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-white p-8 hover:bg-stone-50 transition-colors" data-testid={`feature-${f.title.toLowerCase().replace(/\s+/g, "-")}`}>
                  <Icon size={32} weight="bold" className="text-amber-600" />
                  <h3 className="mt-6 text-xl font-bold text-zinc-900">{f.title}</h3>
                  <p className="mt-3 text-sm text-zinc-600 leading-relaxed">{f.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* BIG CTA */}
      <section className="bg-yellow-400 py-24 sm:py-32 px-6 md:px-10" data-testid="bottom-cta">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <h2 className="brand-wordmark text-5xl sm:text-7xl md:text-8xl text-black leading-[0.9] max-w-3xl">
            {t("Ready to seal", "Prêt à sceller")}<br />
            {t("your driveway?", "votre allée?")}
          </h2>
          <Link
            to="/quote"
            className="inline-flex items-center gap-3 bg-zinc-900 text-yellow-400 font-bold uppercase tracking-[0.18em] text-sm px-10 py-5 hover:bg-black transition-colors"
            data-testid="bottom-cta-button"
          >
            {t("Get Free Quote", "Soumission Gratuite")} <ArrowRight size={18} weight="bold" />
          </Link>
        </div>
      </section>
    </div>
  );
}
