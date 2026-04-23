import { createTheme, ThemeOptions } from "@mui/material/styles";
import type { CSSProperties } from "react";
import { getPalette } from "./palette";
import { typography } from "./typography";

export function createAppTheme(mode: "light" | "dark") {
    const initialTheme = createTheme({ palette: getPalette(mode), typography });

    const finalThemeOptions: ThemeOptions = {
        ...initialTheme,
        components: {
            MuiBreadcrumbs: {
                styleOverrides: {
                    root: { color: initialTheme.palette.secondary?.contrastText },
                    separator: { color: initialTheme.palette.secondary?.contrastText },
                },
            },
            MuiLink: {
                styleOverrides: {
                    root: {
                        ...(initialTheme.typography.body1 as CSSProperties),
                        textDecorationColor: "rgba(255, 255, 255, 0.5)",
                    },
                },
            },
            MuiButtonBase: {
                styleOverrides: {
                    root: {
                        transition: "all 0.2s ease",
                        "&:focus-visible": {
                            outline: `2px solid ${initialTheme.palette.primary.main}`,
                            outlineOffset: 2,
                        },
                    },
                },
            },
        },
    };

    return createTheme(finalThemeOptions);
}