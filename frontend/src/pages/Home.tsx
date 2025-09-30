import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { StudentNFTService, CampusTokenService } from '../services';
import { Button, Card, Loading } from '../components';
import { shortAddress } from '../utils/helpers';
import './Home.css';

export const Home: React.FC = () => {
  const { account, address, isConnected, disconnectWallet } = useWallet();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasNFT, setHasNFT] = useState(false);
  const [balance, setBalance] = useState('0');
  const [studentInfo, setStudentInfo] = useState({
    avatarUri: '',
    studentName: '',
    studentId: '',
  });
  const [showMintForm, setShowMintForm] = useState(false);
  const [minting, setMinting] = useState(false);

  const nftService = new StudentNFTService();
  const tokenService = new CampusTokenService();

  useEffect(() => {
    if (!isConnected) {
      navigate('/');
      return;
    }

    loadData();
  }, [isConnected, account]);

  const loadData = async () => {
    if (!account || !address) return;

    try {
      setLoading(true);
      nftService.initialize(account);
      tokenService.initialize(account);

      const [nftExists, tokenBalance] = await Promise.all([
        nftService.hasNFT(address),
        tokenService.getBalance(address),
      ]);

      setHasNFT(nftExists);
      setBalance(tokenBalance);

      if (nftExists) {
        // Get student info (assuming tokenId = 1 for demo)
        const info = await nftService.getStudentInfo('1');
        setStudentInfo(info);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMintNFT = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!account) return;

    try {
      setMinting(true);
      const formData = new FormData(e.currentTarget);
      const avatarUri = formData.get('avatar') as string;
      const studentName = formData.get('name') as string;
      const studentId = formData.get('id') as string;

      await nftService.mintNFT(avatarUri, studentName, studentId);
      await loadData();
      setShowMintForm(false);
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('Failed to mint NFT. Please try again.');
    } finally {
      setMinting(false);
    }
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    navigate('/');
  };

  if (loading) {
    return <Loading message="Loading your profile..." />;
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <h2>🎓 Campus ID</h2>
        <div className="header-actions">
          <span className="address-display">{shortAddress(address || '')}</span>
          <Button onClick={handleDisconnect} variant="secondary">
            Disconnect
          </Button>
        </div>
      </header>

      <div className="home-content">
        <div className="balance-card">
          <h3>Campus Points Balance</h3>
          <p className="balance-amount">{balance} CPT</p>
        </div>

        {!hasNFT && !showMintForm && (
          <Card className="nft-prompt">
            <h3>Get Your Student Certificate</h3>
            <p>Mint your NFT student certificate to access campus features</p>
            <Button onClick={() => setShowMintForm(true)} fullWidth>
              Mint Student NFT
            </Button>
          </Card>
        )}

        {showMintForm && (
          <Card className="mint-form-card">
            <h3>Create Student Certificate</h3>
            <form onSubmit={handleMintNFT} className="mint-form">
              <div className="form-group">
                <label>Avatar URL</label>
                <input
                  type="text"
                  name="avatar"
                  placeholder="https://..."
                  defaultValue="https://via.placeholder.com/150"
                  required
                />
              </div>
              <div className="form-group">
                <label>Student Name</label>
                <input type="text" name="name" placeholder="Your name" required />
              </div>
              <div className="form-group">
                <label>Student ID</label>
                <input
                  type="text"
                  name="id"
                  placeholder="Student ID"
                  defaultValue={`STU${Date.now().toString().slice(-6)}`}
                  required
                />
              </div>
              <div className="form-actions">
                <Button type="submit" loading={minting} fullWidth>
                  Mint NFT
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowMintForm(false)}
                  fullWidth
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {hasNFT && (
          <Card className="student-card">
            <div className="card-header">
              <h3>Student Certificate</h3>
              <span className="nft-badge">NFT</span>
            </div>
            <div className="card-content">
              <div className="avatar">
                {studentInfo.avatarUri ? (
                  <img src={studentInfo.avatarUri} alt="Avatar" />
                ) : (
                  <div className="avatar-placeholder">👤</div>
                )}
              </div>
              <div className="student-details">
                <div className="detail-row">
                  <span className="label">Name:</span>
                  <span className="value">{studentInfo.studentName}</span>
                </div>
                <div className="detail-row">
                  <span className="label">ID:</span>
                  <span className="value">{studentInfo.studentId}</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {hasNFT && (
          <div className="action-buttons">
            <Button onClick={() => navigate('/checkin')} fullWidth>
              📝 Check In
            </Button>
            <Button onClick={() => navigate('/store')} fullWidth variant="secondary">
              🛒 Campus Store
            </Button>
            <Button onClick={() => navigate('/history')} fullWidth variant="secondary">
              📜 History
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};