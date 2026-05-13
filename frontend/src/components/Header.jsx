import { Link, NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { List, X } from "@phosphor-icons/react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/quote", label: "Free Quote" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  // Hide marketing header inside admin
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/5"
      data-testid="site-header"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 text-white hover:opacity-90 transition-opacity"
          data-testid="brand-link"
        >
          <img
            src="https://customer-assets.emergentagent.com/job_asphal-armour/artifacts/yoge8s6k_IMG_0079.jpeg"
            alt="Asphalt Armour"
            className="h-11 w-11 object-contain"
          />
          <span className="brand-wordmark text-xl tracking-wider hidden sm:inline">
            ASPHALT <span className="text-yellow-400">ARMOUR</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8" data-testid="desktop-nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={({ isActive }) =>
                `text-xs font-semibold tracking-[0.18em] uppercase transition-colors ${
                  isActive ? "text-yellow-400" : "text-zinc-300 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link to="/quote" className="btn-primary !py-3 !px-5 !text-xs" data-testid="header-cta-quote">
            Get Free Quote
          </Link>
        </nav>

        <button
          className="md:hidden text-white p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          data-testid="mobile-menu-toggle"
        >
          {open ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-black border-t border-white/5" data-testid="mobile-nav">
          <div className="flex flex-col px-6 py-4 gap-4">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={({ isActive }) =>
                  `text-sm font-semibold tracking-[0.18em] uppercase ${
                    isActive ? "text-yellow-400" : "text-zinc-300"
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
