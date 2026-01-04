import * as React from "react";
import { AppProps } from "next/app";
import { SessionProvider, useSession } from "next-auth/react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Head from "next/head";
import { useStore } from "../store/useStore";

/**
 * We keep a small wrapper that listens for NextAuth session changes
 * and syncs token+user into Zustand so store's actions can use it.
 */
function SessionSync({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const setAuth = useStore((s) => s.setAuth);

  React.useEffect(() => {
    if (session?.user) {
      // NextAuth stores token in session?.accessToken if configured; we store what we can
      // Our NextAuth callback will add token to session.user.token
      // Sync to Zustand for client-side API usage and caching
      setAuth({ user: session.user as any, token: (session as any).accessToken || (session.user as any).token || "" });
    } else {
      setAuth({ user: null, token: "" });
    }
  }, [session, setAuth]);

  return <>{children}</>;
}

const theme = createTheme();

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SessionSync>
          <Component {...pageProps} />
        </SessionSync>
      </ThemeProvider>
    </SessionProvider>
  );
}