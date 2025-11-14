// app/providers.tsx
'use client'

import { ReactNode, useState, useEffect } from 'react';
import {
  http,
  createConfig,
  WagmiProvider,
  createWeb3Modal,
  defaultWagmiConfig,
  useWeb3Modal,
  useWeb3ModalAccount
} from '@web3modal/wagmi/react';
import { celo, celoAlfajores } from 'viem/chains';
import { injected, walletConnect, coinbaseWallet } from '@wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MiniAppWagmiConnector } from '@farcaster/miniapp-wagmi-connector';
import { initFarcasterMiniApp } from '@/lib/farcaster';

// Define the metadata for your app
const metadata = {
  name: "IQ Quiz Contest",
  description: "Test your knowledge with our IQ quiz, pay 0.1 CELO to access your results",
  url: "https://miniappcelo-demo.vercel.app", // Replace with your app's url
  icons: ["https://miniappcelo-demo.vercel.app/icon-192x192.png"] // Replace with your app's icon
};

// Create a client
const queryClient = new QueryClient();

// Configure the networks you want to support
const networks = [celo, celoAlfajores];

// Create the wagmi config
const wagmiConfig = defaultWagmiConfig({
  metadata,
  networks,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || '', // Replace with your WalletConnect project ID
  connectors: [
    injected(),
    coinbaseWallet({ preference: 'all' }),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_PROJECT_ID || '' }),
    MiniAppWagmiConnector()
  ],
  transports: {
    [celo.id]: http(),
    [celoAlfajores.id]: http()
  }
});

// Optionally, create the Web3Modal
if (typeof window !== 'undefined') {
  createWeb3Modal({
    wagmiConfig,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID || '',
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
    enableOnramp: true // Optional - false as default
  });
}

// Initialize Farcaster Mini App
if (typeof window !== 'undefined') {
  initFarcasterMiniApp();
}

export default function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}