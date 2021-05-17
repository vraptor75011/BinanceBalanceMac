import BinanceWallet from '../wallet/binance.wallet.model';
import { IWallet, IWalletApiConfig } from '../wallet/wallet.interfaces';
import { IPortfolio, IPortfolioApiConfig } from './portfolio.interfaces';

export default class Portfolio implements IPortfolio {
  apiConfig: IPortfolioApiConfig;
  nomicsAPI: IWalletApiConfig;
  wallets: IWallet[];

  constructor(portfolioApiConfig: IPortfolioApiConfig) {
    this.apiConfig = portfolioApiConfig;
    this.wallets = [];
    Object.keys(this.apiConfig).forEach((api: string) => {
      switch (api) {
        case 'binanceAPI': {
          this.wallets.push(
            new BinanceWallet(this.apiConfig[api as keyof IPortfolioApiConfig])
          );
          break;
        }
        case 'ftxAPI': {
          this.wallets.push(
            new BinanceWallet(this.apiConfig[api as keyof IPortfolioApiConfig])
          );
          break;
        }
        case 'nomicsAPI': {
          this.nomicsAPI = this.apiConfig[api as keyof IPortfolioApiConfig];
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  getBalance(): number {
    console.log(this.wallets[0].syncBalances());
    console.log('GetBalance');

    return 5;
  }
}
