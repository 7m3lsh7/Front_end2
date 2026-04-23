"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { StudentYearProvider } from "@/context/StudentYearContext";
import { AppLanguage, LanguageProvider } from "@/context/LanguageContext";
import { ThemeMode, ThemeModeProvider } from "@/context/ThemeModeContext";
import ToastProvider from "./ToastProvider";

export default function AppProviders({
  initialLanguage,
  initialThemeMode,
  children,
}: {
  initialLanguage: AppLanguage;
  initialThemeMode: ThemeMode;
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      <ThemeModeProvider initialMode={initialThemeMode}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <StudentYearProvider>
              {children}
              <ToastProvider />
            </StudentYearProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeModeProvider>
    </LanguageProvider>
  );
}
