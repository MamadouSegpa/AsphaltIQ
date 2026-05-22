"""Email notification helpers using Resend.

Fire-and-forget — failures are logged but never raised.
"""
import os
import asyncio
import logging
import resend

logger = logging.getLogger(__name__)


def _configure():
    api_key = os.environ.get("RESEND_API_KEY")
    if not api_key:
        return False
    resend.api_key = api_key
    return True


def _logo_url() -> str:
    base = os.environ.get("FRONTEND_URL", "").rstrip("/")
    if not base:
        return ""
    return f"{base}/wordmark-dark.png"


async def _send(subject: str, html: str, to: str | None = None):
    if not _configure():
        logger.info("Resend not configured; skipping email")
        return
    sender = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
    recipient = to or os.environ.get("NOTIFICATION_EMAIL")
    if not recipient:
        logger.info("recipient not set; skipping email")
        return
    params = {"from": sender, "to": [recipient], "subject": subject, "html": html}
    reply_to = os.environ.get("REPLY_TO_EMAIL")
    if reply_to:
        params["reply_to"] = reply_to
    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Email sent to {recipient}: {result.get('id') if isinstance(result, dict) else result}")
    except Exception as e:
        logger.error(f"Failed to send email to {recipient}: {e}")


# ---------------------------------------------------------------------------
# INTERNAL (admin) notification rows
# ---------------------------------------------------------------------------
def _row(label, value):
    if value is None or value == "":
        return ""
    return (
        f'<tr><td style="padding:6px 12px;font-family:Arial,sans-serif;font-size:13px;'
        f'color:#666;border-bottom:1px solid #eee;width:140px;">{label}</td>'
        f'<td style="padding:6px 12px;font-family:Arial,sans-serif;font-size:14px;'
        f'color:#111;border-bottom:1px solid #eee;">{value}</td></tr>'
    )


async def send_quote_notification(quote: dict):
    service_label = quote.get("service_type", "").replace("_", " ").title()
    property_label = quote.get("property_type", "").title()
    rows = (
        _row("Name", quote.get("name"))
        + _row("Email", f'<a href="mailto:{quote.get("email")}">{quote.get("email")}</a>')
        + _row("Phone", f'<a href="tel:{quote.get("phone")}">{quote.get("phone")}</a>')
        + _row("Address", quote.get("address"))
        + _row("Service", service_label)
        + _row("Property", property_label)
        + _row("Sq. Footage", quote.get("square_footage"))
        + _row("Notes", quote.get("notes"))
        + _row("Language", (quote.get("lang") or "en").upper())
    )
    html = f"""
    <div style="background:#0a0a0a;padding:32px;font-family:Arial,sans-serif;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;">
        <div style="background:#facc15;padding:20px 24px;">
          <div style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#000;font-weight:700;">New Quote Request</div>
          <div style="font-size:22px;font-weight:800;color:#000;margin-top:4px;">AsphaltIQ</div>
        </div>
        <table style="width:100%;border-collapse:collapse;">{rows}</table>
        <div style="padding:20px 24px;font-size:12px;color:#666;background:#f7f7f7;">
          View &amp; manage this lead in your admin dashboard.
        </div>
      </div>
    </div>
    """
    await _send(f"New Quote Request — {quote.get('name')}", html)


async def send_contact_notification(contact: dict):
    rows = (
        _row("Name", contact.get("name"))
        + _row("Email", f'<a href="mailto:{contact.get("email")}">{contact.get("email")}</a>')
        + (_row("Phone", f'<a href="tel:{contact.get("phone")}">{contact.get("phone")}</a>') if contact.get("phone") else "")
        + _row("Message", str(contact.get("message", "")).replace("\n", "<br>"))
        + _row("Language", (contact.get("lang") or "en").upper())
    )
    html = f"""
    <div style="background:#0a0a0a;padding:32px;font-family:Arial,sans-serif;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;">
        <div style="background:#facc15;padding:20px 24px;">
          <div style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#000;font-weight:700;">New Contact Message</div>
          <div style="font-size:22px;font-weight:800;color:#000;margin-top:4px;">AsphaltIQ</div>
        </div>
        <table style="width:100%;border-collapse:collapse;">{rows}</table>
      </div>
    </div>
    """
    await _send(f"New Contact Message — {contact.get('name')}", html)


# ---------------------------------------------------------------------------
# CUSTOMER AUTO-REPLY EMAILS (EN / FR)
# ---------------------------------------------------------------------------
_PHONE = "(438) 496-7111"
_EMAIL = "info@asphaltiq.ca"

