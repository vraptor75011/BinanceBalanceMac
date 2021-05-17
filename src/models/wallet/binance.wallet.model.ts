import axios, { AxiosRequestConfig, Method } from 'axios';
import * as crypto from 'crypto';
import * as qs from 'qs';
import { IBinanceConfig, IBinanceWalletConfig } from './binance.interfaces';
import {
  IWallet,
  IWalletApiConfig,
  IWalletAssetBalance,
} from './wallet.interfaces';

export default class BinanceWallet implements IWallet, IBinanceWalletConfig {
  apiConfig: IWalletApiConfig;
  balances: IWalletAssetBalance[];
  config: IBinanceConfig;

  constructor(walletApiConfig: IWalletApiConfig) {
    this.apiConfig = walletApiConfig;
    this.balances = [];
    this.config = {
      recvWindow: 20000,
    };
  }

  public syncBalances(): void {
    const data = {
      recvWindow: this.config.recvWindow,
      timestamp: Date.now(),
    };
    this.privateRequest(data, '/api/v3/account', 'GET').then((response) => {
      //      console.log(response);
      this.balances = response.data.balances.filter((obj: any) => {
        console.log(obj);
        return parseFloat(obj.free) != 0 || parseFloat(obj.locked) != 0;
      });
      console.log(this.balances);
      //      return balances;
    });
    //console.log(balances);
    //    return balances;
  }
  private buildSign = (data: string) => {
    return crypto
      .createHmac('sha256', this.apiConfig.apiSecret)
      .update(data)
      .digest('hex');
  };
  private buildHeaders = () => {
    return {
      'X-MBX-APIKEY': this.apiConfig.apiKey,
    };
  };
  private buildSignature = () => {};
  private buildUrl = () => {};
  private privateRequest = async (
    data: object,
    endpoint: string,
    type: Method
  ) => {
    let dataQueryString = qs.stringify(data);
    const signature = this.buildSign(dataQueryString);
    dataQueryString = dataQueryString + '&signature=' + signature;
    const requestConfig: AxiosRequestConfig = {
      method: type,
      url: this.apiConfig.apiBaseEndPoint + endpoint + '?' + dataQueryString,
      headers: this.buildHeaders(),
    };
    console.log('REQUEST CONFIG', requestConfig);

    try {
      console.log('URL: ', requestConfig);
      const response = await axios(requestConfig);
      return response;
    } catch (err) {
      //      console.log(err);
      return err;
    }
  };
  private publicRequest = async (
    data: object,
    endpoint: string,
    type: Method
  ) => {
    const dataQueryString = qs.stringify(data);
    const requestConfig: AxiosRequestConfig = {
      method: type,
      url: this.apiConfig.apiBaseEndPoint + endpoint + '?' + dataQueryString,
      headers: this.buildHeaders(),
    };

    try {
      console.log('URL: ', requestConfig.url);
      const response = await axios(requestConfig);
      return response;
    } catch (err) {
      console.log(err);
      return err;
    }
  };
}
