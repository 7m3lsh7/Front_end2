"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function SkipToContent() {
  const { t } = useLanguage();
  return (
    <Link href="#main-content" className="skip-link">
      {t("a11y.skipToContent")}
    </Link>
  );
}
