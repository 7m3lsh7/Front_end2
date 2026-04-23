"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AppLanguage = "en" | "ar";

type Dictionary = Record<string, string>;

const dictionaries: Record<AppLanguage, Dictionary> = {
  en: {
    home: "Home",
    years: "Years",
    about: "About",
    menu: "Menu",
    language: "Language",
    logout: "Logout",
    profile: "Profile",
    userFallback: "User",
    teacher: "Teacher",
    student: "Student",
    StudentAffairs: "StudentAffairs",
    admin: "Admin",
  },
  ar: {
    home: "الرئيسية",
    years: "السنوات",
    about: "من نحن",
    menu: "القائمة",
    language: "اللغة",
    logout: "تسجيل الخروج",
    profile: "الملف الشخصي",
    userFallback: "المستخدم",
    teacher: "معلّم",
    student: "طالب",
    StudentAffairs: "الموظف",
    admin: "مسؤول",
  },
};

interface LanguageContextValue {
  language: AppLanguage;
  dir: "ltr" | "rtl";
  setLanguage: (lang: AppLanguage) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "app_language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>("en");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem(STORAGE_KEY) as AppLanguage | null) : null;
    if (saved === "en" || saved === "ar") setLanguageState(saved);
  }, []);

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, lang);
  };

  const toggleLanguage = () => setLanguage(language === "en" ? "ar" : "en");

  const value = useMemo<LanguageContextValue>(() => {
    const dict = dictionaries[language];
    return {
      language,
      dir: language === "ar" ? "rtl" : "ltr",
      setLanguage,
      toggleLanguage,
      t: (key: string) => dict[key] ?? key,
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

