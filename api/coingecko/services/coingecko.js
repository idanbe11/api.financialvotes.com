'use strict';

const axios = require("axios");
const coingeckoURL = "https://api.coingecko.com/api/v3";

/**
 * `coingecko` service.
 */

module.exports = {
  getAllAssetPlatforms: async () => {
    let data = [];
    await axios.get(`${coingeckoURL}/asset_platforms`)
      .then((res) => {
        // strapi.log.debug('result', res.data);
        data = res.data;
      })
      .catch((err) => {
        strapi.log.error(err.message);
      });
    // strapi.log.debug('getAllAssetPlatforms', data);
    return data;
  },
  findCoinByID: async (id) => {
    // strapi.log.debug('findCoinByID slug(id);',id);
    let data = null;
    await axios.get(`${coingeckoURL}/coins/${id}?developer_data=false&tickers=false&localization=false`)
      .then((res) => {
        // strapi.log.debug('result', res.data);
        data = res.data;
      })
      .catch((err) => {
        strapi.log.error(err.message);
      });
    // strapi.log.debug('findCoinByID', data);
    return data;
  },
  filterData: async (data) => {
    // strapi.log.debug('filterData', Object.keys(data));
    let filteredData = {
      symbol: data.symbol,
      description: data.description["en"],
      categories: data.categories,
      platforms: data.platforms,
      asset_platform_id: data.asset_platform_id,
      contract_address: data.contract_address,
      image: data.image,
      links: data.links,
      updated: data.last_updated,
      quote: {
        price: data.market_data['current_price']['usd'],
        last_updated: data.market_data['current_price']['last_updated']
      }
    };
    if(!!data['genesis_date']) filteredData['genesis_date'] = data.genesis_date;
    if(!!data['market_data']['market_cap']) filteredData['quote']['market_cap'] = data['market_data']['market_cap']['usd'];
    if(!!data['market_data']['price_change_percentage_1h']) {
      filteredData['quote']['price_change_percentage_1h'] = data['market_data']['price_change_percentage_1h'];
    } else if(!!data['market_data']['price_change_percentage_1h_in_currency'] && data['market_data']['price_change_percentage_1h_in_currency'] !== {}) {
      filteredData['quote']['price_change_percentage_1h'] = data['market_data']['price_change_percentage_1h_in_currency']['usd'];
    }
    if(!!data['market_data']['price_change_percentage_24h']) filteredData['quote']['price_change_percentage_24h'] = data['market_data']['price_change_percentage_24h'];
    if(!!data['market_data']['price_change_percentage_7d']) filteredData['quote']['price_change_percentage_7d'] = data['market_data']['price_change_percentage_7d'];
    // strapi.log.debug('filteredData', filteredData);
    return filteredData;
  }
};
