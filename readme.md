# Solana Wallet Connection Example

This project provides a React application implementation that connects to Solana wallets using the Solana Wallet Adapter library. It includes features to connect to Solflare and Phantom wallet types, importing a custom wallet, and displaying wallet information.

## Features

- Connect to Phantom, Solflare, and other Solana wallets
- Import custom wallets using a JSON keypair file
- Display connected wallet address
- Automatic reconnection to previously connected wallets
- Devnet network support

## Prerequisites

- Node.js (v14 or later recommended)
- npm (v6 or later)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/solana-wallet-app.git
cd solana-wallet-app
```

2. Install dependencies:

```bash
npm install
```

## Usage

To start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Project Structure

- `src/index.js`: Entry point of the application
- `src/App.js`: Main component containing wallet connection logic
- `public/index.html`: HTML template
- `webpack.config.js`: Webpack configuration
- `package.json`: Project dependencies and scripts
- `.babelrc`: Babel configuration

## Dependencies

- React
- @solana/wallet-adapter-react
- @solana/wallet-adapter-wallets
- @solana/web3.js

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be available in the `dist` directory.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

Apache License 2.0

Copyright [2024] [farawaystar]

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
