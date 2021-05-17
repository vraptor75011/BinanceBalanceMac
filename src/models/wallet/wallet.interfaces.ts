export interface IWallet {
  syncBalances(): void;
  apiConfig: IWalletApiConfig;
  balances: IWalletAssetBalance[];
  //  computeGlobalBalance(): number;
}

export interface IWalletApiConfig {
  apiKey: string;
  apiSecret?: string;
  apiBaseEndPoint: string;
}

export interface IWalletAssetBalance {
  asset: string;
  free: number;
  locked: number;
  total: number;
}