_TXT = {
    "en": {
        "quote_subject": "Thanks — we received your quote request | AsphaltIQ",
        "contact_subject": "Thanks — we received your message | AsphaltIQ",
        "preheader_quote": "We'll be in touch within 24 hours with your free quote.",
        "preheader_contact": "We've received your message and will reply shortly.",
        "hi": "Hi",
        "thanks_quote": "Thanks for reaching out. We've received your request for a free quote and one of us will be in touch within <strong>24 hours</strong>.",
        "thanks_contact": "Thanks for your message. We've received it and we'll get back to you <strong>same-day</strong> whenever possible (within 24 hours at the latest).",
        "summary_title": "Your submission",
        "service_label": "Service",
        "property_label": "Property type",
        "address_label": "Address",
        "sqft_label": "Approx. sq. footage",
        "notes_label": "Notes",
        "message_label": "Your message",
        "phone_label": "Phone",
        "what_next": "What's next?",
        "next_quote": "We'll review your details, may swing by for a quick on-site look if needed, then send you a transparent line-item quote — no obligation, no pressure.",
        "next_contact": "We'll review your message and reply by email or phone. If your question is urgent, feel free to call us directly.",
        "questions": "Got a question in the meantime?",
        "call_us": "Call us at",
        "email_us": "Email us at",
        "thanks_closing": "Thanks again,",
        "team": "The AsphaltIQ Team",
        "footer_tagline": "Smarter asphalt care · Montreal West Island",
        "auto_note": "This is an automated confirmation. Please do not reply directly to this email.",
        "service_sealcoating": "Driveway Sealcoating",
        "service_crack_filling": "Crack Filling",
        "service_both": "Sealcoating + Crack Filling",
        "prop_residential": "Residential",
        "prop_commercial": "Commercial",
    },
    "fr": {
        "quote_subject": "Merci — nous avons reçu votre demande de soumission | AsphaltIQ",
        "contact_subject": "Merci — nous avons reçu votre message | AsphaltIQ",
        "preheader_quote": "Nous vous contacterons dans les 24 heures avec votre soumission gratuite.",
        "preheader_contact": "Nous avons reçu votre message et vous répondrons sous peu.",
        "hi": "Bonjour",
        "thanks_quote": "Merci d'avoir pris contact. Nous avons reçu votre demande de soumission gratuite et nous communiquerons avec vous dans les <strong>24 heures</strong>.",
        "thanks_contact": "Merci pour votre message. Nous l'avons bien reçu et vous répondrons <strong>le jour même</strong> autant que possible (dans les 24 heures au plus tard).",
        "summary_title": "Votre demande",
        "service_label": "Service",
        "property_label": "Type de propriété",
        "address_label": "Adresse",
        "sqft_label": "Superficie approx.",
        "notes_label": "Notes",
        "message_label": "Votre message",
        "phone_label": "Téléphone",
        "what_next": "Et ensuite?",
        "next_quote": "Nous étudierons vos informations, passerons sur place si nécessaire, puis vous enverrons une soumission détaillée et transparente — sans obligation, sans pression.",
        "next_contact": "Nous examinerons votre message et vous répondrons par courriel ou téléphone. Si votre question est urgente, n'hésitez pas à nous appeler directement.",
        "questions": "Une question entre-temps?",
        "call_us": "Appelez-nous au",
        "email_us": "Écrivez-nous à",
        "thanks_closing": "Merci encore,",
        "team": "L'équipe AsphaltIQ",
        "footer_tagline": "Entretien intelligent de l'asphalte · Ouest-de-l'Île de Montréal",
        "auto_note": "Ceci est une confirmation automatique. Merci de ne pas répondre directement à ce courriel.",
        "service_sealcoating": "Scellement d'allée",
        "service_crack_filling": "Remplissage de fissures",
        "service_both": "Scellement + Remplissage de fissures",
        "prop_residential": "Résidentiel",
        "prop_commercial": "Commercial",
    },
}


def _txt(lang: str) -> dict:
    return _TXT.get((lang or "en").lower(), _TXT["en"])


def _email_shell(preheader: str, body_html: str, lang: str) -> str:
    """Outer email template — clean white card on light grey background."""
    t = _txt(lang)
    logo = _logo_url()
    logo_html = (
        f'<img src="{logo}" alt="AsphaltIQ" width="220" style="display:block;width:220px;max-width:60%;height:auto;border:0;outline:none;text-decoration:none;" />'
        if logo
        else '<div style="font-family:Arial,sans-serif;font-size:28px;font-weight:800;color:#18181b;letter-spacing:0.5px;">asphalt<span style="color:#d97706;">IQ</span></div>'
    )
    return f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>AsphaltIQ</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#18181b;">
  <!-- preheader (hidden) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#f5f5f4;opacity:0;">{preheader}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f4;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e7e5e4;">
          <!-- Logo header -->
          <tr>
            <td style="padding:36px 40px 24px 40px;border-bottom:1px solid #f1f1ef;">
              {logo_html}
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 8px 40px;">
              {body_html}
            </td>
          </tr>

          <!-- Yellow band CTA -->
          <tr>
            <td style="padding:24px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#facc15;">
                <tr>
                  <td style="padding:20px 24px;">
                    <div style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#000;font-weight:700;">{t["questions"]}</div>
                    <div style="margin-top:8px;font-size:16px;color:#000;line-height:1.5;">
                      📞 <a href="tel:4384967111" style="color:#000;text-decoration:underline;font-weight:700;">{_PHONE}</a>
                      &nbsp;·&nbsp;
                      ✉️ <a href="mailto:{_EMAIL}" style="color:#000;text-decoration:underline;font-weight:700;">{_EMAIL}</a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 36px 40px;border-top:1px solid #f1f1ef;text-align:center;">
              <div style="font-size:13px;color:#71717a;font-weight:600;letter-spacing:0.5px;">{t["footer_tagline"]}</div>
              <div style="margin-top:10px;font-size:11px;color:#a1a1aa;line-height:1.5;">{t["auto_note"]}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""


