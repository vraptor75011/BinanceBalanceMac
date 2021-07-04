import { IBlockchainWalletConfig } from './blockchainWallet/blockchain.wallet.interfaces';
import { IExchangeWalletConfig } from './exchangeWallet/exchange.wallet.interfaces';
export interface IWallet {
  name: string;
  balances: IWalletAssetBalance[];
  //  syncBalances(): void;
  //  balances: IWalletAssetBalance[];
}
export interface IWalletAssetBalance {
  asset: string;
  free: number;
  used: number;
  total: number;
}

export type IWalletType = IExchangeWalletConfig | IBlockchainWalletConfig;
