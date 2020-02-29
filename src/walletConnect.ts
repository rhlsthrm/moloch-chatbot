import "node-window-polyfill/register";
import NodeWalletConnect from "@walletconnect/node";
var qrcode = require('qrcode-terminal');

// Create WalletConnector
const walletConnector = new NodeWalletConnect(
  {
    bridge: "https://bridge.walletconnect.org" // Required
  },
  {
    clientMeta: {
      description: "WalletConnect NodeJS Client",
      url: "https://nodejs.org/en/",
      icons: ["https://nodejs.org/static/images/logo.svg"],
      name: "WalletConnect",
    }
  }
);

// Check if connection is already established
export const connectWalletConnect = async () => {
  if (!walletConnector.connected) {
    // create new session
    walletConnector.createSession().then(() => {
      // get uri for QR Code modal
      const uri = walletConnector.uri;
      console.log('uri: ', uri);
      qrcode.generate(uri, { small: true });
    });
  } else {
    console.log(`Already connected!`);
  }
}

// Subscribe to connection events
walletConnector.on("connect", (error, payload) => {
  if (error) {
    throw error;
  }
  const { accounts, chainId } = payload.params[0];
  console.log('chainId: ', chainId);
  console.log('accounts: ', accounts);
});

walletConnector.on("session_update", (error, payload) => {
  if (error) {
    throw error;
  }

  // Get updated accounts and chainId
  const { accounts, chainId } = payload.params[0];
});

walletConnector.on("disconnect", (error, payload) => {
  if (error) {
    throw error;
  }
  // Delete walletConnector
});