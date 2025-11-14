import { createWalletClient, http, parseEther } from 'viem';
import { celo } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// Initialize account with private key from environment variables
const account = privateKeyToAccount(`0x${process.env.CELO_PRIVATE_KEY || ''}` as `0x${string}`);

// Create a wallet client for Celo network
export const celoWalletClient = createWalletClient({
  account,
  chain: celo,
  transport: http(process.env.NEXT_PUBLIC_CELO_RPC_URL || 'https://forno.celo.org'),
});

// Function to send 0.1 CELO to the specified address
export async function sendCelo(amount: string, to: `0x${string}`) {
  try {
    const hash = await celoWalletClient.sendTransaction({
      to,
      value: parseEther(amount),
      account,
    });
    
    return { success: true, hash };
  } catch (error) {
    console.error('Error sending CELO:', error);
    return { success: false, error };
  }
}

// Function to check if a transaction was successful
export async function checkTransaction(hash: `0x${string}`) {
  try {
    const receipt = await celoWalletClient.waitForTransactionReceipt({ hash });
    return receipt.status === 'success';
  } catch (error) {
    console.error('Error checking transaction:', error);
    return false;
  }
}