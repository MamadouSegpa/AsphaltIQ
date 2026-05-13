"""Email notification helpers using Resend.

All calls are fire-and-forget — failures are logged but never raised so that a
broken email provider never causes a quote/contact submission to fail for the user.
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


async def _send(subject: str, html: str):
    if not _configure():
        logger.info("Resend not configured; skipping email")
        return
    sender = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
    recipient = os.environ.get("NOTIFICATION_EMAIL")
    if not recipient:
        logger.info("NOTIFICATION_EMAIL not set; skipping email")
        return
    params = {
        "from": sender,
        "to": [recipient],
        "subject": subject,
        "html": html,
    }
    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Email sent to {recipient}: {result.get('id') if isinstance(result, dict) else result}")
    except Exception as e:
        logger.error(f"Failed to send notification email: {e}")


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
    """Send admin a notification when a new quote request comes in."""
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
    )
    html = f"""
    <div style="background:#0a0a0a;padding:32px;font-family:Arial,sans-serif;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;">
        <div style="background:#facc15;padding:20px 24px;">
          <div style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#000;font-weight:700;">New Quote Request</div>
          <div style="font-size:22px;font-weight:800;color:#000;margin-top:4px;">Asphalt Armour</div>
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
    """Send admin a notification when a new contact message arrives."""
    rows = (
        _row("Name", contact.get("name"))
        + _row("Email", f'<a href="mailto:{contact.get("email")}">{contact.get("email")}</a>')
        + _row("Phone", f'<a href="tel:{contact.get("phone")}">{contact.get("phone")}</a>' if contact.get("phone") else "")
        + _row("Message", str(contact.get("message", "")).replace("\n", "<br>"))
    )
    html = f"""
    <div style="background:#0a0a0a;padding:32px;font-family:Arial,sans-serif;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;">
        <div style="background:#facc15;padding:20px 24px;">
          <div style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#000;font-weight:700;">New Contact Message</div>
          <div style="font-size:22px;font-weight:800;color:#000;margin-top:4px;">Asphalt Armour</div>
        </div>
        <table style="width:100%;border-collapse:collapse;">{rows}</table>
      </div>
    </div>
    """
    await _send(f"New Contact Message — {contact.get('name')}", html)
