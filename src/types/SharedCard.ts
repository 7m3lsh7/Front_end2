import React from "react";

export type CardData = {
  id: string;
  icon: React.ElementType<{ width?: number; height?: number }>;
  title: string;
  description: string;
  href: string;
};
