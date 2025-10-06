// components/providers.tsx
"use client";

import { UserProvider } from "@/context/user-provider";
import { User } from "@supabase/supabase-js";

interface ProvidersProps {
  children: React.ReactNode;
  initialUser?: User | null;
}

export function Providers({ children, initialUser }: ProvidersProps) {
  return <UserProvider initialUser={initialUser}>{children}</UserProvider>;
}
