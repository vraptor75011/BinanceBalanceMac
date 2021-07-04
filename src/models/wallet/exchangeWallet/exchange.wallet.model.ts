import Wallet from '../wallet.model';
import { IExchangeWalletConfig } from './exchange.wallet.interfaces';
import IExchangeWallet from './exchange.wallet.model';

export default class ExchangeWallet extends Wallet implements IExchangeWallet {
  exchange: string;
  apiKey: string;
  apiSecret: string;
  passphrase?: string;
  subaccount?: string;

  constructor(exchangeWalletConfig: IExchangeWalletConfig) {
    super(exchangeWalletConfig.name);
    this.exchange = exchangeWalletConfig.exchange;
    this.apiKey = exchangeWalletConfig.apiKey;
    this.apiSecret = exchangeWalletConfig.apiSecret;
    this.passphrase = exchangeWalletConfig.passphrase;
    this.subaccount = exchangeWalletConfig.subaccount;
  }
}
