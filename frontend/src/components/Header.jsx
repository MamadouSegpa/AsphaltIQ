import { Link, NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { useLang } from "../lib/i18n";

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { t } = useLang();
  if (location.pathname.startsWith("/admin")) return null;

  const NAV = [
    { to: "/", label: t("Home", "Accueil"), key: "home" },
    { to: "/services", label: t("Services", "Services"), key: "services" },
    { to: "/quote", label: t("Free Quote", "Soumission"), key: "free-quote" },
    { to: "/contact", label: t("Contact", "Contact"), key: "contact" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-200"
      data-testid="site-header"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 text-zinc-900 hover:opacity-80 transition-opacity"
          data-testid="brand-link"
        >
          <img src="/logo.png" alt="Asphaltiq" className="h-11 w-11 object-contain invert" />
          <span className="brand-wordmark text-xl tracking-wider hidden sm:inline">
            ASPHALT<span className="text-amber-600">IQ</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8" data-testid="desktop-nav">
          {NAV.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              data-testid={`nav-${item.key}`}
              className={({ isActive }) =>
                `text-xs font-semibold tracking-[0.18em] uppercase transition-colors ${
                  isActive ? "text-amber-600" : "text-zinc-700 hover:text-zinc-900"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link to="/quote" className="btn-primary !py-3 !px-5 !text-xs" data-testid="header-cta-quote">
            {t("Get Free Quote", "Soumission Gratuite")}
          </Link>
        </nav>

        <button
          className="md:hidden text-zinc-900 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          data-testid="mobile-menu-toggle"
        >
          {open ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-zinc-200" data-testid="mobile-nav">
          <div className="flex flex-col px-6 py-4 gap-4">
            {NAV.map((item) => (
              <NavLink
                key={item.key}
                to={item.to}
                onClick={() => setOpen(false)}
                data-testid={`mobile-nav-${item.key}`}
                className={({ isActive }) =>
                  `text-sm font-semibold tracking-[0.18em] uppercase ${
                    isActive ? "text-amber-600" : "text-zinc-700"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
