import { Contract, AccountInterface } from 'starknet';
import { CONTRACT_ADDRESSES } from '../utils/constants';

// Student NFT ABI (simplified)
const STUDENT_NFT_ABI = [
  {
    type: 'function',
    name: 'mint_student_nft',
    inputs: [
      { name: 'avatar_uri', type: 'core::byte_array::ByteArray' },
      { name: 'student_name', type: 'core::byte_array::ByteArray' },
      { name: 'student_id', type: 'core::byte_array::ByteArray' },
    ],
    outputs: [{ type: 'core::integer::u256' }],
    state_mutability: 'external',
  },
  {
    type: 'function',
    name: 'has_nft',
    inputs: [{ name: 'account', type: 'core::starknet::contract_address::ContractAddress' }],
    outputs: [{ type: 'core::bool' }],
    state_mutability: 'view',
  },
  {
    type: 'function',
    name: 'get_student_info',
    inputs: [{ name: 'token_id', type: 'core::integer::u256' }],
    outputs: [
      { type: 'core::byte_array::ByteArray' },
      { type: 'core::byte_array::ByteArray' },
      { type: 'core::byte_array::ByteArray' },
    ],
    state_mutability: 'view',
  },
  {
    type: 'function',
    name: 'balance_of',
    inputs: [{ name: 'account', type: 'core::starknet::contract_address::ContractAddress' }],
    outputs: [{ type: 'core::integer::u256' }],
    state_mutability: 'view',
  },
];

export class StudentNFTService {
  private contract: Contract | null = null;

  initialize(account: AccountInterface) {
    if (!CONTRACT_ADDRESSES.STUDENT_NFT) {
      throw new Error('Student NFT contract address not configured');
    }
    this.contract = new Contract(STUDENT_NFT_ABI, CONTRACT_ADDRESSES.STUDENT_NFT, account);
  }

  async hasNFT(address: string): Promise<boolean> {
    if (!this.contract) throw new Error('Contract not initialized');
    try {
      const result = await this.contract.has_nft(address);
      return result as boolean;
    } catch (error) {
      console.error('Error checking NFT:', error);
      return false;
    }
  }

  async mintNFT(
    avatarUri: string,
    studentName: string,
    studentId: string
  ): Promise<{ tokenId: string; txHash: string }> {
    if (!this.contract) throw new Error('Contract not initialized');

    const tx = await this.contract.mint_student_nft(avatarUri, studentName, studentId);
    await this.contract.providerOrAccount.waitForTransaction(tx.transaction_hash);

    return {
      tokenId: '1', // In production, extract from events
      txHash: tx.transaction_hash,
    };
  }

  async getStudentInfo(tokenId: string): Promise<{
    avatarUri: string;
    studentName: string;
    studentId: string;
  }> {
    if (!this.contract) throw new Error('Contract not initialized');

    const result = await this.contract.get_student_info(tokenId);
    return {
      avatarUri: result[0] as string,
      studentName: result[1] as string,
      studentId: result[2] as string,
    };
  }

  async getBalance(address: string): Promise<string> {
    if (!this.contract) throw new Error('Contract not initialized');
    const balance = await this.contract.balance_of(address);
    return balance.toString();
  }
}