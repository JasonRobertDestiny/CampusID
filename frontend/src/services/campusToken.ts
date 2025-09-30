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
    if (!CONTRACT_ADDRESSES.CAMPUS_TOKEN) {
      throw new Error('Campus Token contract address not configured');
    }
    this.contract = new Contract(CAMPUS_TOKEN_ABI, CONTRACT_ADDRESSES.CAMPUS_TOKEN, account);
  }

  async getBalance(address: string): Promise<string> {
    if (!this.contract) throw new Error('Contract not initialized');
    try {
      const balance = await this.contract.balance_of(address);
      return formatTokenAmount(balance.toString());
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  }

  async checkIn(): Promise<string> {
    if (!this.contract) throw new Error('Contract not initialized');

    const tx = await this.contract.check_in();
    await this.contract.providerOrAccount.waitForTransaction(tx.transaction_hash);

    return tx.transaction_hash;
  }

  async purchase(storeAddress: string, amountInCPT: string): Promise<string> {
    if (!this.contract) throw new Error('Contract not initialized');

    const amountWei = parseTokenAmount(amountInCPT);
    const tx = await this.contract.purchase(storeAddress, amountWei);
    await this.contract.providerOrAccount.waitForTransaction(tx.transaction_hash);

    return tx.transaction_hash;
  }

  async transfer(recipient: string, amountInCPT: string): Promise<string> {
    if (!this.contract) throw new Error('Contract not initialized');

    const amountWei = parseTokenAmount(amountInCPT);
    const tx = await this.contract.transfer(recipient, amountWei);
    await this.contract.providerOrAccount.waitForTransaction(tx.transaction_hash);

    return tx.transaction_hash;
  }
}