import type { AppProps } from "next/app";
import { SnackbarProvider } from "notistack";

import { AuthProvider } from "@/contexts/AuthContext";

import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </SnackbarProvider>
  );
}
