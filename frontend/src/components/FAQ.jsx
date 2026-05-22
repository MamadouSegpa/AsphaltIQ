import { useState } from "react";
import { Plus, Minus } from "@phosphor-icons/react";
import { useLang } from "../lib/i18n";

export default function FAQ() {
  const { t } = useLang();
  const [open, setOpen] = useState(0); // first item open by default

  const items = [
    {
      q: t("How long does sealcoating last?", "Combien de temps dure un scellement?"),
      a: t(
        "A properly applied sealcoat lasts 3-5 years for residential driveways and 1-2 years for high-traffic commercial parking lots. We recommend re-sealing every 2-3 years for residential properties to maintain optimal protection.",
        "Un scellement bien appliqué dure de 3 à 5 ans pour les allées résidentielles et de 1 à 2 ans pour les stationnements commerciaux à fort trafic. Nous recommandons un re-scellement tous les 2 à 3 ans pour les résidences afin de maintenir une protection optimale."
      ),
    },
    {
      q: t("When can I drive on my driveway after sealcoating?", "Quand puis-je rouler sur mon allée après le scellement?"),
      a: t(
        "Light foot traffic is OK after 4-6 hours. Vehicle traffic should wait 24-48 hours depending on temperature and humidity. We'll give you exact timing the day of the job based on conditions.",
        "Une circulation piétonne légère est possible après 4 à 6 heures. Pour les véhicules, attendez 24 à 48 heures selon la température et l'humidité. Nous vous donnerons le timing exact le jour des travaux selon les conditions."
      ),
    },
    {
      q: t("What's the best time of year for sealcoating?", "Quelle est la meilleure période pour un scellement?"),
      a: t(
        "Late spring through early fall — when ground temperatures stay above 10°C (50°F) for at least 24 hours and no rain is forecast for 48 hours. In Montreal, that's typically May through September.",
        "De la fin du printemps au début de l'automne — quand la température au sol reste au-dessus de 10°C pendant au moins 24 heures et qu'aucune pluie n'est prévue pendant 48 heures. À Montréal, c'est généralement de mai à septembre."
      ),
    },
    {
      q: t("Do I need to clean my driveway before you arrive?", "Dois-je nettoyer mon allée avant votre arrivée?"),
      a: t(
        "No. Power-washing and debris removal are included in every sealcoating job — it's actually the most important step. Just remove parked vehicles, garbage cans, and any planters from the driveway the night before.",
        "Non. Le lavage à pression et le retrait des débris sont inclus dans tous nos contrats de scellement — c'est en fait l'étape la plus importante. Retirez simplement les véhicules, poubelles et pots de fleurs de l'allée la veille."
      ),
    },
    {
      q: t("Do you offer a satisfaction guarantee?", "Offrez-vous une garantie de satisfaction?"),
      a: t(
        "Yes — 100%. If something isn't right with the finished work, we come back and fix it. No questions, no upcharge. Our reputation depends on referrals, so making it right is non-negotiable.",
        "Oui — à 100%. Si quelque chose ne va pas avec le travail terminé, nous revenons le corriger. Aucune question, aucun supplément. Notre réputation dépend des références, alors corriger est non négociable."
      ),
    },
    {
      q: t("Do you serve commercial properties?", "Desservez-vous les propriétés commerciales?"),
      a: t(
        "Absolutely. We work with property managers, condo boards, retail plazas, and small business owners across Montreal West Island. Request a quote and mention it's a commercial property — we'll arrange an on-site visit.",
        "Absolument. Nous travaillons avec des gestionnaires immobiliers, des conseils de copropriété, des centres commerciaux et des PME dans l'Ouest-de-l'Île de Montréal. Demandez une soumission et mentionnez qu'il s'agit d'une propriété commerciale — nous organiserons une visite."
      ),
    },
  ];

  return (
    <section className="bg-white py-24 sm:py-32 px-6 md:px-10 border-t border-zinc-200" data-testid="faq-section">
      <div className="max-w-4xl mx-auto">
        <div className="overline">{t("Frequently Asked", "Questions Fréquentes")}</div>
        <h2 className="heading-display text-4xl sm:text-5xl md:text-6xl mt-4 font-bold text-zinc-900">
          {t("Got ", "Des ")}
          <span className="text-amber-600">{t("questions?", "questions?")}</span>
        </h2>
        <p className="mt-6 text-zinc-600 text-lg max-w-2xl">
          {t(
            "Honest answers to what most folks ask us. Don't see yours? Give us a call or send us a quick message.",
            "Des réponses honnêtes aux questions courantes. La vôtre n'y est pas? Appelez-nous ou envoyez-nous un message."
          )}
        </p>

        <div className="mt-12 border-t border-zinc-200" data-testid="faq-list">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="border-b border-zinc-200" data-testid={`faq-item-${i}`}>
                <button
                  className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  data-testid={`faq-toggle-${i}`}
                  aria-expanded={isOpen}
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-zinc-900 group-hover:text-amber-600 transition-colors">
                    {item.q}
                  </h3>
                  <div className="shrink-0 w-9 h-9 flex items-center justify-center border border-zinc-300 text-amber-600 group-hover:border-amber-500 transition-colors">
                    {isOpen ? <Minus size={18} weight="bold" /> : <Plus size={18} weight="bold" />}
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 pb-6" : "max-h-0"}`}
                  data-testid={`faq-answer-${i}`}
                >
                  <p className="text-zinc-700 leading-relaxed pr-12">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
