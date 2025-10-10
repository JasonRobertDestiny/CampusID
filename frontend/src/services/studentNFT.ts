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
      return;
    }

    if (!CONTRACT_ADDRESSES.STUDENT_NFT || CONTRACT_ADDRESSES.STUDENT_NFT === '0x0000000000000000000000000000000000000000') {
      throw new Error('🚀 Smart contracts not deployed yet! For the hackathon demo, please enable Demo Mode to test the app functionality.');
    }

    this.contract = new Contract(STUDENT_NFT_ABI, CONTRACT_ADDRESSES.STUDENT_NFT, account);
  }

  async hasNFT(address: string, retries = 3): Promise<boolean> {
    if (this.isDemoMode) {
      try {
        const data = localStorage.getItem('demo_hasNFT');
        return data === 'true';
      } catch {
        return false;
      }
    }

    if (!this.contract) {
      throw new Error('Contract not initialized. Please connect your wallet.');
    }

    // Retry logic with exponential backoff
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const result = await this.contract.has_nft(address);
        return result as boolean;
      } catch (error) {
        if (attempt === retries - 1) {
          console.error('Error checking NFT after retries:', error);
          return false;
        }

        // Exponential backoff: 1s, 2s, 4s
        const delayMs = Math.pow(2, attempt) * 1000;
        console.warn(`Retry ${attempt + 1}/${retries} for hasNFT after ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    return false;
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
      throw new Error('Contract not initialized. Please connect your wallet first.');
    }

    try {
      const tx = await this.contract.mint_student_nft(avatarUri, studentName, studentId);

      if (!tx || !tx.transaction_hash) {
        throw new Error('Transaction failed: No transaction hash received.');
      }

      console.log(`NFT mint transaction sent: ${tx.transaction_hash}`);

      // Wait for transaction confirmation with retry
      let confirmed = false;
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          await this.contract.providerOrAccount.waitForTransaction(tx.transaction_hash);
          confirmed = true;
          break;
        } catch (error) {
          if (attempt === 4) {
            throw new Error('Transaction confirmation timeout. Please check block explorer for status.');
          }
          console.warn(`Waiting for confirmation... attempt ${attempt + 1}/5`);
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }

      if (!confirmed) {
        throw new Error('Transaction sent but confirmation timed out. Check block explorer.');
      }

      return {
        tokenId: '1', // In production, extract from events
        txHash: tx.transaction_hash,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('User rejected')) {
          throw new Error('Transaction rejected by user.');
        }
        if (error.message.includes('insufficient funds')) {
          throw new Error('Insufficient funds for gas fee. Please add testnet ETH.');
        }
        if (error.message.includes('already has NFT')) {
          throw new Error('You already have a student NFT. Each address can only have one.');
        }
        throw error;
      }
      throw new Error('Failed to mint NFT. Please try again or contact support.');
    }
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