import { PaletteOptions } from "@mui/material/styles";

export function getPalette(mode: "light" | "dark"): PaletteOptions {
    const isDark = mode === "dark";

    return {
        mode,
        primary: { main: "#FFC600", dark: "#E6B800" },
        secondary: { main: "#ffc600", contrastText: isDark ? "#0a0a0a" : "#fff" },
        error: { main: isDark ? "#ff6b6b" : "rgba(191, 0, 0, 0.16)", light: "#D40000" },
        warning: { main: "#ff9800" },
        info: { main: "#2196f3" },
        success: { main: "#4caf50" },
        background: {
            default: isDark ? "#121212" : "#f4f6f8",
            paper: isDark ? "rgba(30, 30, 30, 0.92)" : "rgba(255, 255, 255, 0.88)",
            main: isDark ? "#1a1a1a" : "#ffffff"
        },
        text: {
            primary: isDark ? "#f5f5f5" : "#212121",
            secondary: isDark ? "#b0b0b0" : "#757575",
        },
        divider: isDark ? "rgba(255, 255, 255, 0.16)" : "rgba(81, 81, 81, 0.3)",
        action: {
            hover: isDark ? "rgba(255, 198, 0, 0.15)" : "#ffcdd2",
        },
    };
}