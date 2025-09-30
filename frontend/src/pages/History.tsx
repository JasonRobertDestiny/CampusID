import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { Button, Card } from '../components';
import { NETWORK_CONFIG } from '../utils/constants';
import { getExplorerTxUrl } from '../utils/helpers';
import type { TransactionRecord } from '../types';
import './History.css';

export const History: React.FC = () => {
  const { isConnected } = useWallet();
  const navigate = useNavigate();
  const [history, setHistory] = useState<TransactionRecord[]>([]);
  const [filter, setFilter] = useState<'all' | 'checkin' | 'purchase'>('all');

  useEffect(() => {
    if (!isConnected) {
      navigate('/');
      return;
    }

    loadHistory();
  }, [isConnected]);

  const loadHistory = () => {
    const storedHistory = localStorage.getItem('txHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  };

  const filteredHistory = history.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTypeIcon = (type: string) => {
    return type === 'checkin' ? '📝' : '🛒';
  };

  const getTypeLabel = (type: string) => {
    return type === 'checkin' ? 'Check-in' : 'Purchase';
  };

  return (
    <div className="history-page">
      <header className="page-header">
        <Button onClick={() => navigate('/home')} variant="secondary">
          ← Back
        </Button>
        <h2>Transaction History</h2>
        <div style={{ width: '80px' }} />
      </header>

      <div className="history-content">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-tab ${filter === 'checkin' ? 'active' : ''}`}
            onClick={() => setFilter('checkin')}
          >
            Check-ins
          </button>
          <button
            className={`filter-tab ${filter === 'purchase' ? 'active' : ''}`}
            onClick={() => setFilter('purchase')}
          >
            Purchases
          </button>
        </div>

        {filteredHistory.length === 0 ? (
          <Card className="empty-state">
            <div className="empty-icon">📜</div>
            <h3>No Transactions Yet</h3>
            <p>Your transaction history will appear here</p>
            <Button onClick={() => navigate('/checkin')} fullWidth>
              Make Your First Check-in
            </Button>
          </Card>
        ) : (
          <div className="history-list">
            {filteredHistory.map((record) => (
              <Card key={record.id} className="history-item">
                <div className="history-header">
                  <div className="history-type">
                    <span className="type-icon">{getTypeIcon(record.type)}</span>
                    <span className="type-label">{getTypeLabel(record.type)}</span>
                  </div>
                  <span
                    className={`amount ${
                      record.type === 'checkin' ? 'positive' : 'negative'
                    }`}
                  >
                    {record.type === 'checkin' ? '+' : '-'}
                    {record.amount} CPT
                  </span>
                </div>
                {record.description && (
                  <p className="history-description">{record.description}</p>
                )}
                <div className="history-footer">
                  <span className="history-time">{formatDate(record.timestamp)}</span>
                  {record.txHash && (
                    <a
                      href={getExplorerTxUrl(record.txHash, NETWORK_CONFIG.explorerUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-tx"
                    >
                      View →
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};