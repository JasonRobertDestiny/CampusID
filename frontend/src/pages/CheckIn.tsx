import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { CampusTokenService } from '../services';
import { Button, Card } from '../components';
import { CHECKIN_REWARD, NETWORK_CONFIG } from '../utils/constants';
import { getExplorerTxUrl } from '../utils/helpers';
import './CheckIn.css';

export const CheckIn: React.FC = () => {
  const { account, isConnected } = useWallet();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string>('');
  const [balance, setBalance] = useState('0');

  const tokenService = new CampusTokenService();

  useEffect(() => {
    if (!isConnected) {
      navigate('/');
      return;
    }

    loadBalance();
  }, [isConnected, account]);

  const loadBalance = async () => {
    if (!account || !isConnected) return;

    try {
      tokenService.initialize(account);
      const balance = await tokenService.getBalance(account.address);
      setBalance(balance);
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  };

  const handleCheckIn = async () => {
    if (!account) return;

    try {
      setLoading(true);
      setSuccess(false);

      const hash = await tokenService.checkIn();
      setTxHash(hash);
      setSuccess(true);

      // Reload balance after successful check-in
      await loadBalance();

      // Save to local history
      const history = JSON.parse(localStorage.getItem('txHistory') || '[]');
      history.unshift({
        id: Date.now().toString(),
        type: 'checkin',
        amount: CHECKIN_REWARD,
        timestamp: Date.now(),
        txHash: hash,
        description: 'Daily check-in reward',
      });
      localStorage.setItem('txHistory', JSON.stringify(history.slice(0, 50))); // Keep last 50
    } catch (error) {
      console.error('Check-in error:', error);
      alert('Check-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkin-page">
      <header className="page-header">
        <Button onClick={() => navigate('/home')} variant="secondary">
          ← Back
        </Button>
        <h2>Check In</h2>
        <div style={{ width: '80px' }} />
      </header>

      <div className="checkin-content">
        <div className="balance-display">
          <p className="balance-label">Your Balance</p>
          <p className="balance-value">{balance} CPT</p>
        </div>

        {!success && (
          <Card className="checkin-card">
            <div className="checkin-icon">📝</div>
            <h3>Daily Check-In</h3>
            <p className="checkin-description">
              Check in to earn {CHECKIN_REWARD} Campus Points!
            </p>
            <div className="reward-highlight">
              <span className="reward-label">Reward</span>
              <span className="reward-amount">+{CHECKIN_REWARD} CPT</span>
            </div>
            <Button onClick={handleCheckIn} loading={loading} fullWidth>
              {loading ? 'Processing...' : 'Check In Now'}
            </Button>
          </Card>
        )}

        {success && (
          <Card className="success-card">
            <div className="success-icon">✅</div>
            <h3>Check-In Successful!</h3>
            <p className="success-message">
              You've earned {CHECKIN_REWARD} Campus Points
            </p>
            <div className="new-balance">
              <span>New Balance:</span>
              <span className="balance-highlight">{balance} CPT</span>
            </div>
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
            <div className="action-buttons">
              <Button onClick={() => navigate('/store')} fullWidth>
                Go to Store
              </Button>
              <Button onClick={() => navigate('/home')} variant="secondary" fullWidth>
                Back to Home
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};