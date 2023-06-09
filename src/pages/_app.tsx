import type { AppProps } from "next/app";
import { SnackbarProvider } from "notistack";

import { AuthProvider } from "@/contexts/AuthContext";

import "@/styles/globals.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { green, yellow } from "@mui/material/colors";

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      danger: string;
    };
  }
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#f6ca38",
      },
      secondary: {
        main: "#45BBBD",
      },
    },
  });

  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ThemeProvider>
    </SnackbarProvider>
  );
}
