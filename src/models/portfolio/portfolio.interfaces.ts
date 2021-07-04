import { IWalletType } from '../wallet/wallet.interfaces';

export interface IPortfolio {
  name: string;
  getBalance(): number;
}
export interface IPortfolioConfig {
  name: string;
  wallets: IWalletType[];
}
