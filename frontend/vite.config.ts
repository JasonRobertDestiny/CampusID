import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React and React-DOM
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // StarkNet dependencies in separate chunk
          'vendor-starknet': ['starknet', 'get-starknet', '@starknet-io/get-starknet-core'],
          // Service layer chunk
          'services': [
            './src/services/studentNFT.ts',
            './src/services/campusToken.ts',
            './src/services/mockServices.ts'
          ],
          // Context providers chunk
          'contexts': [
            './src/contexts/AppContext.tsx',
            './src/contexts/WalletContext.tsx',
            './src/contexts/ToastContext.tsx'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 600,
    target: 'es2015',
    minify: 'esbuild'
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
