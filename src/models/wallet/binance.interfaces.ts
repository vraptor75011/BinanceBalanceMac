export interface assetBalance {
  asset: string;
  free: number;
  locked: number;
}

export interface IBinanceConfig {
  recvWindow: number;
}

export interface IBinanceWalletConfig {
  config: IBinanceConfig;
}
