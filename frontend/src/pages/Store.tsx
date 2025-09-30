import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { CampusTokenService } from '../services';
import { Button, Card, Loading } from '../components';
import { PRODUCTS, CONTRACT_ADDRESSES, NETWORK_CONFIG } from '../utils/constants';
import { getExplorerTxUrl } from '../utils/helpers';
import type { Product } from '../types';
import './Store.css';

export const Store: React.FC = () => {
  const { account, isConnected } = useWallet();
  const navigate = useNavigate();
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState<Product | null>(null);
  const [txHash, setTxHash] = useState<string>('');

  const tokenService = new CampusTokenService();

  useEffect(() => {
    if (!isConnected) {
      navigate('/');
      return;
    }

    loadBalance();
  }, [isConnected, account]);

  const loadBalance = async () => {
    if (!account) return;

    try {
      setLoading(true);
      tokenService.initialize(account);
      const balance = await tokenService.getBalance(account.address);
      setBalance(balance);
    } catch (error) {
      console.error('Error loading balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (product: Product) => {
    if (!account) return;

    const currentBalance = parseFloat(balance);
    const productPrice = parseFloat(product.price);

    if (currentBalance < productPrice) {
      alert('Insufficient balance! Please check in to earn more CPT.');
      return;
    }

    try {
      setPurchasing(product.id);
      setPurchaseSuccess(null);

      const hash = await tokenService.purchase(
        CONTRACT_ADDRESSES.STORE,
        product.price
      );

      setTxHash(hash);
      setPurchaseSuccess(product);

      // Reload balance
      await loadBalance();

      // Save to local history
      const history = JSON.parse(localStorage.getItem('txHistory') || '[]');
      history.unshift({
        id: Date.now().toString(),
        type: 'purchase',
        amount: product.price,
        timestamp: Date.now(),
        txHash: hash,
        description: `Purchased ${product.name}`,
      });
      localStorage.setItem('txHistory', JSON.stringify(history.slice(0, 50)));
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) {
    return <Loading message="Loading store..." />;
  }

  return (
    <div className="store-page">
      <header className="page-header">
        <Button onClick={() => navigate('/home')} variant="secondary">
          ← Back
        </Button>
        <h2>Campus Store</h2>
        <div style={{ width: '80px' }} />
      </header>

      <div className="store-content">
        <div className="balance-display">
          <p className="balance-label">Available Balance</p>
          <p className="balance-value">{balance} CPT</p>
        </div>

        {purchaseSuccess && (
          <Card className="purchase-success">
            <div className="success-icon">🎉</div>
            <h3>Purchase Successful!</h3>
            <p>You bought {purchaseSuccess.name} for {purchaseSuccess.price} CPT</p>
            {txHash && (
              <a
                href={getExplorerTxUrl(txHash, NETWORK_CONFIG.explorerUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="tx-link"
              >
                View Transaction →
              </a>
            )}
            <Button onClick={() => setPurchaseSuccess(null)} fullWidth variant="secondary">
              Continue Shopping
            </Button>
          </Card>
        )}

        <div className="products-grid">
          {PRODUCTS.map((product) => (
            <Card key={product.id} className="product-card" hoverable>
              <div className="product-image">{product.image}</div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                {product.description && (
                  <p className="product-description">{product.description}</p>
                )}
                <div className="product-footer">
                  <span className="product-price">{product.price} CPT</span>
                  <Button
                    onClick={() => handlePurchase(product)}
                    loading={purchasing === product.id}
                    disabled={parseFloat(balance) < parseFloat(product.price)}
                  >
                    {purchasing === product.id ? 'Buying...' : 'Buy'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="store-footer">
          <p className="footer-note">
            💡 Check in daily to earn more Campus Points!
          </p>
          <Button onClick={() => navigate('/checkin')} fullWidth>
            Go to Check-In
          </Button>
        </div>
      </div>
    </div>
  );
};