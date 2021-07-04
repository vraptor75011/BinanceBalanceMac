export interface IExchangeWallet {
  exchange: string;
  apiKey: string;
  apiSecret: string;
  passphrase?: string;
  subaccount?: string;
}

export enum SupportedExchanges {
  BINANCE = 'binance',
  FTX = 'ftx',
  KUCOIN = 'kucoin',
}

export type IExchangeWalletConfig = {
  exchange: string;
  apiKey: string;
  apiSecret: string;
  name?: string;
  passphrase?: string;
  subaccount?: string;
};
