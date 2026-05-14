import { createContext, useContext, useEffect, useState } from "react";

const LangCtx = createContext({ lang: "en", setLang: () => {}, t: (en) => en });

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem("lang");
    if (saved) return saved;
    // Auto-detect browser language on first visit
    const nav = (navigator.language || "en").toLowerCase();
    return nav.startsWith("fr") ? "fr" : "en";
  });
  useEffect(() => { localStorage.setItem("lang", lang); document.documentElement.lang = lang; }, [lang]);
  const setLang = (l) => setLangState(l);
  const t = (en, fr) => (lang === "fr" && fr ? fr : en);
  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}
export const useLang = () => useContext(LangCtx);
