export const CONTRACT_ADDRESSES = {
  STUDENT_NFT: import.meta.env.VITE_STUDENT_NFT_ADDRESS || '',
  CAMPUS_TOKEN: import.meta.env.VITE_CAMPUS_TOKEN_ADDRESS || '',
  STORE: import.meta.env.VITE_STORE_ADDRESS || '0x0', // Default store address
};

export const NETWORK_CONFIG = {
  chainId: import.meta.env.VITE_STARKNET_NETWORK || 'sepolia',
  rpcUrl: import.meta.env.VITE_STARKNET_RPC_URL || 'https://starknet-sepolia.public.blastapi.io',
  explorerUrl: import.meta.env.VITE_BLOCK_EXPLORER_URL || 'https://sepolia.voyager.online',
};

export const TOKEN_DECIMALS = 18;
export const CHECKIN_REWARD = '10'; // 10 CPT

export const PRODUCTS = [
  {
    id: '1',
    name: 'Coffee',
    price: '20',
    image: '☕',
    description: 'Fresh brewed coffee',
  },
  {
    id: '2',
    name: 'Bread',
    price: '30',
    image: '🍞',
    description: 'Freshly baked bread',
  },
  {
    id: '3',
    name: 'Drink',
    price: '50',
    image: '🥤',
    description: 'Cold refreshing drink',
  },
];