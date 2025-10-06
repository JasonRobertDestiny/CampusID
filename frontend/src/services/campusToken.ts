import { Contract, AccountInterface } from 'starknet';
import { CONTRACT_ADDRESSES } from '../utils/constants';
import { formatTokenAmount, parseTokenAmount } from '../utils/helpers';

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

  initialize(account: AccountInterface) {
    const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

    if (!CONTRACT_ADDRESSES.CAMPUS_TOKEN || CONTRACT_ADDRESSES.CAMPUS_TOKEN === '0x0000000000000000000000000000000000000000000000000000000000000000') {
      if (!isDemoMode) {
        throw new Error('Campus Token contract address not configured. Please deploy contracts and update environment variables.');
      }
      // In demo mode, don't initialize the contract
      return;
    }

    this.contract = new Contract(CAMPUS_TOKEN_ABI, CONTRACT_ADDRESSES.CAMPUS_TOKEN, account);
  }

  async getBalance(address: string): Promise<string> {
    const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

    if (!this.contract) {
      if (isDemoMode) {
        // In demo mode, get from localStorage
        const balance = localStorage.getItem('demo_balance') || '0';
        return formatTokenAmount(balance);
      }
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
    const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

    if (!this.contract) {
      if (isDemoMode) {
        // In demo mode, simulate check-in
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const currentBalance = parseFloat(localStorage.getItem('demo_balance') || '0');
        const newBalance = currentBalance + 10;
        localStorage.setItem('demo_balance', newBalance.toString());

        const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;

        // Add to history
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
      throw new Error('Contract not initialized');
    }

    const tx = await this.contract.check_in();
    await this.contract.providerOrAccount.waitForTransaction(tx.transaction_hash);

    return tx.transaction_hash;
  }

  async purchase(storeAddress: string, amountInCPT: string): Promise<string> {
    const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

    if (!this.contract) {
      if (isDemoMode) {
        // In demo mode, simulate purchase
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
      throw new Error('Contract not initialized');
    }

    const amountWei = parseTokenAmount(amountInCPT);
    const tx = await this.contract.purchase(storeAddress, amountWei);
    await this.contract.providerOrAccount.waitForTransaction(tx.transaction_hash);

    return tx.transaction_hash;
  }

  async transfer(recipient: string, amountInCPT: string): Promise<string> {
    const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

    if (!this.contract) {
      if (isDemoMode) {
        // In demo mode, simulate transfer
        return this.purchase(recipient, amountInCPT);
      }
      throw new Error('Contract not initialized');
    }

    const amountWei = parseTokenAmount(amountInCPT);
    const tx = await this.contract.transfer(recipient, amountWei);
    await this.contract.providerOrAccount.waitForTransaction(tx.transaction_hash);

    return tx.transaction_hash;
  }
}