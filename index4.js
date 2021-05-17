const axios = require('axios');
const crypto = require('crypto');
const qs = require('qs');
const { binanceAPI, nomicsAPI } = require('./secrets.json');
//const { apiKey, apiSecret } = require('./secrets.json');

const binanceConfig = {
  API_KEY: binanceAPI.apiKey,
  API_SECRET: binanceAPI.apiSecret,
  HOST_URL: 'https://api.binance.com',
};

const buildSign = (data, config) => {
  return crypto
    .createHmac('sha256', config.API_SECRET)
    .update(data)
    .digest('hex');
};

const buildRequestConfig = (data, endPoint, type) => {
  const dataQueryString = qs.stringify(data);
  const signature = buildSign(dataQueryString, binanceConfig);
  const requestConfig = {
    method: type,
    url:
      binanceConfig.HOST_URL +
      endPoint +
      '?' +
      dataQueryString +
      '&signature=' +
      signature,
    headers: {
      'X-MBX-APIKEY': binanceConfig.API_KEY,
    },
  };
  return requestConfig;
};

const privateRequest = async (data, endPoint, type) => {
  //  const requestConfig = buildRequestConfig(data, endPoint, type);

  const dataQueryString = qs.stringify(data);
  const signature = buildSign(dataQueryString, binanceConfig);
  const requestConfig = {
    method: type,
    url:
      binanceConfig.HOST_URL +
      endPoint +
      '?' +
      dataQueryString +
      '&signature=' +
      signature,
    headers: {
      'X-MBX-APIKEY': binanceConfig.API_KEY,
    },
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

const publicRequest = async (data, endPoint, type) => {
  //  const requestConfig = buildRequestConfig(data, endPoint, type);
  const dataQueryString = qs.stringify(data);

  const requestConfig = {
    method: type,
    url: binanceConfig.HOST_URL + endPoint + '?' + dataQueryString,
    headers: {
      'X-MBX-APIKEY': binanceConfig.API_KEY,
    },
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

const data = {
  symbol: 'USDTEUR',
  recvWindow: 20000,
  timestamp: Date.now(),
};

//privateRequest(data, '/api/v3/openOrders', 'GET');
const data2 = {
  //  type: 'SPOT',
  recvWindow: 20000,
  timestamp: Date.now(),
};

var balances = {};

privateRequest(data2, '/api/v3/account', 'GET').then(async (response) => {
  //  console.log(response);
  balances = response.data.balances.filter((obj) => {
    return parseFloat(obj.free) != 0 || parseFloat(obj.locked) != 0;
  });
  const id = ['BTC'];
  let ids = 'BTC';
  balances.map((balance) => {
    if (!id.includes(balance.asset)) {
      id.push(balance.asset);
      ids = ids + ',' + balance.asset;
    }
  });
  const prices = await axios({
    method: 'GET',
    url:
      'https://api.nomics.com/v1/currencies/ticker?key=' +
      nomicsAPI.apiKey +
      ids +
      '&interval=1d,30d&convert=EUR&per-page=100&page=1',
  });
  let globalBalance = 0;
  balances.map((balance) => {
    balance.balance = parseFloat(balance.free) + parseFloat(balance.locked);
    balance.price = prices.data.find((x) => x.id === balance.asset).price;
    globalBalance += balance.balance * balance.price;
    console.log(globalBalance);
  });
  //  console.log(id, ids);
  //  console.log(prices.data.find((x) => x.id === 'BTC').price);

  // balances.map((balance) => {
  //   balance.asset != 'BTC'
  //     ? publicRequest(
  //         { symbol: balance.asset + 'BTC' },
  //         '/api/v3/avgPrice',
  //         'GET'
  //       ).then((response) => {
  //         console.log(response.data);
  //         balance.price = response.data.price;
  //         balance.balance =
  //           parseFloat(balance.free) + parseFloat(balance.locked);
  //       })
  //     : (balance.price = 1);
  //   balance.balance = parseFloat(balance.free) + parseFloat(balance.locked);
  // });
});

console.info(balances);

// https://api.nomics.com/v1/currencies/ticker?key=4a34c776dde7d4f691a17af15d43dfdc&ids=BTC,ETH,XRP&interval=1d,30d&convert=EUR&per-page=100&page=1"
