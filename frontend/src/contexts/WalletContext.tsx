import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { connect, disconnect } from 'get-starknet';
import type { AccountInterface } from 'starknet';
import { useApp } from './AppContext';
import { useToast } from './ToastContext';

interface WalletContextType {
  account: AccountInterface | null;
  address: string | null;
  isConnected: boolean;
  connectWallet: (options?: { silent?: boolean }) => Promise<void>;
  disconnectWallet: () => Promise<void>;
  isConnecting: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

type MinimalStarknetWindowObject = {
  enable: (options?: { starknetVersion?: string }) => Promise<void>;
  account?: AccountInterface;
  selectedAddress?: string;
};

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<AccountInterface | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setDemoMode } = useApp();
  const { showToast } = useToast();

  const normalizeError = useCallback((err: unknown): string => {
    if (err instanceof Error) {
      const message = err.message.toLowerCase();
      if (message.includes('user rejected')) {
        return 'Wallet connection request was rejected. You can retry or switch to Demo Mode.';
      }
      if (message.includes('not installed') || message.includes('no wallet')) {
        return 'No StarkNet wallet detected. Install ArgentX or choose Demo Mode.';
      }
      return err.message;
    }
    if (typeof err === 'string') {
      return err;
    }
    return 'Failed to connect wallet. Please try again.';
  }, []);

  const connectWallet = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;

    try {
      if (!silent) {
        setIsConnecting(true);
        setError(null);
      }

      const starknet = (await connect({
        modalMode: silent ? 'neverAsk' : 'alwaysAsk',
      })) as MinimalStarknetWindowObject | null;

      if (!starknet) {
        if (silent) {
          return;
        }

        const message = 'No StarkNet wallet detected. Install ArgentX or choose Demo Mode to continue.';
        setError(message);
        showToast(message, 'warning');
        return;
      }

      // Enable wallet
  await starknet.enable({ starknetVersion: 'v5' });

      // Get account and address
  const walletAccount = starknet.account as AccountInterface | undefined;
  const walletAddress = (starknet.selectedAddress || walletAccount?.address) ?? null;

      if (walletAccount && walletAddress) {
        setAccount(walletAccount as AccountInterface);
        setAddress(walletAddress);
        setIsConnected(true);
        setError(null);

        // Store connection state
        localStorage.setItem('walletConnected', 'true');
        if (!silent) {
          setDemoMode(false);
          showToast('Wallet connected successfully! 🎉', 'success');
        }
      } else if (!silent) {
        throw new Error('Unable to retrieve wallet account. Please try reconnecting.');
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      const message = normalizeError(err);
      if (!silent) {
        setError(message);
        showToast(message, 'error');
      }
      localStorage.removeItem('walletConnected');
      setAccount(null);
      setAddress(null);
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  }, [normalizeError, setDemoMode, showToast]);

  const disconnectWallet = useCallback(async () => {
    try {
      await disconnect();
      setAccount(null);
      setAddress(null);
      setIsConnected(false);
      localStorage.removeItem('walletConnected');
      setError(null);
    } catch (err) {
      console.error('Wallet disconnection error:', err);
    }
  }, []);

  // Auto-reconnect on page load
  useEffect(() => {
    const wasConnected = localStorage.getItem('walletConnected');
    if (wasConnected === 'true') {
      connectWallet({ silent: true }).catch((err) => {
        console.error('Silent wallet reconnection failed:', err);
      });
    }
  }, [connectWallet]);

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

// eslint-disable-next-line react-refresh/only-export-components
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};