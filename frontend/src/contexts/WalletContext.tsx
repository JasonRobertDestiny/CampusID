import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { connect, disconnect } from 'get-starknet';
import type { AccountInterface } from 'starknet';

interface WalletContextType {
  account: AccountInterface | null;
  address: string | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnecting: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<AccountInterface | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      const starknet = await connect({ modalMode: 'alwaysAsk' });

      if (!starknet) {
        throw new Error('Failed to connect wallet');
      }

      // Enable wallet
      await (starknet as any).enable({ starknetVersion: 'v5' });

      // Get account and address
      const walletAccount = (starknet as any).account;
      const walletAddress = (starknet as any).selectedAddress || walletAccount?.address;

      if (walletAccount && walletAddress) {
        setAccount(walletAccount as AccountInterface);
        setAddress(walletAddress);
        setIsConnected(true);

        // Store connection state
        localStorage.setItem('walletConnected', 'true');
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnect();
      setAccount(null);
      setAddress(null);
      setIsConnected(false);
      localStorage.removeItem('walletConnected');
    } catch (err) {
      console.error('Wallet disconnection error:', err);
    }
  };

  // Auto-reconnect on page load
  useEffect(() => {
    const wasConnected = localStorage.getItem('walletConnected');
    if (wasConnected === 'true') {
      connectWallet();
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        account,
        address,
        isConnected,
        connectWallet,
        disconnectWallet,
        isConnecting,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};