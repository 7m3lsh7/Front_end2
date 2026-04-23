"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "../../messages/en.json";
import ar from "../../messages/ar.json";

export type AppLanguage = "en" | "ar";

interface Dictionary {
  [key: string]: unknown;
}
const dictionaries: Record<AppLanguage, Dictionary> = { en, ar };

interface LanguageContextValue {
  language: AppLanguage;
  dir: "ltr" | "rtl";
  setLanguage: (lang: AppLanguage) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "app_language";
const COOKIE_KEY = "app_language";

function getNestedValue(dict: Dictionary, path: string): string | undefined {
  const value = path.split(".").reduce<unknown>((acc, key) => {
    if (!acc || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[key];
  }, dict);
  return typeof value === "string" ? value : undefined;
}

export function LanguageProvider({
  initialLanguage,
  children,
}: {
  initialLanguage: AppLanguage;
  children: React.ReactNode;
}) {
  const [language, setLanguageState] = useState<AppLanguage>(initialLanguage);

  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? (localStorage.getItem(STORAGE_KEY) as AppLanguage | null)
        : null;
    if (saved === "en" || saved === "ar") setLanguageState(saved);
  }, [initialLanguage]);

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, lang);
      document.cookie = `${COOKIE_KEY}=${lang}; path=/; max-age=31536000; samesite=lax`;
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }
  };

  const toggleLanguage = () => setLanguage(language === "en" ? "ar" : "en");

  const value = useMemo<LanguageContextValue>(() => {
    const dict = dictionaries[language];
    return {
      language,
      dir: language === "ar" ? "rtl" : "ltr",
      setLanguage,
      toggleLanguage,
      t: (key: string, fallback?: string) => getNestedValue(dict, key) ?? fallback ?? key,
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

