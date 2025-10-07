import { Contract, AccountInterface } from 'starknet';
import { CONTRACT_ADDRESSES } from '../utils/constants';
import { resolveDemoMode } from '../utils/helpers';

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
  private readonly isDemoMode: boolean;

  constructor(demoMode?: boolean) {
    this.isDemoMode = resolveDemoMode(demoMode);
  }

  initialize(account: AccountInterface) {
    if (this.isDemoMode) {
      // Demo mode operates against local storage only
      console.log('✅ Student NFT Service running in Demo Mode');
      return;
    }

    if (!CONTRACT_ADDRESSES.STUDENT_NFT || 
        CONTRACT_ADDRESSES.STUDENT_NFT === '' ||
        CONTRACT_ADDRESSES.STUDENT_NFT === '0x0' ||
        CONTRACT_ADDRESSES.STUDENT_NFT === '0x0000000000000000000000000000000000000000') {
      console.warn('⚠️ Student NFT contract not deployed. Please deploy contracts or enable Demo Mode.');
      throw new Error('🚀 Smart contracts not deployed yet! For the hackathon demo, please enable Demo Mode to test the app functionality.');
    }

    this.contract = new Contract(STUDENT_NFT_ABI, CONTRACT_ADDRESSES.STUDENT_NFT, account);
  }

  async hasNFT(address: string): Promise<boolean> {
    if (this.isDemoMode) {
      try {
        const data = localStorage.getItem('demo_hasNFT');
        return data === 'true';
      } catch {
        return false;
      }
    }

    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

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
    if (this.isDemoMode) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      localStorage.setItem('demo_hasNFT', 'true');
      localStorage.setItem('demo_studentInfo', JSON.stringify({ avatarUri, studentName, studentId }));
      const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;
      return { tokenId: '1', txHash };
    }

    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

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
    if (this.isDemoMode) {
      const data = localStorage.getItem('demo_studentInfo');
      if (data) {
        return JSON.parse(data);
      }
      return { avatarUri: '', studentName: '', studentId: '' };
    }

    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    const result = await this.contract.get_student_info(tokenId);
    return {
      avatarUri: result[0] as string,
      studentName: result[1] as string,
      studentId: result[2] as string,
    };
  }

  async getBalance(address: string): Promise<string> {
    if (this.isDemoMode) {
      const balance = localStorage.getItem('demo_balance') || '0';
      return balance;
    }

    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    const balance = await this.contract.balance_of(address);
    return balance.toString();
  }
}