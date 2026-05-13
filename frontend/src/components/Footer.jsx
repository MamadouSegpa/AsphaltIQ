import { Link, useLocation } from "react-router-dom";
import { Phone, EnvelopeSimple, MapPin } from "@phosphor-icons/react";

export default function Footer() {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-black border-t border-white/5 py-20 px-6 md:px-10" data-testid="site-footer">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-4">
            <img
              src="https://customer-assets.emergentagent.com/job_asphal-armour/artifacts/yoge8s6k_IMG_0079.jpeg"
              alt="Asphalt Armour"
              className="h-16 w-16 object-contain"
            />
            <div className="brand-wordmark text-3xl text-white">
              ASPHALT <span className="text-yellow-400">ARMOUR</span>
            </div>
          </div>
          <p className="mt-6 text-zinc-400 max-w-md leading-relaxed text-sm">
            Industrial-grade driveway sealcoating and crack filling. Built to protect
            your asphalt investment for years to come.
          </p>
        </div>

        <div>
          <div className="overline mb-4">Navigate</div>
          <ul className="space-y-3">
            {[
              ["Home", "/"],
              ["Services", "/services"],
              ["Free Quote", "/quote"],
              ["Contact", "/contact"],
            ].map(([label, to]) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-sm text-zinc-300 hover:text-yellow-400 transition-colors"
                  data-testid={`footer-link-${label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="overline mb-4">Contact</div>
          <ul className="space-y-3 text-sm text-zinc-300">
            <li className="flex items-start gap-3">
              <Phone size={16} weight="bold" className="text-yellow-400 mt-1" />
              <a href="tel:4384967111" className="hover:text-yellow-400" data-testid="footer-phone">
                (438) 496-7111
              </a>
            </li>
            <li className="flex items-start gap-3">
              <EnvelopeSimple size={16} weight="bold" className="text-yellow-400 mt-1" />
              <a href="mailto:info@asphaltarmour.com" className="hover:text-yellow-400" data-testid="footer-email">
                info@asphaltarmour.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={16} weight="bold" className="text-yellow-400 mt-1" />
              <span>Montreal West Island</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-zinc-500 tracking-wider uppercase">
          © {new Date().getFullYear()} Asphalt Armour. All rights reserved.
        </p>
        <Link
          to="/admin/login"
          className="text-xs text-zinc-600 hover:text-zinc-300 tracking-wider uppercase"
          data-testid="footer-admin-link"
        >
          Admin
        </Link>
      </div>
    </footer>
  );
}
