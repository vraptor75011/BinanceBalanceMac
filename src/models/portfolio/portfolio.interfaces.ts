import { IWalletApiConfig } from '../wallet/wallet.interfaces';

export interface IPortfolio {
  getBalance(): number;
}

export interface IPortfolioApiConfig {
  nomicsAPI: IWalletApiConfig;
  binanceAPI?: IWalletApiConfig;
  ftxAPI?: IWalletApiConfig;
}
