import { Link } from "react-router-dom";
import { ArrowRight, Check } from "@phosphor-icons/react";
import { useLang } from "../lib/i18n";
import BeforeAfterGallery from "../components/BeforeAfterGallery";

const SEAL_IMG =
  "https://images.unsplash.com/photo-1774296690468-4bfb6aec8c95?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwyfHxmcmVzaGx5JTIwc2VhbGVkJTIwYXNwaGFsdCUyMGRyaXZld2F5fGVufDB8fHx8MTc3ODY5NTY1OXww&ixlib=rb-4.1.0&q=85";
const CRACK_IMG =
  "https://images.unsplash.com/photo-1773118330236-d812832b5b71?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzN8MHwxfHNlYXJjaHwxfHxhc3BoYWx0JTIwY3JhY2slMjBmaWxsaW5nJTIwcmVwYWlyfGVufDB8fHx8MTc3ODY5NTY1OHww&ixlib=rb-4.1.0&q=85";

function ServiceBlock({ index, title, image, reverse, blurb, includes, ideal, t }) {
  return (
    <article
      className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
      data-testid={`service-block-${index}`}
    >
      <div className={`lg:col-span-6 ${reverse ? "lg:order-2" : ""}`}>
        <div className="overline">{index} — {t("Service", "Service")}</div>
        <h2 className="brand-wordmark text-5xl sm:text-6xl md:text-7xl mt-4 text-zinc-900 leading-[0.9]">{title}</h2>
        <p className="mt-6 text-zinc-700 text-lg leading-relaxed max-w-xl">{blurb}</p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          {includes.map((item) => (
            <div key={item} className="flex items-start gap-3">
              <Check size={20} weight="bold" className="text-amber-600 mt-0.5 shrink-0" />
              <span className="text-sm text-zinc-700">{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-10 border-l-2 border-amber-500 pl-5">
          <div className="overline mb-2">{t("Ideal For", "Idéal Pour")}</div>
          <div className="text-zinc-900">{ideal}</div>
        </div>

        <div className="mt-10">
          <Link to="/quote" className="btn-primary" data-testid={`service-cta-${index}`}>
            {t("Quote This Service", "Demander une Soumission")} <ArrowRight size={18} weight="bold" />
          </Link>
        </div>
      </div>

      <div className={`lg:col-span-6 ${reverse ? "lg:order-1" : ""}`}>
        <div className="aspect-[4/5] overflow-hidden border border-zinc-200">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      </div>
    </article>
  );
}

export default function Services() {
  const { t } = useLang();

  return (
    <div className="bg-stone-100" data-testid="services-page">
      <section className="pt-32 pb-16 px-6 md:px-10 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto">
          <div className="overline">{t("Our Services", "Nos Services")}</div>
          <h1 className="heading-display font-bold text-5xl sm:text-6xl md:text-7xl mt-4 text-zinc-900 max-w-4xl leading-[0.95]">
            {t("Two services. ", "Deux services. ")}
            <span className="text-amber-600">{t("Zero shortcuts.", "Zéro raccourci.")}</span>
          </h1>
          <p className="mt-6 text-zinc-600 text-lg max-w-2xl">
            {t(
              "We focus on what we do best — protecting and extending the life of asphalt driveways and parking lots with materials and methods that actually last.",
              "Nous nous concentrons sur ce que nous faisons de mieux — protéger et prolonger la vie des allées et stationnements en asphalte avec des matériaux et méthodes qui durent vraiment."
            )}
          </p>
        </div>
      </section>

      <section className="px-6 md:px-10 py-24 sm:py-32 space-y-32">
        <div className="max-w-7xl mx-auto">
          <ServiceBlock
            t={t}
            index="01"
            title={t("Driveway Sealcoating", "Scellement d'Allée")}
            image={SEAL_IMG}
            blurb={t(
              "Restore that deep, jet-black finish and lock out the weather. Our premium asphalt-emulsion sealcoat fortifies the surface against UV rays, water, gasoline, and freeze-thaw cycles — extending pavement life 2-3 times. Backed by our 100% satisfaction guarantee.",
              "Redonnez ce fini noir profond et bloquez les intempéries. Notre scellant premium en émulsion d'asphalte protège la surface contre les UV, l'eau, l'essence et les cycles de gel-dégel — prolongeant la vie de la chaussée de 2 à 3 fois. Avec notre garantie de satisfaction à 100%."
            )}
            includes={[
              t("Power-wash & debris removal", "Lavage à pression et retrait des débris"),
              t("Oil-spot primer treatment", "Traitement des taches d'huile"),
              t("Premium asphalt-emulsion sealant", "Scellant premium en émulsion d'asphalte"),
              t("Sand-traction additive (optional)", "Additif antidérapant au sable (optionnel)"),
              t("Lasts 3-5 years", "Dure de 3 à 5 ans"),
              t("100% satisfaction guaranteed", "Satisfaction garantie à 100%"),
            ]}
            ideal={t(
              "Driveways every 2-3 years, commercial parking lots every 1-2 years.",
              "Allées tous les 2 à 3 ans, stationnements commerciaux tous les 1 à 2 ans."
            )}
          />
        </div>

        <div className="max-w-7xl mx-auto">
          <ServiceBlock
            t={t}
            index="02"
            title={t("Crack Filling", "Remplissage de Fissures")}
            image={CRACK_IMG}
            reverse
            blurb={t(
              "Cracks are how water gets in. Water is how driveways die. We rout, clean, and fill cracks with premium flexible sealant that moves with the pavement through temperature swings — stopping small cracks before they become expensive replacements. Backed by our satisfaction guarantee.",
              "Les fissures laissent entrer l'eau. L'eau tue les allées. Nous taillons, nettoyons et remplissons les fissures avec un scellant flexible premium qui suit la chaussée à travers les variations de température — stoppant les petites fissures avant qu'elles ne deviennent des remplacements coûteux. Avec notre garantie de satisfaction."
            )}
            includes={[
              t("Crack routing & cleaning", "Taillage et nettoyage des fissures"),
              t("Premium flexible sealant", "Scellant flexible premium"),
              t("Squeegee finish for clean lines", "Finition à la raclette pour des lignes nettes"),
              t("Pre-sealcoat preparation", "Préparation avant scellement"),
              t("Up to 1\" wide cracks", "Fissures jusqu'à 2,5 cm de large"),
              t("Long-lasting protection", "Protection longue durée"),
            ]}
            ideal={t(
              "Any driveway with visible cracking — always done before sealcoating.",
              "Toute allée avec des fissures visibles — toujours fait avant le scellement."
            )}
          />
        </div>
      </section>

      <BeforeAfterGallery />

      <section className="bg-white border-t border-zinc-200 py-24 sm:py-32 px-6 md:px-10" data-testid="process-section">
        <div className="max-w-7xl mx-auto">
          <div className="overline">{t("How It Works", "Comment Ça Marche")}</div>
          <h2 className="heading-display text-4xl sm:text-5xl md:text-6xl mt-4 font-bold text-zinc-900 max-w-2xl">
            {t("Four steps. ", "Quatre étapes. ")}
            <span className="text-amber-600">{t("No surprises.", "Aucune surprise.")}</span>
          </h2>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-200">
            {[
              [t("Quote", "Soumission"), t("Submit your details, we visit, you get an honest line-item price within 24 hours.", "Soumettez vos infos, nous visitons, vous recevez un prix détaillé honnête en 24 heures.")],
              [t("Schedule", "Planification"), t("Pick a window. We work around dry-weather forecasts and your availability.", "Choisissez une plage horaire. Nous travaillons selon la météo et votre disponibilité.")],
              [t("Prep", "Préparation"), t("Power-wash, edge, oil-prime, fill cracks. The prep is the work.", "Lavage à pression, bordures, traitement, remplissage. La préparation, c'est le vrai travail.")],
              [t("Apply", "Application"), t("Two coats applied by hand and machine. Drying time clearly marked.", "Deux couches appliquées à la main et à la machine. Temps de séchage clairement indiqué.")],
            ].map(([title, body], i) => (
              <div key={i} className="bg-white p-8 hover:bg-stone-50 transition-colors" data-testid={`process-step-${i + 1}`}>
                <div className="brand-wordmark text-6xl text-amber-600 leading-none">0{i + 1}</div>
                <h3 className="mt-6 text-xl font-bold text-zinc-900">{title}</h3>
                <p className="mt-3 text-sm text-zinc-600 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-yellow-400 py-24 sm:py-32 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <h2 className="brand-wordmark text-5xl sm:text-7xl md:text-8xl text-black leading-[0.9] max-w-3xl">
            {t("See what your", "Découvrez le coût")}<br />
            {t("driveway costs.", "de votre allée.")}
          </h2>
          <Link
            to="/quote"
            className="inline-flex items-center gap-3 bg-zinc-900 text-yellow-400 font-bold uppercase tracking-[0.18em] text-sm px-10 py-5 hover:bg-black transition-colors"
            data-testid="services-bottom-cta"
          >
            {t("Get Free Quote", "Soumission Gratuite")} <ArrowRight size={18} weight="bold" />
          </Link>
        </div>
      </section>
    </div>
  );
}
