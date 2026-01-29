// src/app/providers/MUIThemeProvider.tsx

import CssBaseline from "@mui/material/CssBaseline";
import {
  ThemeProvider as MUIThemeProvider,
  createTheme,
} from "@mui/material/styles";
import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";
import { useUIStore } from "../store/ui.store";

interface MUIThemeProviderProps {
  children: ReactNode;
}

export const MUIThemeProviderWrapper = ({
  children,
}: MUIThemeProviderProps) => {
  const mode = useUIStore((state) => state.theme);

  // 1. EFECTO: Sincronizar Tailwind (Lógica traída del antiguo ThemeProvider)
  // Cada vez que cambia el modo, actualizamos la clase en el HTML
  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [mode]);

  // 2. MEMO: Configuración de Material UI
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#14b8a6",
            light: "#5eead4",
            dark: "#0d9488",
          },
          secondary: {
            main: "#06b6d4",
          },
          background: {
            default: mode === "light" ? "#f0fdfa" : "#111827",
            paper: mode === "light" ? "#ffffff" : "#1f2937",
          },
        },
        typography: {
          fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
          ].join(","),
        },
        shape: {
          borderRadius: 8,
        },
      }),
    [mode],
  );

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};
