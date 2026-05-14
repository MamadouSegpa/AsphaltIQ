import { useState } from "react";
import { toast } from "sonner";
import { Phone, EnvelopeSimple, MapPin, Clock, ArrowRight } from "@phosphor-icons/react";
import api, { formatApiErrorDetail } from "../lib/api";

export default function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/contact", form);
      toast.success("Message sent. We'll get back to you shortly.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-stone-100 min-h-screen pt-32 pb-24 px-6 md:px-10" data-testid="contact-page">
      <div className="max-w-7xl mx-auto">
        <div className="overline">Contact</div>
        <h1 className="brand-wordmark text-5xl sm:text-6xl md:text-7xl mt-4 text-zinc-900 leading-[0.9] max-w-4xl">
          Let's talk <span className="text-amber-600">pavement.</span>
        </h1>
        <p className="mt-6 text-zinc-600 text-lg max-w-2xl">
          Got a question, need a callback, or want to schedule an on-site look?
          Reach out — we usually reply same-day.
        </p>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* INFO */}
          <div className="lg:col-span-5 space-y-8">
            <div className="border border-zinc-200 p-8 bg-stone-100" data-testid="contact-info-phone">
              <Phone size={28} weight="bold" className="text-amber-600" />
              <div className="overline mt-6">Phone</div>
              <a href="tel:4384967111" className="block brand-wordmark text-4xl text-zinc-900 mt-2 hover:text-amber-600 transition-colors">
                (438) 496-7111
              </a>
              <p className="text-sm text-zinc-500 mt-2">Mon–Sat · 7am – 7pm</p>
            </div>

            <div className="border border-zinc-200 p-8 bg-stone-100" data-testid="contact-info-email">
              <EnvelopeSimple size={28} weight="bold" className="text-amber-600" />
              <div className="overline mt-6">Email</div>
              <a href="mailto:info@asphaltarmour.com" className="block text-2xl text-zinc-900 mt-2 hover:text-amber-600 transition-colors break-all">
                info@asphaltarmour.com
              </a>
              <p className="text-sm text-zinc-500 mt-2">Replies within 24 hours</p>
            </div>

            <div className="grid grid-cols-2 gap-px bg-white/10">
              <div className="bg-stone-100 p-6" data-testid="contact-info-area">
                <MapPin size={22} weight="bold" className="text-amber-600" />
                <div className="overline mt-4">Service Area</div>
                <div className="mt-2 text-sm text-zinc-900">Montreal West Island</div>
              </div>
              <div className="bg-stone-100 p-6" data-testid="contact-info-hours">
                <Clock size={22} weight="bold" className="text-amber-600" />
                <div className="overline mt-4">Hours</div>
                <div className="mt-2 text-sm text-zinc-900">Mon–Sat<br />7am – 7pm</div>
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="lg:col-span-7">
            <form
              onSubmit={onSubmit}
              className="bg-stone-100 border border-zinc-200 p-8 sm:p-10 space-y-6"
              data-testid="contact-form"
            >
              <div className="overline">Send a Message</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="c-name" className="field-label">Name *</label>
                  <input id="c-name" required className="field-input" value={form.name} onChange={update("name")} data-testid="contact-input-name" />
                </div>
                <div>
                  <label htmlFor="c-phone" className="field-label">Phone</label>
                  <input id="c-phone" type="tel" className="field-input" value={form.phone} onChange={update("phone")} data-testid="contact-input-phone" />
                </div>
              </div>

              <div>
                <label htmlFor="c-email" className="field-label">Email *</label>
                <input id="c-email" required type="email" className="field-input" value={form.email} onChange={update("email")} data-testid="contact-input-email" />
              </div>

              <div>
                <label htmlFor="c-message" className="field-label">Message *</label>
                <textarea
                  id="c-message"
                  required
                  rows={6}
                  className="field-input resize-none"
                  placeholder="How can we help?"
                  value={form.message}
                  onChange={update("message")}
                  data-testid="contact-input-message"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                data-testid="contact-submit-btn"
              >
                {submitting ? "Sending…" : "Send Message"}{" "}
                {!submitting && <ArrowRight size={18} weight="bold" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
