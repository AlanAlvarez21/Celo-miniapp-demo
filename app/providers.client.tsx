'use client';

import { ReactNode, useEffect, useState } from 'react';
import {
  createWeb3Modal,
  defaultWagmiConfig,
  useWeb3Modal,
  useWeb3ModalAccount
} from '@web3modal/wagmi/react';
import { WagmiProvider, http, createConfig } from 'wagmi';
import { celo, celoAlfajores } from 'viem/chains';
import { injected, walletConnect, coinbaseWallet } from '@wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { farcasterMiniApp as MiniAppWagmiConnector } from '@farcaster/miniapp-wagmi-connector';

// Define the metadata for your app
const metadata = {
  name: "IQ Quiz Contest",
  description: "Test your knowledge with our IQ quiz, pay 0.1 CELO to access your results",
  url: "https://miniappcelo-demo.vercel.app", // Replace with your app's url
  icons: ["https://miniappcelo-demo.vercel.app/icon-192x192.png"] // Replace with your app's icon
};

// Create a client
const queryClient = new QueryClient();

// Create wagmi config
const wagmiConfig = createConfig({
  chains: [celo, celoAlfajores], // Use chains directly
  transports: {
    [celo.id]: http(),
    [celoAlfajores.id]: http()
  },
  connectors: [
    injected(),
    coinbaseWallet({ preference: 'all' }),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_PROJECT_ID || '' }),
    MiniAppWagmiConnector()
  ]
});

export default function Web3Provider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Initialize Web3Modal only on the client-side and after mounting
    createWeb3Modal({
      wagmiConfig,
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID || '',
      enableAnalytics: true, // Optional - defaults to your Cloud configuration
      enableOnramp: true // Optional - false as default
    });
  }, []);

  if (!mounted) {
    // Render nothing on the server and before client hydration
    return <>{children}</>;
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}