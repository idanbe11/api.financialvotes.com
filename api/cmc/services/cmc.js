'use strict';

const axios = require("axios");

// const cmcURL = "https://sandbox-api.coinmarketcap.com/v1";
const cmcURL = "https://pro-api.coinmarketcap.com/v1";

/**
 * `cmc` service.
 */

module.exports = {
  filterInitialCMCCoin: async (data) => {
    const { name, symbol, slug, date_added, platform, quote, id } = data;
    let coin = {
      name,
      symbol,
      cmc_id: id,
      cmc_detailed: false,
      slug,
      created: new Date(date_added),
      quote: quote["USD"]
    };
    if(platform !== null) {
      switch (platform["name"]) {
        case "Binance Smart Chain":
          coin["networkChain"] = "BSC";
          break;
        case "Ethereum":
          coin["networkChain"] = "ETH";
          break;
        case "Tron":
          coin["networkChain"] = "TRX";
          break;
        case "Polygon":
          coin["networkChain"] = "MATUC";
          break;
        default:
          break;
      }
    }
    return coin;
  },
  filterCMCCoinMeta: async (data) => {
    // strapi.log.debug('filterCMCCoinMeta', data);
    const { description, symbol, logo, urls, platform, date_added } = data;
    let coin = {
      logo_url: logo,
      symbol,
      description,
      cmc_detailed: true,
      created: new Date(date_added),
    };
    if(!!urls["website"]) coin['website_link'] = urls["website"][0];
    if(!!urls["twitter"]) coin['twitter_link'] = urls["twitter"][0];
    if(!!urls["telegram"]) coin['telegram_link'] = urls["telegram"][0];
    if(platform !== null) {
      switch (platform["name"]) {
        case "Binance Smart Chain":
          coin["networkChain"] = "BSC";
          break;
        case "Ethereum":
          coin["networkChain"] = "ETH";
          break;
        case "Tron":
          coin["networkChain"] = "TRX";
          break;
        case "Polygon":
          coin["networkChain"] = "MATUC";
          break;
        default:
          break;
      }
    }
    strapi.log.debug('after filterCMCCoinMeta', coin);
    return coin;
  },
  getInitialCryptocurrencies: async () => {
    let currencies = [];
    // sandbox 'X-CMC_PRO_API_KEY': 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c'
    // pro 'X-CMC_PRO_API_KEY': '2b069cb8-506b-4df6-8824-55ed78bb99c7'
    await axios.get(`${cmcURL}/cryptocurrency/listings/latest?start=1&limit=10&convert=USD`, {
        headers: {
          'X-CMC_PRO_API_KEY': '2b069cb8-506b-4df6-8824-55ed78bb99c7'
        }
      })
      .then((res) => {
        // strapi.log.debug('result', res.data);
        currencies = res.data.data;
      })
      .catch((err) => {
        strapi.log.error(err.message);
      });
    strapi.log.debug('items', currencies[0]);
    await Promise.all(currencies.map(async (currencyItem) => {
      try {
        const filteredCoin = await strapi.services.cmc.filterInitialCMCCoin(currencyItem);
        // strapi.log.debug('filtered item', filteredCoin);
        const savedItem = await strapi.services.coin.create(filteredCoin);
        // strapi.log.debug('saved item', savedItem);
      } catch (error) {
        strapi.log.error(error.message, currencyItem['name'], error);
      }
    }));
    return;
  },
  getCryptocurrencyBySlug: async () => {
    let coin = await strapi.services.coin.findOne({cmc_detailed: false});
    // strapi.log.debug('coin', coin);
    let coinMeta = {};
    // sandbox 'X-CMC_PRO_API_KEY': 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c'
    // pro 'X-CMC_PRO_API_KEY': '2b069cb8-506b-4df6-8824-55ed78bb99c7'
    
    await axios.get(`${cmcURL}/cryptocurrency/info?slug=${coin.slug}`, {
        headers: {
          'X-CMC_PRO_API_KEY': '2b069cb8-506b-4df6-8824-55ed78bb99c7'
        }
      })
      .then((res) => {
        coinMeta = res.data['data'][`${coin.cmc_id}`];
        // strapi.log.debug('result', res.data, coinMeta);
      })
      .catch((err) => {
        strapi.log.error(err.message);
      });
    try {
      const filteredCoinMeta = await strapi.services.cmc.filterCMCCoinMeta(coinMeta);
      // strapi.log.debug('filtered mets', filteredCoinMeta);
      const updatedItem = await strapi.services.coin.update({id: coin.id},filteredCoinMeta);
      // strapi.log.debug('saved item', updatedItem);
    } catch (error) {
      strapi.log.error(error.message);
    }
    return;
  }
};
