import { IWallet, IWalletType } from '../wallet/wallet.interfaces';
import { IPortfolio, IPortfolioConfig } from './portfolio.interfaces';
import {
  IExchangeWalletConfig,
  SupportedExchanges,
} from '../wallet/exchangeWallet/exchange.wallet.interfaces';
import BinanceWallet from '../wallet/exchangeWallet/binanceWallet/binance.wallet.model';
import {
  IBlockchainWalletConfig,
  SupportedBlockchains,
} from '../wallet/blockchainWallet/blockchain.wallet.interfaces';

export default class Portfolio implements IPortfolio {
  name: string;
  wallets: IWallet[];

  constructor(portfolioConfig: IPortfolioConfig) {
    const { name, wallets } = portfolioConfig;
    console.log(name);
    this.name = name;
    this.wallets = [];
    this.initWallets(wallets);
  }

  initWallets(wallets: IWalletType[]) {
    const exchangeWallets: IExchangeWalletConfig[] = [];
    const blockchainWallets: IBlockchainWalletConfig[] = [];
    wallets.forEach((wallet: IWalletType) => {
      if ((wallet as IExchangeWalletConfig).exchange) {
        exchangeWallets.push(wallet as IExchangeWalletConfig);
        return;
      }
      if ((wallet as IBlockchainWalletConfig).blockchain) {
        blockchainWallets.push(wallet as IBlockchainWalletConfig);
        return;
      }
      console.log(
        'Error in json config file. Missing exchange or blockchain key in wallets' +
          wallet
      );
    });
    // Sort by exchange name then by named exchange (missing first)
    exchangeWallets.sort((a, b) =>
      a.exchange > b.exchange
        ? 1
        : a.exchange === b.exchange
        ? a.name
          ? 1
          : -1
        : -1
    );
    // Sort by blockchain name then by named blockchain wallet (missing first)
    blockchainWallets.sort((a, b) =>
      a.blockchain > b.blockchain
        ? 1
        : a.blockchain === b.blockchain
        ? a.name
          ? 1
          : -1
        : -1
    );
    // Verify Exchange in Supported exchanges
    const validatedExchangeWallets = exchangeWallets.filter((wallet) => {
      if (
        Object.values(SupportedExchanges).some((v) => v === wallet.exchange)
      ) {
        return true;
      } else {
        console.log('Exchange not supported yet : ' + wallet.exchange);
        return false;
      }
    });
    // Verify Blockchain in Supported blockchain
    const validatedBlockchainWallets = blockchainWallets.filter((wallet) => {
      if (
        Object.values(SupportedBlockchains).some((v) => v === wallet.blockchain)
      ) {
        return true;
      } else {
        console.log('Blockchain not supported yet : ' + wallet.blockchain);
        return false;
      }
    });
    // Create exchange name when name missing
    let indexName = 0;
    let exchangeName = '';
    validatedExchangeWallets.forEach((wallet) => {
      if (exchangeName != wallet.exchange) {
        exchangeName = wallet.exchange;
        indexName = 1;
      }
      if (wallet.name) {
      } else {
        wallet.name = 'Unnamed ' + wallet.exchange + ' exchange ' + indexName;
      }
      indexName = indexName + 1;
    });
    // Create blockchain wallet name when name missing
    let blockchainName = '';
    validatedBlockchainWallets.forEach((wallet) => {
      if (blockchainName != wallet.blockchain) {
        blockchainName = wallet.blockchain;
        indexName = 1;
      }
      if (wallet.name) {
      } else {
        wallet.name = 'Unnamed ' + wallet.blockchain + ' wallet ' + indexName;
      }
      indexName = indexName + 1;
    });
    // Create wallet class instances
    validatedExchangeWallets.forEach((walletConfig) => {
      walletConfig.exchange == 'binance'
        ? this.wallets.push(new BinanceWallet(walletConfig))
        : null;
    });
    //    console.log(this.wallets[0].balances);

    //    console.log(validatedExchangeWallets);
    //    console.log(validatedBlockchainWallets);
  }

  getBalance(): number {
    //    console.log(this.wallets[0].syncBalances());
    console.log('GetBalance');

    return 5;
  }
}
