import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import api, { formatApiErrorDetail } from "../lib/api";
import { useLang } from "../lib/i18n";

export default function Quote() {
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "",
    service_type: "sealcoating", property_type: "residential",
    square_footage: "", notes: "",
  });

  const SERVICE_OPTIONS = [
    { value: "sealcoating", label: t("Driveway Sealcoating", "Scellement d'Allée") },
    { value: "crack_filling", label: t("Crack Filling", "Remplissage de Fissures") },
    { value: "both", label: t("Both Services", "Les Deux Services") },
  ];
  const PROPERTY_OPTIONS = [
    { value: "residential", label: t("Residential", "Résidentiel") },
    { value: "commercial", label: t("Commercial", "Commercial") },
  ];

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/quotes", { ...form, lang });
      setSubmitted(true);
      toast.success(t("Quote request received. We'll be in touch within 24 hours.", "Demande reçue. Nous vous contacterons dans les 24 heures."));
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-100 pt-32 pb-24 px-6 md:px-10 flex items-center" data-testid="quote-success">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle size={72} weight="duotone" className="text-amber-600 mx-auto" />
          <div className="overline mt-8">{t("Request Received", "Demande Reçue")}</div>
          <h1 className="brand-wordmark text-5xl sm:text-6xl mt-4 text-zinc-900">
            {t("Thanks,", "Merci,")} {form.name.split(" ")[0] || t("friend", "ami")}.
          </h1>
          <p className="mt-6 text-zinc-700 text-lg">
            {t("We've got your details. Expect a call or email at ", "Nous avons vos informations. Attendez un appel ou un courriel à ")}
            <span className="text-amber-600">{form.email}</span>
            {t(" within 24 hours with a transparent line-item quote.", " dans les 24 heures avec une soumission détaillée.")}
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <button className="btn-primary" onClick={() => navigate("/")} data-testid="back-home-btn">
              {t("Back to Home", "Retour à l'Accueil")} <ArrowRight size={18} weight="bold" />
            </button>
            <button
              className="btn-ghost"
              onClick={() => {
                setSubmitted(false);
                setForm({ name: "", email: "", phone: "", address: "", service_type: "sealcoating", property_type: "residential", square_footage: "", notes: "" });
              }}
              data-testid="submit-another-btn"
            >
              {t("Submit Another", "Soumettre une Autre")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-100 min-h-screen pt-32 pb-24 px-6 md:px-10" data-testid="quote-page">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="overline">{t("Free Quote", "Soumission Gratuite")}</div>
          <h1 className="brand-wordmark text-5xl sm:text-6xl md:text-7xl mt-4 text-zinc-900 leading-[0.9]">
            {t("Tell us about ", "Parlez-nous de ")}
            <span className="text-amber-600">{t("your drive.", "votre allée.")}</span>
          </h1>
          <p className="mt-6 text-zinc-600 text-lg leading-relaxed">
            {t(
              "Fill in the form. We'll review, may swing by for a quick on-site look if needed, and get back to you within 24 hours with a transparent quote.",
              "Remplissez le formulaire. Nous l'examinerons, passerons sur place si nécessaire, et vous reviendrons dans les 24 heures avec une soumission transparente."
            )}
          </p>

          <div className="mt-12 space-y-6">
            {[
              [t("No obligation, no pressure", "Sans obligation, sans pression"), t("Quotes are free and there's never any pressure to book.", "Les soumissions sont gratuites et sans pression.")],
              [t("Honest line-item pricing", "Prix détaillés et honnêtes"), t("You see exactly what you're paying for. No vague numbers.", "Vous voyez exactement ce que vous payez. Pas de chiffres flous.")],
              [t("Fast turnaround", "Délai rapide"), t("Most quotes returned within 24 hours, on-site visits within 48.", "Soumissions sous 24 heures, visites sur place sous 48 heures.")],
            ].map(([title, body]) => (
              <div key={title} className="flex items-start gap-4">
                <CheckCircle size={24} weight="duotone" className="text-amber-600 shrink-0 mt-1" />
                <div>
                  <div className="text-zinc-900 font-semibold">{title}</div>
                  <div className="text-sm text-zinc-600 mt-1">{body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7">
          <form onSubmit={onSubmit} className="bg-white border border-zinc-200 p-8 sm:p-10 space-y-6" data-testid="quote-form">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="field-label" htmlFor="name">{t("Full Name", "Nom Complet")} *</label>
                <input id="name" required className="field-input" value={form.name} onChange={update("name")} data-testid="quote-input-name" />
              </div>
              <div>
                <label className="field-label" htmlFor="phone">{t("Phone", "Téléphone")} *</label>
                <input id="phone" required type="tel" className="field-input" value={form.phone} onChange={update("phone")} data-testid="quote-input-phone" />
              </div>
            </div>

            <div>
              <label className="field-label" htmlFor="email">{t("Email", "Courriel")} *</label>
              <input id="email" required type="email" className="field-input" value={form.email} onChange={update("email")} data-testid="quote-input-email" />
            </div>

            <div>
              <label className="field-label" htmlFor="address">{t("Property Address", "Adresse de la Propriété")} *</label>
              <input id="address" required className="field-input" value={form.address} onChange={update("address")} data-testid="quote-input-address" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="field-label">{t("Service Needed", "Service Requis")} *</label>
                <div className="grid grid-cols-1 gap-2">
                  {SERVICE_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 px-4 py-3 border cursor-pointer transition-colors ${form.service_type === opt.value ? "border-amber-500 bg-amber-50" : "border-zinc-300 hover:border-zinc-400"}`}
                      data-testid={`quote-service-${opt.value}`}
                    >
                      <input type="radio" name="service_type" value={opt.value} checked={form.service_type === opt.value} onChange={update("service_type")} className="accent-amber-600" />
                      <span className="text-sm text-zinc-900">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="field-label">{t("Property Type", "Type de Propriété")} *</label>
                <div className="grid grid-cols-1 gap-2">
                  {PROPERTY_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 px-4 py-3 border cursor-pointer transition-colors ${form.property_type === opt.value ? "border-amber-500 bg-amber-50" : "border-zinc-300 hover:border-zinc-400"}`}
                      data-testid={`quote-property-${opt.value}`}
                    >
                      <input type="radio" name="property_type" value={opt.value} checked={form.property_type === opt.value} onChange={update("property_type")} className="accent-amber-600" />
                      <span className="text-sm text-zinc-900">{opt.label}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-6">
                  <label className="field-label" htmlFor="sqft">{t("Approx. Sq. Footage", "Superficie Approx. (pi²)")}</label>
                  <input id="sqft" className="field-input" placeholder={t("e.g. 1,200", "ex. 1 200")} value={form.square_footage} onChange={update("square_footage")} data-testid="quote-input-sqft" />
                </div>
              </div>
            </div>

            <div>
              <label className="field-label" htmlFor="notes">{t("Additional Notes", "Notes Supplémentaires")}</label>
              <textarea
                id="notes" rows={4} className="field-input resize-none"
                placeholder={t("Cracks, oil stains, preferred timing, etc.", "Fissures, taches d'huile, horaire préféré, etc.")}
                value={form.notes} onChange={update("notes")} data-testid="quote-input-notes"
              />
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed" data-testid="quote-submit-btn">
              {submitting ? t("Submitting…", "Envoi en cours…") : t("Request Free Quote", "Demander une Soumission Gratuite")}{" "}
              {!submitting && <ArrowRight size={18} weight="bold" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