def _kv(label: str, value: str) -> str:
    return (
        f'<tr><td style="padding:10px 0;border-bottom:1px solid #f1f1ef;font-size:12px;color:#71717a;letter-spacing:1.5px;text-transform:uppercase;font-weight:600;width:40%;vertical-align:top;">{label}</td>'
        f'<td style="padding:10px 0;border-bottom:1px solid #f1f1ef;font-size:15px;color:#18181b;vertical-align:top;">{value}</td></tr>'
    )


def _service_label(t: dict, code: str) -> str:
    return {
        "sealcoating": t["service_sealcoating"],
        "crack_filling": t["service_crack_filling"],
        "both": t["service_both"],
    }.get(code, code)


def _prop_label(t: dict, code: str) -> str:
    return {"residential": t["prop_residential"], "commercial": t["prop_commercial"]}.get(code, code)


async def send_quote_autoreply(quote: dict):
    lang = (quote.get("lang") or "en").lower()
    t = _txt(lang)
    first_name = (quote.get("name") or "").split(" ")[0] or t["hi"]

    rows = (
        _kv(t["service_label"], _service_label(t, quote.get("service_type", "")))
        + _kv(t["property_label"], _prop_label(t, quote.get("property_type", "")))
        + _kv(t["address_label"], quote.get("address") or "—")
        + (_kv(t["sqft_label"], quote.get("square_footage")) if quote.get("square_footage") else "")
        + (_kv(t["notes_label"], (quote.get("notes") or "").replace("\n", "<br>")) if quote.get("notes") else "")
    )

    body = f"""
      <h1 style="margin:0;font-size:28px;line-height:1.2;color:#18181b;font-weight:800;">
        {t["hi"]} {first_name},
      </h1>
      <p style="margin:18px 0 0 0;font-size:16px;line-height:1.6;color:#3f3f46;">
        {t["thanks_quote"]}
      </p>

      <div style="margin-top:32px;padding-top:8px;">
        <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#d97706;font-weight:700;">
          {t["summary_title"]}
        </div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;border-top:1px solid #f1f1ef;">
          {rows}
        </table>
      </div>

      <div style="margin-top:32px;">
        <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#d97706;font-weight:700;">
          {t["what_next"]}
        </div>
        <p style="margin:8px 0 0 0;font-size:15px;line-height:1.6;color:#3f3f46;">
          {t["next_quote"]}
        </p>
      </div>

      <p style="margin:36px 0 4px 0;font-size:15px;color:#3f3f46;">{t["thanks_closing"]}</p>
      <p style="margin:0;font-size:15px;color:#18181b;font-weight:700;">{t["team"]}</p>
    """
    html = _email_shell(t["preheader_quote"], body, lang)
    await _send(t["quote_subject"], html, to=quote.get("email"))


async def send_contact_autoreply(contact: dict):
    lang = (contact.get("lang") or "en").lower()
    t = _txt(lang)
    first_name = (contact.get("name") or "").split(" ")[0] or t["hi"]

    rows = (
        (_kv(t["phone_label"], contact.get("phone")) if contact.get("phone") else "")
        + _kv(t["message_label"], (contact.get("message") or "").replace("\n", "<br>"))
    )

    body = f"""
      <h1 style="margin:0;font-size:28px;line-height:1.2;color:#18181b;font-weight:800;">
        {t["hi"]} {first_name},
      </h1>
      <p style="margin:18px 0 0 0;font-size:16px;line-height:1.6;color:#3f3f46;">
        {t["thanks_contact"]}
      </p>

      <div style="margin-top:32px;padding-top:8px;">
        <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#d97706;font-weight:700;">
          {t["summary_title"]}
        </div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;border-top:1px solid #f1f1ef;">
          {rows}
        </table>
      </div>

      <div style="margin-top:32px;">
        <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#d97706;font-weight:700;">
          {t["what_next"]}
        </div>
        <p style="margin:8px 0 0 0;font-size:15px;line-height:1.6;color:#3f3f46;">
          {t["next_contact"]}
        </p>
      </div>

      <p style="margin:36px 0 4px 0;font-size:15px;color:#3f3f46;">{t["thanks_closing"]}</p>
      <p style="margin:0;font-size:15px;color:#18181b;font-weight:700;">{t["team"]}</p>
    """
    html = _email_shell(t["preheader_contact"], body, lang)
    await _send(t["contact_subject"], html, to=contact.get("email"))
