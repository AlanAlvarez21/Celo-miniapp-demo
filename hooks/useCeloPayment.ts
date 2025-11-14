// hooks/useCeloPayment.ts
import { useState, useEffect } from 'react';
import { useAccount, useConnect, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { celo } from 'viem/chains';

export function useCeloPayment() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'approving' | 'processing' | 'success' | 'failed'>('idle');
  const [transactionHash, setTransactionHash] = useState<`0x${string}` | null>(null);
  
  // Wagmi hooks for transaction
  const { sendTransaction, isPending, isError } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: transactionHash,
  });
  
  // Check if wallet is connected on mount
  useEffect(() => {
    setIsWalletConnected(isConnected);
  }, [isConnected]);
  
  const connectWallet = () => {
    // Find the first available connector (like injected wallet, wallet connect, etc.)
    const injectedConnector = connectors.find(c => c.id === 'injected');
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };
  
  const makePayment = async (amount: string, toAddress: `0x${string}`) => {
    setPaymentStatus('approving');

    if (!address) {
      console.error('Wallet not connected');
      setPaymentStatus('failed');
      return;
    }

    try {
      // Send the transaction
      sendTransaction({
        to: toAddress,
        value: parseEther(amount),
        chainId: celo.id,
      }, {
        onSuccess: (hash) => {
          setTransactionHash(hash);
          setPaymentStatus('processing');
        },
        onError: (error) => {
          console.error('Payment error:', error);
          setPaymentStatus('failed');
        }
      });
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
    }
  };

  // Function to make payment to a default receiving address
  const makePaymentToDefault = async (amount: string) => {
    // Get receiving address from environment variables or use a default
    const receivingAddress = process.env.NEXT_PUBLIC_RECEIVING_ADDRESS as `0x${string}`;

    if (!receivingAddress) {
      console.error('No receiving address configured');
      return;
    }

    makePayment(amount, receivingAddress);
  };
  
  // Update payment status based on transaction status
  useEffect(() => {
    if (isConfirming) {
      setPaymentStatus('processing');
    }
    if (isConfirmed) {
      setPaymentStatus('success');
    }
    if (isError) {
      setPaymentStatus('failed');
    }
  }, [isConfirming, isConfirmed, isError]);
  
  return {
    address,
    isWalletConnected,
    connectWallet,
    makePayment,
    makePaymentToDefault,
    paymentStatus,
    isPaymentLoading: isPending || isConfirming,
    transactionHash,
  };
}