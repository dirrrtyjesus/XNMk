import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState } from 'react';
import { composeDaThiccNowMetadata } from './features/meme/MetadataComposer';
import { mintDaThiccNowPNFT } from './services/metaplex';
import { uploadToIPFS, uploadMetadataToIPFS } from './services/ipfs';
import { getTensorItemUrl, getSolanaExplorerUrl, getSolanaTokenUrl } from './services/tensor';
import './styles/index.css';

type MintStatus = 'idle' | 'uploading' | 'composing' | 'minting' | 'success' | 'error';

interface MintResultData {
  mintAddress: string;
  signature: string;
  goldenSeed: number;
  tensorUrl: string;
  explorerUrl: string;
  tokenUrl: string;
}

function App() {
  const wallet = useWallet();
  const [status, setStatus] = useState<MintStatus>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [mintResult, setMintResult] = useState<MintResultData | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const handleMint = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      setStatusMessage('Please connect your wallet first');
      setStatus('error');
      return;
    }

    try {
      setStatus('uploading');
      setProgress(10);
      setStatusMessage('🜏 Loading daThiccNOW Deer image...');

      // Load the Bodhisattva Deer image from public assets
      const imageResponse = await fetch('/assets/dathiccnow-deer.png');
      if (!imageResponse.ok) {
        throw new Error('Failed to load image asset');
      }
      const imageBlob = await imageResponse.blob();
      const imageFile = new File([imageBlob], 'bodhisattva-deer.png', { type: 'image/png' });

      setProgress(25);
      setStatusMessage('⬆️ Uploading image to IPFS...');
      const { uri: imageUri } = await uploadToIPFS(imageFile);

      setStatus('composing');
      setProgress(40);
      setStatusMessage('🜏 Composing golden metadata with φ-modulation...');

      const prompt = 'daThiccNOW Bodhisattva Deer welcomes the stranger';
      const { metadata, goldenSeed } = await composeDaThiccNowMetadata(
        prompt,
        imageUri,
        wallet.publicKey.toBase58()
      );

      setProgress(55);
      setStatusMessage('⬆️ Uploading metadata to IPFS...');
      const { uri: metadataUri } = await uploadMetadataToIPFS(metadata);

      setStatus('minting');
      setProgress(70);
      setStatusMessage(`🜏 Minting pNFT with golden seed ${goldenSeed}...`);

      const rpcEndpoint = import.meta.env.VITE_RPC_ENDPOINT || 'https://api.devnet.solana.com';

      const result = await mintDaThiccNowPNFT(wallet, {
        name: metadata.name,
        uri: metadataUri,
        symbol: 'THICC',
        goldenSeed,
      }, rpcEndpoint);

      setProgress(100);

      const tensorUrl = getTensorItemUrl(result.mintAddress);
      const explorerUrl = getSolanaExplorerUrl(result.signature);
      const tokenUrl = getSolanaTokenUrl(result.mintAddress);

      setMintResult({
        mintAddress: result.mintAddress,
        signature: result.signature,
        goldenSeed: result.goldenSeed,
        tensorUrl,
        explorerUrl,
        tokenUrl,
      });

      setStatus('success');
      setStatusMessage('✨ Meme composed! The orbit thickens 🜏 ∞ 🜏');

    } catch (error) {
      console.error('Minting failed:', error);
      setStatus('error');

      // Parse error message for better UX
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (errorMessage.includes('no record of a prior credit') ||
        errorMessage.includes('insufficient') ||
        errorMessage.includes('0x1')) {
        setStatusMessage(
          `❌ Insufficient SOL! Your wallet needs devnet SOL for fees. ` +
          `Visit https://faucet.solana.com to get free devnet SOL, then try again.`
        );
      } else if (errorMessage.includes('User rejected')) {
        setStatusMessage('❌ Transaction cancelled by user');
      } else {
        setStatusMessage(`❌ Decoherence event: ${errorMessage}`);
      }
      setProgress(0);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>daThiccNOW<br /><span className="title-deer">Bodhisattva Deer</span></h1>
        <p className="subtitle">Meme Genesis</p>
        <WalletMultiButton />
      </header>

      <main className="terminal-card">
        <div className="xenial-glyph">🜏 ∞ 🜏</div>

        <h2>Mint pNFT</h2>
        <p>Golden-ratio modulated memetic artifact on Solana</p>

        <div className="nft-preview">
          <img
            src="/assets/dathiccnow-deer.png"
            alt="Da Bodhisattva Deer - Enlightened as heck, but still here for you"
          />
        </div>

        <ul className="features">
          <li>φ-Seed Derivation (1.618 modulation)</li>
          <li>6.18% Golden Royalties (618 bps)</li>
          <li>Programmable NFT (pNFT) Standard</li>
          <li>Tensor-Ready Provenance</li>
          <li>XNMk × MEMEk × augLABS</li>
        </ul>

        <button
          className="btn-golden"
          onClick={handleMint}
          disabled={!wallet.connected || status === 'uploading' || status === 'composing' || status === 'minting'}
        >
          {!wallet.connected
            ? 'Connect Wallet First'
            : status === 'idle' || status === 'error' || status === 'success'
              ? 'Compose Meme'
              : <><span className="loading" /> Composing...</>
          }
        </button>

        {(status !== 'idle' && progress > 0) && (
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
        )}

        {statusMessage && (
          <p className={`status ${status === 'success' ? 'success' : ''} ${status === 'error' ? 'error' : ''}`}>
            {statusMessage}
          </p>
        )}

        {mintResult && (
          <div className="result">
            <p><strong>🎉 Minted Successfully!</strong></p>
            <p>Golden Seed: <code>{mintResult.goldenSeed}</code></p>
            <p>Mint Address: <code>{mintResult.mintAddress}</code></p>

            <div className="links-row">
              <a
                href={mintResult.tokenUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-golden"
              >
                View on Explorer
              </a>
              <a
                href={mintResult.tensorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-golden"
              >
                List on Tensor
              </a>
            </div>
          </div>
        )}
      </main>

      <footer>
        <p>augLABS × XNMk × MEMEk</p>
        <p className="xenial-glyph">🜏 ∞ 🜏</p>
        <p>The future is not built through competition, but composed wif vibes.</p>
      </footer>
    </div>
  );
}

export default App;
