const Binance = require("binance-api-node").default;
const { apiKey, apiSecret } = require("./secrets.json");

const DIVIDER = "---";

const DECIMALS = 1;

const BINANCE_ICON =
  "iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw1AUhU9TiyIVh3YQcchQXbQgKuKoVShChVArtOpg8tI/aNKQpLg4Cq4FB38Wqw4uzro6uAqC4A+Ik6OToouUeF9SaBHjhcf7OO+ew3v3AUKjwjSraxzQdNtMJxNiNrcqdr8igAhCGEVIZpYxJ0kp+NbXPXVT3cV5ln/fn9Wn5i0GBETiWWaYNvEG8fSmbXDeJ46ykqwSnxOPmXRB4keuKx6/cS66LPDMqJlJzxNHicViBysdzEqmRjxFHFM1nfKFrMcq5y3OWqXGWvfkLwzn9ZVlrtMaQhKLWIIEEQpqKKMCG3HadVIspOk84eMfdP0SuRRylcHIsYAqNMiuH/wPfs/WKkxOeEnhBBB6cZyPYaB7F2jWHef72HGaJ0DwGbjS2/5qA5j5JL3e1mJHQP82cHHd1pQ94HIHGHgyZFN2pSAtoVAA3s/om3JA5BboXfPm1jrH6QOQoVmlboCDQ2CkSNnrPu/u6Zzbvz2t+f0AIKhyhjvmBwAAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfkARMGAQ7E40IBAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAidJREFUOMud00+IV1UUB/DPfW/U8Y2zKBVpU1C4jQJp866DCxVdRUVFSAnVIpkRMSUQBtq5URARdaFo459FtAiCIqpN9l4UBbPJTW0KQgsVFZlHOf7eddENJmn+4IG7ued7vvd7z/meYJHo2rgVw/i0qpvBfLhiEZItOIEz2LEQtliAZDNO4imsxuGujW/Ohw/zkGzCFB5/IHUHe6q6Obuookzy4RySC/gI9zCKY10b9y6o6M6l+EhZmsYT+erjlOwqCtdSMoXXUGIGG6u6mf6Poq6NoWvjUFG4nZL3kfBV3xsfic2fd++llHgDX2CAc1XdTHdtLLs2FjCUCWtMhGAi9c4nfsVvqzY2V2eaeCBR9oN0vCzD89hZ1c3pro1rsBt/4GTo2vgMPsc6fJZ4eaRuuqz0HRzF8r43mVI6NDrW3u3auAIH8S6u4+0Cj+F2VrYyUcHvnzxXpKTELGZDMByKkKD4Z0SPos/9Wh7yy9vwYs9kyY3E6/ihqpvLM02cCMFwWToyGFjbJztm/+7PDq8s/krJe/ilqpuLYc7Yl+WeTWIfvsF4VTc/5/y6/M1XUzLV9/3+0bFvr//v+Ls2rsIlPJuvvsRbuIVTeCXX3EgpPT0S2yv/1g494KsZjGdXr8dmfJBzMZPcxEtlWVxdyopsyO5+Mjc05HML26u6+W5JS1vVzY/ZxT9lTMhj3obvl7y0c5SN4TTW4IWqbr72sNG1sc6mXTDuA5nOzebN5bfvAAAAAElFTkSuQmCC";

function calculateBTCBalance(balances, prices) {
  let totalBTCBalance = 0.0;

  balances.forEach(balance => {
    let assetBtcValue;

    const assetTotalBalance =
      parseFloat(balance.free) + parseFloat(balance.locked);

    if (balance.asset === "BTC") {
      assetBtcValue = assetTotalBalance;
    } else {
      const assetPriceInBTC = prices[`${balance.asset}BTC`]
        ? prices[`${balance.asset}BTC`]
        : "0.0";
      assetBtcValue = assetTotalBalance * parseFloat(assetPriceInBTC);
    }

    totalBTCBalance += assetBtcValue;
  });

  return totalBTCBalance;
}

async function getBTCBalance() {
  const client = Binance({ apiKey, apiSecret });
  let accountInfo;
  let prices;

  try {
    accountInfo = await client.accountInfo({ recvWindow: 1000 });
    prices = await client.prices({ recvWindow: 1000 });
  } catch (e) {
    console.log("...");
    console.log(DIVIDER);
    console.log("Error connecting to Binance");
    console.log(e.message);
    return;
  }

  const btcBalance = calculateBTCBalance(accountInfo.balances, prices);

  console.log(
    ` ${(btcBalance * prices.BTCEUR).toFixed(
      DECIMALS
    )} € | templateImage=${BINANCE_ICON}`
  );
}

getBTCBalance();
