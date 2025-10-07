// ================================
// Contract Addresses Configuration
// ================================

/**
 * Smart contract addresses for the Campus ID ecosystem
 * These addresses are loaded from environment variables for different networks
 */
export const CONTRACT_ADDRESSES = {
  /** Student NFT ERC721 contract address */
  STUDENT_NFT: import.meta.env.VITE_STUDENT_NFT_ADDRESS || '',
  /** Campus Token ERC20 contract address */
  CAMPUS_TOKEN: import.meta.env.VITE_CAMPUS_TOKEN_ADDRESS || '',
  /** Store contract address (defaults to zero address) */
  STORE: import.meta.env.VITE_STORE_ADDRESS || '0x0',
} as const;

// ================================
// Network Configuration
// ================================

/**
 * StarkNet network configuration settings
 * Provides RPC endpoints and explorer URLs for blockchain interaction
 */
export const NETWORK_CONFIG = {
  /** StarkNet chain identifier (e.g., 'sepolia', 'mainnet') */
  chainId: import.meta.env.VITE_STARKNET_NETWORK || 'sepolia',
  /** RPC endpoint URL for StarkNet network requests */
  rpcUrl: import.meta.env.VITE_STARKNET_RPC_URL || 'https://starknet-sepolia.public.blastapi.io',
  /** Block explorer URL for transaction verification */
  explorerUrl: import.meta.env.VITE_BLOCK_EXPLORER_URL || 'https://sepolia.voyager.online',
} as const;

// ================================
// Token Configuration
// ================================

/** Number of decimal places for Campus Token (CPT) */
export const TOKEN_DECIMALS = 18;

/** Reward amount (in CPT) for daily check-in */
export const CHECKIN_REWARD = '10';

// ================================
// Store Configuration
// ================================

/**
 * Product configuration for the campus store
 * Each product represents a purchasable item using Campus Tokens
 */
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
] as const;