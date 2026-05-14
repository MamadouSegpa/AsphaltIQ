import { useLocation } from "react-router-dom";
import { Sun, Moon, Translate } from "@phosphor-icons/react";
import { useTheme } from "../lib/theme";
import { useLang } from "../lib/i18n";

export default function SettingsWidget() {
  const { theme, toggle } = useTheme();
  const { lang, setLang } = useLang();
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <div
      className="fixed bottom-6 left-6 z-40 flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg px-2 py-2"
      data-testid="settings-widget"
    >
      <button
        onClick={toggle}
        className="w-9 h-9 flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        aria-label="Toggle theme"
        title={theme === "dark" ? "Light mode" : "Dark mode"}
        data-testid="theme-toggle-btn"
      >
        {theme === "dark" ? <Sun size={18} weight="bold" /> : <Moon size={18} weight="bold" />}
      </button>
      <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800" />
      <button
        onClick={() => setLang(lang === "en" ? "fr" : "en")}
        className="px-3 h-9 flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        aria-label="Toggle language"
        data-testid="lang-toggle-btn"
      >
        <Translate size={16} weight="bold" />
        {lang === "en" ? "FR" : "EN"}
      </button>
    </div>
  );
}
