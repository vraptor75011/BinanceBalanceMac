import { IWallet, IWalletAssetBalance, IWalletType } from './wallet.interfaces';

export default class Wallet implements IWallet {
  name: string;
  balances: IWalletAssetBalance[];

  constructor(name: string) {
    this.name = name;
    this.balances = [];
  }
}
