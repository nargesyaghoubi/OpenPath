"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

// Makes useSession() available to client components
export default function AuthSessionProvider({ children }: { children: ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
}
