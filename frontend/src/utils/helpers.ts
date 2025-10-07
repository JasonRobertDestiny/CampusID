import { TOKEN_DECIMALS } from './constants';

export const resolveDemoMode = (override?: boolean): boolean => {
  if (typeof override === 'boolean') {
    return override;
  }

  if (typeof window !== 'undefined') {
    try {
      const stored = window.localStorage.getItem('demoMode');
      if (stored !== null) {
        return stored === 'true';
      }
    } catch {
      // Ignore storage access issues and fall back to environment configuration
    }
  }

  return import.meta.env.VITE_DEMO_MODE === 'true';
};

export const formatTokenAmount = (amount: string | number): string => {
  // Handle demo mode - direct number formatting
  if (typeof amount === 'string' && !isNaN(Number(amount))) {
    const numAmount = Number(amount);
    return numAmount.toFixed(2);
  }

  // Handle blockchain mode with decimals
  const value = typeof amount === 'string' ? BigInt(amount) : BigInt(amount);
  const divisor = BigInt(10 ** TOKEN_DECIMALS);
  const result = Number(value) / Number(divisor);
  return result.toFixed(2);
};

export const parseTokenAmount = (amount: string): string => {
  const value = parseFloat(amount);
  return (BigInt(Math.floor(value * 10 ** TOKEN_DECIMALS))).toString();
};

export const shortAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const getExplorerTxUrl = (txHash: string, explorerUrl: string): string => {
  return `${explorerUrl}/tx/${txHash}`;
};

export const stringToByteArray = (str: string): number[] => {
  return Array.from(str).map(char => char.charCodeAt(0));
};

export const byteArrayToString = (bytes: number[]): string => {
  return String.fromCharCode(...bytes);
};