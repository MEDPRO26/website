"use client";

import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexReactClient } from "convex/react";
import { type ReactNode, useMemo } from "react";

type ConvexClientProviderProps = {
  children: ReactNode;
};

export default function ConvexClientProvider({
  children,
}: ConvexClientProviderProps) {
  const client = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) {
      return null;
    }
    return new ConvexReactClient(url);
  }, []);

  if (!client) {
    return children;
  }

  return (
    <ConvexAuthNextjsProvider client={client}>
      {children}
    </ConvexAuthNextjsProvider>
  );
}
