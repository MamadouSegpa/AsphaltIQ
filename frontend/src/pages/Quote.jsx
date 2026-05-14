import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import api, { formatApiErrorDetail } from "../lib/api";

const SERVICE_OPTIONS = [
  { value: "sealcoating", label: "Driveway Sealcoating" },
  { value: "crack_filling", label: "Crack Filling" },
  { value: "both", label: "Both Services" },
];

const PROPERTY_OPTIONS = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
];

export default function Quote() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    service_type: "sealcoating",
    property_type: "residential",
    square_footage: "",
    notes: "",
  });

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/quotes", form);
      setSubmitted(true);
      toast.success("Quote request received. We'll be in touch within 24 hours.");
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
          <div className="overline mt-8">Request Received</div>
          <h1 className="brand-wordmark text-5xl sm:text-6xl mt-4 text-zinc-900">
            Thanks, {form.name.split(" ")[0] || "friend"}.
          </h1>
          <p className="mt-6 text-zinc-700 text-lg">
            We've got your details. Expect a call or email at{" "}
            <span className="text-amber-600">{form.email}</span> within 24 hours
            with a transparent line-item quote.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <button
              className="btn-primary"
              onClick={() => navigate("/")}
              data-testid="back-home-btn"
            >
              Back to Home <ArrowRight size={18} weight="bold" />
            </button>
            <button
              className="btn-ghost"
              onClick={() => {
                setSubmitted(false);
                setForm({
                  name: "", email: "", phone: "", address: "",
                  service_type: "sealcoating", property_type: "residential",
                  square_footage: "", notes: "",
                });
              }}
              data-testid="submit-another-btn"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-100 min-h-screen pt-32 pb-24 px-6 md:px-10" data-testid="quote-page">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Side info */}
        <div className="lg:col-span-5">
          <div className="overline">Free Quote</div>
          <h1 className="brand-wordmark text-5xl sm:text-6xl md:text-7xl mt-4 text-zinc-900 leading-[0.9]">
            Tell us about <span className="text-amber-600">your drive.</span>
          </h1>
          <p className="mt-6 text-zinc-600 text-lg leading-relaxed">
            Fill in the form. We'll review, may swing by for a quick on-site look if
            needed, and get back to you within 24 hours with a transparent quote.
          </p>

          <div className="mt-12 space-y-6">
            {[
              ["No obligation, no pressure", "Quotes are free and there's never any pressure to book."],
              ["Honest line-item pricing", "You see exactly what you're paying for. No vague numbers."],
              ["Fast turnaround", "Most quotes returned within 24 hours, on-site visits within 48."],
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

        {/* Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={onSubmit}
            className="bg-stone-100 border border-zinc-200 p-8 sm:p-10 space-y-6"
            data-testid="quote-form"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="field-label" htmlFor="name">Full Name *</label>
                <input id="name" required className="field-input" value={form.name} onChange={update("name")} data-testid="quote-input-name" />
              </div>
              <div>
                <label className="field-label" htmlFor="phone">Phone *</label>
                <input id="phone" required type="tel" className="field-input" value={form.phone} onChange={update("phone")} data-testid="quote-input-phone" />
              </div>
            </div>

            <div>
              <label className="field-label" htmlFor="email">Email *</label>
              <input id="email" required type="email" className="field-input" value={form.email} onChange={update("email")} data-testid="quote-input-email" />
            </div>

            <div>
              <label className="field-label" htmlFor="address">Property Address *</label>
              <input id="address" required className="field-input" value={form.address} onChange={update("address")} data-testid="quote-input-address" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="field-label">Service Needed *</label>
                <div className="grid grid-cols-1 gap-2">
                  {SERVICE_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 px-4 py-3 border cursor-pointer transition-colors ${
                        form.service_type === opt.value
                          ? "border-yellow-400 bg-yellow-400/5"
                          : "border-zinc-300 hover:border-zinc-400"
                      }`}
                      data-testid={`quote-service-${opt.value}`}
                    >
                      <input
                        type="radio"
                        name="service_type"
                        value={opt.value}
                        checked={form.service_type === opt.value}
                        onChange={update("service_type")}
                        className="accent-yellow-400"
                      />
                      <span className="text-sm text-zinc-900">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="field-label">Property Type *</label>
                <div className="grid grid-cols-1 gap-2">
                  {PROPERTY_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 px-4 py-3 border cursor-pointer transition-colors ${
                        form.property_type === opt.value
                          ? "border-yellow-400 bg-yellow-400/5"
                          : "border-zinc-300 hover:border-zinc-400"
                      }`}
                      data-testid={`quote-property-${opt.value}`}
                    >
                      <input
                        type="radio"
                        name="property_type"
                        value={opt.value}
                        checked={form.property_type === opt.value}
                        onChange={update("property_type")}
                        className="accent-yellow-400"
                      />
                      <span className="text-sm text-zinc-900">{opt.label}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-6">
                  <label className="field-label" htmlFor="sqft">Approx. Sq. Footage</label>
                  <input id="sqft" className="field-input" placeholder="e.g. 1,200" value={form.square_footage} onChange={update("square_footage")} data-testid="quote-input-sqft" />
                </div>
              </div>
            </div>

            <div>
              <label className="field-label" htmlFor="notes">Additional Notes</label>
              <textarea
                id="notes"
                rows={4}
                className="field-input resize-none"
                placeholder="Cracks, oil stains, preferred timing, etc."
                value={form.notes}
                onChange={update("notes")}
                data-testid="quote-input-notes"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              data-testid="quote-submit-btn"
            >
              {submitting ? "Submitting…" : "Request Free Quote"}{" "}
              {!submitting && <ArrowRight size={18} weight="bold" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
