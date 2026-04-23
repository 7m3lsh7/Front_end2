"use client";

import { IconButton, IconButtonProps } from "@mui/material";
import React from "react";

interface AccessibleIconButtonProps extends IconButtonProps {
  label: string;
}

export default function AccessibleIconButton({
  label,
  children,
  ...props
}: AccessibleIconButtonProps) {
  return (
    <IconButton aria-label={label} title={label} {...props}>
      {children}
    </IconButton>
  );
}
