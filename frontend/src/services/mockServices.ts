import type { AccountInterface } from 'starknet';
import type { TransactionRecord } from '../types';

export class MockStudentNFTService {
  initialize(_account?: AccountInterface) {
    // Mock service doesn't need initialization
  }

  async hasNFT(_address: string): Promise<boolean> {
    const data = localStorage.getItem('demo_hasNFT');
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
    localStorage.setItem('demo_hasNFT', 'true');
    localStorage.setItem(
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

  async getStudentInfo(_tokenId: string): Promise<{
    avatarUri: string;
    studentName: string;
    studentId: string;
  }> {
    const data = localStorage.getItem('demo_studentInfo');
    if (data) {
      return JSON.parse(data);
    }
    return {
      avatarUri: '',
      studentName: '',
      studentId: '',
    };
  }

  async getBalance(_address: string): Promise<string> {
    const balance = localStorage.getItem('demo_balance') || '0';
    return balance;
  }
}

export class MockCampusTokenService {
  initialize(_account?: AccountInterface) {
    // Mock service doesn't need initialization
  }

  async getBalance(_address: string): Promise<string> {
    const balance = localStorage.getItem('demo_balance') || '0';
    return balance;
  }

  async checkIn(): Promise<string> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Get current balance
    const currentBalance = parseFloat(localStorage.getItem('demo_balance') || '0');
    const newBalance = currentBalance + 10;
    localStorage.setItem('demo_balance', newBalance.toString());

    // Generate fake transaction hash
    const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;

    // Add to history
    const history: TransactionRecord[] = JSON.parse(
      localStorage.getItem('demo_history') || '[]'
    );
    history.unshift({
      id: Date.now().toString(),
      type: 'checkin',
      amount: '10',
      timestamp: Date.now(),
      txHash,
      description: 'Daily check-in reward',
    });
    localStorage.setItem('demo_history', JSON.stringify(history.slice(0, 50)));

    return txHash;
  }

  async purchase(_storeAddress: string, amountInCPT: string): Promise<string> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Get current balance
    const currentBalance = parseFloat(localStorage.getItem('demo_balance') || '0');
    const amount = parseFloat(amountInCPT);

    if (currentBalance < amount) {
      throw new Error('Insufficient balance');
    }

    const newBalance = currentBalance - amount;
    localStorage.setItem('demo_balance', newBalance.toString());

    // Generate fake transaction hash
    const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;

    return txHash;
  }

  async transfer(recipient: string, amountInCPT: string): Promise<string> {
    return this.purchase(recipient, amountInCPT);
  }
}