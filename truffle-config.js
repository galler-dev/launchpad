/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * trufflesuite.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

const HDWalletProvider = require("@truffle/hdwallet-provider");
const LedgerWalletProvider = require('@umaprotocol/truffle-ledger-provider');

const ledgerBSCMainNetOptions = {
  networkId: 56, // mainnet
  path: "44'/60'/0'/0/0", // ledger default derivation path
  askConfirm: false,
  accountsLength: 1,
  accountsOffset: 0
};

const ledgerETHMainNetOptions = {
  networkId: 1, // mainnet
  path: "44'/60'/0'/0/0", // ledger default derivation path
  askConfirm: false,
  accountsLength: 1,
  accountsOffset: 0
};

const mnemonic = "";

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */
  plugins: ["truffle-plugin-verify"],
  api_keys: {
    etherscan: "WM8UW6KNCUFDKDGNWPHK1IGIGXTWY75MY4",
    bscscan: "EVHEH1IFZPH4ZNBSHT26B3PZ5XP6UI3QNR",
  },
  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
    bsc_testnet: {
      provider: () => new HDWalletProvider(mnemonic, `https://data-seed-prebsc-1-s1.binance.org:8545`),
      network_id: 97,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/3358a14dd2c746bc9d38f85f9c7aefc8");
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
      skipDryRun: true,
    },
    bsc_main: {
      provider: function() {
        return new LedgerWalletProvider(ledgerBSCMainNetOptions, 'https://bsc-dataseed.binance.org/');
      },
      network_id: 56,
      networkCheckTimeout: 50000,
      gasPrice: 8000000000,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: false
    },
    eth_main: {
      provider: function() {
        return new LedgerWalletProvider(ledgerETHMainNetOptions, 'https://eth-mainnet.nodereal.io/v1/eebeba638e7f4a86930990fb8cacec38');
      },
      network_id: 1,
      networkCheckTimeout: 50000,
      gasPrice: 120000000000,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.0",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  },

  // Truffle DB is currently disabled by default; to enable it, change enabled: false to enabled: true
  //
  // Note: if you migrated your contracts prior to enabling this field in your Truffle project and want
  // those previously migrated contracts available in the .db directory, you will need to run the following:
  // $ truffle migrate --reset --compile-all

  db: {
    enabled: false
  }
};
