import { Contract, AccountInterface } from 'starknet';
import { CONTRACT_ADDRESSES } from '../utils/constants';
import { formatTokenAmount, parseTokenAmount, resolveDemoMode } from '../utils/helpers';

// Campus Token ABI (simplified)
const CAMPUS_TOKEN_ABI = [
  {
    type: 'function',
    name: 'balance_of',
    inputs: [{ name: 'account', type: 'core::starknet::contract_address::ContractAddress' }],
    outputs: [{ type: 'core::integer::u256' }],
    state_mutability: 'view',
  },
  {
    type: 'function',
    name: 'check_in',
    inputs: [],
    outputs: [{ type: 'core::bool' }],
    state_mutability: 'external',
  },
  {
    type: 'function',
    name: 'purchase',
    inputs: [
      { name: 'store_address', type: 'core::starknet::contract_address::ContractAddress' },
      { name: 'amount', type: 'core::integer::u256' },
    ],
    outputs: [{ type: 'core::bool' }],
    state_mutability: 'external',
  },
  {
    type: 'function',
    name: 'transfer',
    inputs: [
      { name: 'recipient', type: 'core::starknet::contract_address::ContractAddress' },
      { name: 'amount', type: 'core::integer::u256' },
    ],
    outputs: [{ type: 'core::bool' }],
    state_mutability: 'external',
  },
];

export class CampusTokenService {
  private contract: Contract | null = null;
  private readonly isDemoMode: boolean;

  constructor(demoMode?: boolean) {
    this.isDemoMode = resolveDemoMode(demoMode);
  }

  initialize(account: AccountInterface) {
    if (this.isDemoMode) {
      // Demo mode operates against local storage only
      console.log('✅ Campus Token Service running in Demo Mode');
      return;
    }

    if (!CONTRACT_ADDRESSES.CAMPUS_TOKEN || 
        CONTRACT_ADDRESSES.CAMPUS_TOKEN === '' ||
        CONTRACT_ADDRESSES.CAMPUS_TOKEN === '0x0' ||
        CONTRACT_ADDRESSES.CAMPUS_TOKEN === '0x0000000000000000000000000000000000000000') {
      console.warn('⚠️ Campus Token contract not deployed. Please deploy contracts or enable Demo Mode.');
      throw new Error('🚀 Smart contracts not deployed yet! For the hackathon demo, please enable Demo Mode to test the app functionality.');
    }

    this.contract = new Contract(CAMPUS_TOKEN_ABI, CONTRACT_ADDRESSES.CAMPUS_TOKEN, account);
  }

  async getBalance(address: string): Promise<string> {
    if (this.isDemoMode) {
      const balance = localStorage.getItem('demo_balance') || '0';
      return formatTokenAmount(balance);
    }

    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const balance = await this.contract.balance_of(address);
      return formatTokenAmount(balance.toString());
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  }

  async checkIn(): Promise<string> {
    if (this.isDemoMode) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const currentBalance = parseFloat(localStorage.getItem('demo_balance') || '0');
      const newBalance = currentBalance + 10;
      localStorage.setItem('demo_balance', newBalance.toString());

      const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;

      const history: Array<{
        id: string;
        type: string;
        amount: string;
        timestamp: number;
        txHash: string;
        description: string;
      }> = JSON.parse(localStorage.getItem('demo_history') || '[]');
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

    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    const tx = await this.contract.check_in();
    await this.contract.providerOrAccount.waitForTransaction(tx.transaction_hash);

    return tx.transaction_hash;
  }

  async purchase(storeAddress: string, amountInCPT: string): Promise<string> {
    if (this.isDemoMode) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const currentBalance = parseFloat(localStorage.getItem('demo_balance') || '0');
      const amount = parseFloat(amountInCPT);

      if (currentBalance < amount) {
        throw new Error('Insufficient balance');
      }

      const newBalance = currentBalance - amount;
      localStorage.setItem('demo_balance', newBalance.toString());

      const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;
      return txHash;
    }

    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    const amountWei = parseTokenAmount(amountInCPT);
    const tx = await this.contract.purchase(storeAddress, amountWei);
    await this.contract.providerOrAccount.waitForTransaction(tx.transaction_hash);

    return tx.transaction_hash;
  }

  async transfer(recipient: string, amountInCPT: string): Promise<string> {
    if (this.isDemoMode) {
      return this.purchase(recipient, amountInCPT);
    }

    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    const amountWei = parseTokenAmount(amountInCPT);
    const tx = await this.contract.transfer(recipient, amountWei);
    await this.contract.providerOrAccount.waitForTransaction(tx.transaction_hash);

    return tx.transaction_hash;
  }
}