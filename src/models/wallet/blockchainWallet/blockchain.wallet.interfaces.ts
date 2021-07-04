export enum SupportedBlockchains {
  TERRA = 'terra',
  BSC = 'bsc',
  POLYGON = 'polygon',
  ETHEREUM = 'ethereum',
  DEFICHAIN = 'defichain',
}

export type IBlockchainWalletConfig = {
  blockchain: string;
  address: string;
  name?: string;
};
