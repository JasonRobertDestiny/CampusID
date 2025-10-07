import type { AccountInterface } from 'starknet';
import type { TransactionRecord } from '../types';

type StorageLike = {
  get: (key: string) => string | null;
  set: (key: string, value: string) => void;
  remove: (key: string) => void;
};

const memoryStorage = new Map<string, string>();

const safeStorage: StorageLike = {
  get: (key) => {
    if (typeof window !== 'undefined') {
      try {
        return window.localStorage.getItem(key);
      } catch {
        // Fall back to memory storage
      }
    }
    return memoryStorage.get(key) ?? null;
  },
  set: (key, value) => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, value);
        return;
      } catch {
        // Fall back to memory storage
      }
    }
    memoryStorage.set(key, value);
  },
  remove: (key) => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(key);
        return;
      } catch {
        // Fall back to memory storage
      }
    }
    memoryStorage.delete(key);
  },
};

export class MockStudentNFTService {
  initialize(account?: AccountInterface) {
    void account;
    // Mock service doesn't need initialization
  }

  async hasNFT(address: string): Promise<boolean> {
    void address;
    const data = safeStorage.get('demo_hasNFT');
    return data === 'true';
  }

  async mintNFT(
    avatarUri: string,
    studentName: string,
    studentId: string
  ): Promise<{ tokenId: string; txHash: string }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Store NFT data locally
    safeStorage.set('demo_hasNFT', 'true');
    safeStorage.set(
      'demo_studentInfo',
      JSON.stringify({ avatarUri, studentName, studentId })
    );

    // Generate fake transaction hash
    const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;

    return {
      tokenId: '1',
      txHash,
    };
  }

  async getStudentInfo(tokenId: string): Promise<{
    avatarUri: string;
    studentName: string;
    studentId: string;
  }> {
    void tokenId;
    const data = safeStorage.get('demo_studentInfo');
    if (data) {
      return JSON.parse(data);
    }
    return {
      avatarUri: '',
      studentName: '',
      studentId: '',
    };
  }

  async getBalance(address: string): Promise<string> {
    void address;
    const balance = safeStorage.get('demo_balance') || '0';
    return balance;
  }
}

export class MockCampusTokenService {
  initialize(account?: AccountInterface) {
    void account;
    // Mock service doesn't need initialization
  }

  async getBalance(address: string): Promise<string> {
    void address;
    const balance = safeStorage.get('demo_balance') || '0';
    return balance;
  }

  async checkIn(): Promise<string> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Get current balance
  const currentBalance = parseFloat(safeStorage.get('demo_balance') || '0');
    const newBalance = currentBalance + 10;
  safeStorage.set('demo_balance', newBalance.toString());

    // Generate fake transaction hash
    const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;

    // Add to history
    const history: TransactionRecord[] = JSON.parse(
      safeStorage.get('demo_history') || '[]'
    );
    history.unshift({
      id: Date.now().toString(),
      type: 'checkin',
      amount: '10',
      timestamp: Date.now(),
      txHash,
      description: 'Daily check-in reward',
    });
  safeStorage.set('demo_history', JSON.stringify(history.slice(0, 50)));

    return txHash;
  }

  async purchase(_storeAddress: string, amountInCPT: string): Promise<string> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Get current balance
  const currentBalance = parseFloat(safeStorage.get('demo_balance') || '0');
    const amount = parseFloat(amountInCPT);

    if (currentBalance < amount) {
      throw new Error('Insufficient balance');
    }

    const newBalance = currentBalance - amount;
  safeStorage.set('demo_balance', newBalance.toString());

    // Generate fake transaction hash
    const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;

    return txHash;
  }

  async transfer(recipient: string, amountInCPT: string): Promise<string> {
    return this.purchase(recipient, amountInCPT);
  }
}