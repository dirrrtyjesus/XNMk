import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WalletProvider } from './features/wallet/WalletProvider'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletProvider>
      <App />
    </WalletProvider>
  </StrictMode>,
)
