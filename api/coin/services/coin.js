'use strict';

const slugify = require('slugify');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  initialCoinGeckoUpdate: async (coin) => {
    const { id, name } = coin;
    let slug = slugify(name);
    let backupSlug = !!coin.coingecko_link ? String(coin.coingecko_link).replace('https://www.coingecko.com/en/coins/', '') : coin.slug;
    let success = false;
    // strapi.log.debug('slugs:', slug, coin.slug);
    for (let i = 0; i < 2; i+=1) {
      if(i === 0){
        const cgCoinData = await strapi.services.coingecko.findCoinByID(slug);
        // strapi.log.debug('cgCoinData', cgCoinData);
        if (cgCoinData !== null) {
          const filteredData = await strapi.services.coingecko.filterData(cgCoinData);
          const updatedCoin = await strapi.services.coin.update({ id }, { data: filteredData, updated: new Date(), active: true, in_coingecko: true });
          if(!!updatedCoin && !!updatedCoin.id) success = true;
        }
      } else {
        const cgCoinData = await strapi.services.coingecko.findCoinByID(backupSlug);
        // strapi.log.debug('cgCoinData', cgCoinData);
        if (cgCoinData !== null) {
          const filteredData = await strapi.services.coingecko.filterData(cgCoinData);
          const updatedCoin = await strapi.services.coin.update({ id }, { data: filteredData, updated: new Date(), active: true, in_coingecko: true });
          if(!!updatedCoin && !!updatedCoin.id) success = true;
        }
      }
    }
    if(!success) await strapi.services.coin.update({ id }, { updated: new Date(), active: true, in_coingecko: false });
    // strapi.log.debug('cgCoinData', cgCoinData, attempt);
  }
};
