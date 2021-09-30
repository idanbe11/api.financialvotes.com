'use strict';

const axios = require("axios");

// const cmcURL = "https://sandbox-api.coinmarketcap.com/v1";
const cmcURL = "https://pro-api.coinmarketcap.com/v1";

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#cron-tasks
 */

module.exports = {
  '*/1 * * * *':  async () => {
    // update advertisement status, runs every minute
    // strapi.log.info("SCHEDULER::ADVERTISEMENT_STATUS_UPDATE::INIT");
    const newAdvertisements = await strapi.query("advertisement").find();
    if (Array.isArray(newAdvertisements) && newAdvertisements.length > 0) {
      await Promise.all(newAdvertisements.map(async (item) => {
        if (item.start) {
          const { id, active, start, end } = item;
          const startTimeDiff = new Date() - start;
          const endTimeDiff = new Date() - end;
          // strapi.log.debug("Item", active, startTimeDiff, endTimeDiff);
          if (active && endTimeDiff >= 0) {
            try {
              const updatedAdvertisementItem = await strapi.query("advertisement").update({ id },  { active: false });
              strapi.log.info(`SCHEDULER::ADVERTISEMENT_STATUS_UPDATE::EXPIRE_ENTRY[${id}]`);
            } catch (error) {
              strapi.log.error(error.message);
              strapi.log.debug(`SCHEDULER::ADVERTISEMENT_STATUS_UPDATE::EXPIRE_ENTRY_FAIL[${id}]`);
            }
          } else if (!active && startTimeDiff < 0 && endTimeDiff < 0) {
            try {
              const updatedAdvertisementItem = await strapi.query("advertisement").update({ id },  { active: true });
              strapi.log.info(`SCHEDULER::ADVERTISEMENT_STATUS_UPDATE::ACTIVATE_ENTRY[${id}]`);
            } catch (error) {
              strapi.log.error(error.message);
              strapi.log.debug(`SCHEDULER::ADVERTISEMENT_STATUS_UPDATE::ACTIVATE_ENTRY_FAIL[${id}]`);
            }
          }
        }
      }));
    }
    // strapi.log.info("SCHEDULER::ADVERTISEMENT_STATUS_UPDATE::EXIT");
  },
  '15 * * * * *':  async () => {
  },
  '* 1 * * *':  async () => {
    // initial coin check, runs every 10 seconds
    // TODO: make it to hourly
    // CHANGE THIS TO 10 * * * * *
    strapi.log.info("SCHEDULER::COIN_INITIAL_UPDATE::INIT");
    let coin = await strapi.services.coin.findOne({ active: false, in_coingecko: false }, []);
    if(coin !== null) {
      // strapi.log.info("SCHEDULER::COIN_INITIAL_UPDATE::FOUND", coin.name, coin.active, coin.data, coin.slug);
      strapi.log.info("SCHEDULER::COIN_INITIAL_UPDATE::FOUND", Object.keys(coin));
      try {
        const updatedCoin = await strapi.services.coin.initialCoinGeckoUpdate(coin);
        strapi.log.info(`SCHEDULER::COIN_INITIAL_UPDATE::UPDATE_ENTRY_SUCCESS[${updatedCoin['name']}]`);
      } catch (error) {
        strapi.log.error(error.message);
        strapi.log.info(`SCHEDULER::COIN_INITIAL_UPDATE::UPDATE_ENTRY_FAIL[${coin['name']}]`);
      }
    }
    strapi.log.info("SCHEDULER::COIN_INITIAL_UPDATE::EXIT");
  },
};
