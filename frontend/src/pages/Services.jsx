import { Link } from "react-router-dom";
import { ArrowRight, Check } from "@phosphor-icons/react";

const SEAL_IMG =
  "https://images.unsplash.com/photo-1774296690468-4bfb6aec8c95?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwyfHxmcmVzaGx5JTIwc2VhbGVkJTIwYXNwaGFsdCUyMGRyaXZld2F5fGVufDB8fHx8MTc3ODY5NTY1OXww&ixlib=rb-4.1.0&q=85";

const CRACK_IMG =
  "https://images.unsplash.com/photo-1773118330236-d812832b5b71?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzN8MHwxfHNlYXJjaHwxfHxhc3BoYWx0JTIwY3JhY2slMjBmaWxsaW5nJTIwcmVwYWlyfGVufDB8fHx8MTc3ODY5NTY1OHww&ixlib=rb-4.1.0&q=85";

function ServiceBlock({ index, title, image, reverse, blurb, includes, ideal }) {
  return (
    <article
      className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
      data-testid={`service-block-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className={`lg:col-span-6 ${reverse ? "lg:order-2" : ""}`}>
        <div className="overline">{index} — Service</div>
        <h2 className="brand-wordmark text-5xl sm:text-6xl md:text-7xl mt-4 text-white leading-[0.9]">
          {title}
        </h2>
        <p className="mt-6 text-zinc-300 text-lg leading-relaxed max-w-xl">{blurb}</p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          {includes.map((item) => (
            <div key={item} className="flex items-start gap-3">
              <Check size={20} weight="bold" className="text-yellow-400 mt-0.5 shrink-0" />
              <span className="text-sm text-zinc-300">{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-10 border-l-2 border-yellow-400 pl-5">
          <div className="overline mb-2">Ideal For</div>
          <div className="text-zinc-200">{ideal}</div>
        </div>

        <div className="mt-10">
          <Link to="/quote" className="btn-primary" data-testid={`service-cta-${title.toLowerCase().replace(/\s+/g, "-")}`}>
            Quote This Service <ArrowRight size={18} weight="bold" />
          </Link>
        </div>
      </div>

      <div className={`lg:col-span-6 ${reverse ? "lg:order-1" : ""}`}>
        <div className="aspect-[4/5] overflow-hidden border border-white/10">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      </div>
    </article>
  );
}

export default function Services() {
  return (
    <div className="bg-black" data-testid="services-page">
      {/* HEADER */}
      <section className="pt-32 pb-16 px-6 md:px-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="overline">Our Services</div>
          <h1 className="heading-display font-bold text-5xl sm:text-6xl md:text-7xl mt-4 text-white max-w-4xl leading-[0.95]">
            Two services. <span className="text-yellow-400">Zero shortcuts.</span>
          </h1>
          <p className="mt-6 text-zinc-400 text-lg max-w-2xl">
            We focus on what we do best — protecting and extending the life of asphalt
            driveways and parking lots with materials and methods that actually last.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <section className="px-6 md:px-10 py-24 sm:py-32 space-y-32">
        <div className="max-w-7xl mx-auto">
          <ServiceBlock
            index="01"
            title="Driveway Sealcoating"
            image={SEAL_IMG}
            blurb="Restore that deep, jet-black finish and lock out the weather. Our premium asphalt-emulsion sealcoat fortifies the surface against UV rays, water, gasoline, and freeze-thaw cycles — extending pavement life 2-3 times. Backed by our 100% satisfaction guarantee."
            includes={[
              "Power-wash & debris removal",
              "Oil-spot primer treatment",
              "Premium asphalt-emulsion sealant",
              "Sand-traction additive (optional)",
              "Lasts 3-5 years",
              "100% satisfaction guaranteed",
            ]}
            ideal="Driveways every 2-3 years, commercial parking lots every 1-2 years."
          />
        </div>

        <div className="max-w-7xl mx-auto">
          <ServiceBlock
            index="02"
            title="Crack Filling"
            image={CRACK_IMG}
            reverse
            blurb="Cracks are how water gets in. Water is how driveways die. We rout, clean, and fill cracks with premium flexible sealant that moves with the pavement through temperature swings — stopping small cracks before they become expensive replacements. Backed by our satisfaction guarantee."
            includes={[
              "Crack routing & cleaning",
              "Premium flexible sealant",
              "Squeegee finish for clean lines",
              "Pre-sealcoat preparation",
              "Up to 1\" wide cracks",
              "Long-lasting protection",
            ]}
            ideal="Any driveway with visible cracking — always done before sealcoating."
          />
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-zinc-950 border-t border-white/5 py-24 sm:py-32 px-6 md:px-10" data-testid="process-section">
        <div className="max-w-7xl mx-auto">
          <div className="overline">How It Works</div>
          <h2 className="heading-display text-4xl sm:text-5xl md:text-6xl mt-4 font-bold text-white max-w-2xl">
            Four steps. <span className="text-yellow-400">No surprises.</span>
          </h2>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {[
              ["Quote", "Submit your details, we visit, you get an honest line-item price within 24 hours."],
              ["Schedule", "Pick a window. We work around dry-weather forecasts and your availability."],
              ["Prep", "Power-wash, edge, oil-prime, fill cracks. The prep is the work."],
              ["Apply", "Two coats applied by hand and machine. Drying time clearly marked."],
            ].map(([title, body], i) => (
              <div key={title} className="bg-black p-8 hover:bg-zinc-900 transition-colors" data-testid={`process-step-${i + 1}`}>
                <div className="brand-wordmark text-6xl text-yellow-400 leading-none">0{i + 1}</div>
                <h3 className="mt-6 text-xl font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-yellow-400 py-24 sm:py-32 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <h2 className="brand-wordmark text-5xl sm:text-7xl md:text-8xl text-black leading-[0.9] max-w-3xl">
            See what your<br /> driveway costs.
          </h2>
          <Link
            to="/quote"
            className="inline-flex items-center gap-3 bg-black text-yellow-400 font-bold uppercase tracking-[0.18em] text-sm px-10 py-5 hover:bg-zinc-900 transition-colors"
            data-testid="services-bottom-cta"
          >
            Get Free Quote <ArrowRight size={18} weight="bold" />
          </Link>
        </div>
      </section>
    </div>
  );
}
