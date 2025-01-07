import React, { useState, useMemo } from 'react';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter, PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, Keypair } from '@solana/web3.js';


// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

function App() {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const [importedWallet, setImportedWallet] = useState(null);

    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // of wallets that your users connect to will be loaded
    const wallets = useMemo(
        () => [
            /**
             * Select the wallets you wish to support, by instantiating wallet adapters here.
             *
             * Common adapters can be found in the npm package `@solana/wallet-adapter-wallets`.
             * That package supports tree shaking and lazy loading -- only the wallets you import
             * will be compiled into your application.
             *
             * Uncomment the following lines to add more wallet adapters
             */
            // new PhantomWalletAdapter(),
            // new SlopeWalletAdapter(),
            // new SolflareWalletAdapter(),
            // new TorusWalletAdapter(),
            // new LedgerWalletAdapter(),
            // new SolletWalletAdapter(),
            new UnsafeBurnerWalletAdapter(),
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            ...(importedWallet ? [importedWallet] : []),
        ],
        [importedWallet]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <div className="App">
                        <header className="App-header">
                            <h1>Solana Wallet Connection Example</h1>
                            <WalletMultiButton />
                            <WalletInfo />
                            <WalletDisconnectButton />
                            <ImportWallet setImportedWallet={setImportedWallet} />
                        </header>
                    </div>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

function WalletInfo() {
    const { publicKey, connected, connecting, error } = useWallet();
    // console.log("WalletInfo rendered, publicKey:", publicKey);

    if (error) {
      return <p>Error: {error.message}</p>;
    }

    if (connecting) {
      return <p>Connecting...</p>;
    }

    if (!connected || !publicKey) {
      return <p>Please connect your wallet</p>;
    }

    if (!publicKey) {
        console.log("No wallet connected");
        return <p>Please connect your wallet</p>;
    }

    console.log("Wallet connected, address:", publicKey.toBase58());
    return (
      <div>
        <p>Your wallet is connected!</p>
        <p>Address: {publicKey.toBase58()}</p>
      </div>
    );
  }
  
function ImportWallet({ setImportedWallet }) {
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const keypairData = JSON.parse(e.target.result);
            const keypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
            const customWalletAdapter = {
              name: 'Imported Wallet',
              url: 'https://solana.com',
              icon: 'https://solana.com/favicon.ico',
              publicKey: keypair.publicKey,
              connecting: false,
              connected: false,
              readyState: 'Installed',
              signTransaction: async (transaction) => {
                transaction.partialSign(keypair);
                return transaction;
              },
              signAllTransactions: async (transactions) => {
                return transactions.map((transaction) => {
                  transaction.partialSign(keypair);
                  return transaction;
                });
              },
              connect: async () => {
                customWalletAdapter.connected = true;
                customWalletAdapter.emit('connect');
              },
              disconnect: async () => {
                customWalletAdapter.connected = false;
                customWalletAdapter.emit('disconnect');
              },
              on: (event, callback) => {
                if (!customWalletAdapter._events) customWalletAdapter._events = {};
                if (!customWalletAdapter._events[event]) customWalletAdapter._events[event] = [];
                customWalletAdapter._events[event].push(callback);
              },
              off: (event, callback) => {
                if (!customWalletAdapter._events || !customWalletAdapter._events[event]) return;
                const index = customWalletAdapter._events[event].indexOf(callback);
                if (index > -1) customWalletAdapter._events[event].splice(index, 1);
              },
              emit: (event, ...args) => {
                if (!customWalletAdapter._events || !customWalletAdapter._events[event]) return;
                customWalletAdapter._events[event].forEach(callback => callback(...args));
              },
              _events: {}
            };
            setImportedWallet(customWalletAdapter);
          } catch (error) {
            console.error('Error importing wallet:', error);
            alert('Invalid keypair file');
          }
        };
        reader.readAsText(file);
      }
    };
  
    return (
      <div>
        <h2>Import Wallet</h2>
        <input type="file" onChange={handleFileUpload} accept=".json" />
      </div>
    );
  }   

export default App;