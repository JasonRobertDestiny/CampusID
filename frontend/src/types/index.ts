export interface StudentInfo {
  avatarUri: string;
  studentName: string;
  studentId: string;
  tokenId?: string;
}

export interface TransactionRecord {
  id: string;
  type: 'checkin' | 'purchase';
  amount: string;
  timestamp: number;
  txHash?: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  description?: string;
}

export interface WalletState {
  address?: string;
  isConnected: boolean;
  balance?: string;
  hasNFT?: boolean;
}