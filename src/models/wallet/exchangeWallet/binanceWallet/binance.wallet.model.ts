import axios, { AxiosRequestConfig, Method } from 'axios';
import * as crypto from 'crypto';
import * as qs from 'qs';
import { IWallet, IWalletAssetBalance } from '../../wallet.interfaces';
import {
  IExchangeWallet,
  IExchangeWalletConfig,
} from '../exchange.wallet.interfaces';
import ExchangeWallet from '../exchange.wallet.model';
import { IBinanceWallet } from './binance.interfaces';
import * as ccxt from 'ccxt';

export default class BinanceWallet
  extends ExchangeWallet
  implements IBinanceWallet
{
  private static readonly restEndpointUrl = 'api.binance.com';
  exchangeConn: ccxt.binance;

  constructor(exchangeWalletConfig: IExchangeWalletConfig) {
    super(exchangeWalletConfig);
    this.exchangeConn = new ccxt.binance({
      apiKey: this.apiKey,
      secret: this.apiSecret,
    });
    this.syncBalances();
  }

  public async syncBalances(): Promise<void> {
    try {
      console.log(this.exchangeConn.timeframes);
      let allTrades: ccxt.Trade[][] = [];
      let markets = await this.exchangeConn.loadMarkets();
      for (let market in markets) {
        let since = (await this.exchangeConn.fetchOHLCV(market, '1M'))[0][0];
        let params = { fromId: 0 };
        while (since < this.exchangeConn.milliseconds()) {
          const limit = 20; // change for your limit
          const trades = await this.exchangeConn.fetchMyTrades(
            market,
            since,
            limit,
            params
          );
          if (trades.length) {
            //            console.log(
            //              'TRADES',
            //              trades,
            //              since,
            //             ' ',
            //             trades[trades.length - 1]['timestamp']
            //           );
            since = trades[trades.length - 1]['timestamp'];
            params = { fromId: Number(trades[trades.length - 1].id) + 1 };
            allTrades = allTrades.concat(trades);
          } else {
            console.log(
              market +
                ' ' +
                allTrades.length +
                ' ' +
                allTrades[0] +
                ' ' +
                allTrades[trades.length - 1]
            );
            break;
          }
        }
        //        let trades = await this.exchangeConn.fetchMyTrades(market, since);
        //        trades.length != 0
        //
        //         : null;
      }
      //        console.log((await this.exchangeConn.fetchOHLCV(market, '1M'))[0]);
      //      let startM = markets[0];
      //      console.log(markets);
      //      let limit: number = 10;
      let binancetransac = await this.exchangeConn.fetchMyTrades(
        undefined,
        '2020'
      );
      console.log(binancetransac);
    } catch (e) {
      console.log(e);
    }
    try {
      // fetch account balance from the exchange
      let coinbaseproBalance = await this.exchangeConn.fetchBalance();
      delete coinbaseproBalance.info;
      delete coinbaseproBalance.timestamp;
      delete coinbaseproBalance.datetime;
      delete coinbaseproBalance.free;
      delete coinbaseproBalance.used;
      delete coinbaseproBalance.total;
      for (let key of Object.keys(coinbaseproBalance)) {
        coinbaseproBalance[key].total == 0
          ? delete coinbaseproBalance[key]
          : null;
      }

      // output the result
      console.log(this.exchangeConn.name, 'balance', coinbaseproBalance);
    } catch (e) {
      if (
        e instanceof ccxt.DDoSProtection ||
        e.message.includes('ECONNRESET')
      ) {
        //          log.bright.yellow ('[DDoS Protection] ' + e.message)
      } else if (e instanceof ccxt.RequestTimeout) {
        //          log.bright.yellow ('[Request Timeout] ' + e.message)
      } else if (e instanceof ccxt.AuthenticationError) {
        //          log.bright.yellow ('[Authentication Error] ' + e.message)
      } else if (e instanceof ccxt.ExchangeNotAvailable) {
        //          log.bright.yellow ('[Exchange Not Available Error] ' + e.message)
      } else if (e instanceof ccxt.ExchangeError) {
        //         log.bright.yellow ('[Exchange Error] ' + e.message)
      } else if (e instanceof ccxt.NetworkError) {
        //        log.bright.yellow ('[Network Error] ' + e.message)
      } else {
        throw e;
      }
    }

    /*     const data = {
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
 */
  }
  /*   private buildSign = (data: string) => {
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
 */
}
