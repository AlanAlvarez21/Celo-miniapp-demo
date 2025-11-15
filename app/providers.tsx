// app/providers.tsx (Server-safe fallback)
import { ReactNode } from 'react';

export default function Web3Provider({ children }: { children: ReactNode }) {
  // Server-side fallback that simply renders children
  // The actual Web3 provider is loaded via client-side dynamic import in providers.client.tsx
  return <>{children}</>;
}