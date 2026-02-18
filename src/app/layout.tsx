"use client";

import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import theme from "@/styles/theme";
import { AuthProvider } from '../context/AuthContext';

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                  {children}
              </AuthProvider>
            </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}