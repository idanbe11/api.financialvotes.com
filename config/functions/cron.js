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
    strapi.log.info("SCHEDULER::ADVERTISEMENT_STATUS_UPDATE::INIT");
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
    strapi.log.info("SCHEDULER::ADVERTISEMENT_STATUS_UPDATE::EXIT");
  },
  '*/30 * * * *':  async () => {
    // update coin promotion status, runs every 30 minutes
    strapi.log.info("SCHEDULER::COIN_PROMOTION_STATUS_UPDATE::INIT");
    const promotedCoins = await strapi.query("coin").find({ active: true, promoted: true });
    if (Array.isArray(promotedCoins) && promotedCoins.length > 0) {
      await Promise.all(promotedCoins.map(async (item) => {
        if (item.start) {
          const { id, start, end } = item;
          const startTimeDiff = new Date() - start;
          const endTimeDiff = new Date() - end;
          // strapi.log.debug("Item", active, startTimeDiff, endTimeDiff);
          if (endTimeDiff >= 0) {
            try {
              await strapi.query("coin").update({ id },  { promoted: false });
              strapi.log.info(`SCHEDULER::COIN_PROMOTION_STATUS_UPDATE::EXPIRE_ENTRY[${id}]`);
            } catch (error) {
              strapi.log.error(error.message);
              strapi.log.debug(`SCHEDULER::COIN_PROMOTION_STATUS_UPDATE::EXPIRE_ENTRY_FAIL[${id}]`);
            }
          } else if (startTimeDiff < 0 && endTimeDiff < 0) {
            try {
              await strapi.query("coin").update({ id },  { promoted: true });
              strapi.log.info(`SCHEDULER::COIN_PROMOTION_STATUS_UPDATE::ACTIVATE_ENTRY[${id}]`);
            } catch (error) {
              strapi.log.error(error.message);
              strapi.log.debug(`SCHEDULER::COIN_PROMOTION_STATUS_UPDATE::ACTIVATE_ENTRY_FAIL[${id}]`);
            }
          }
        }
      }));
    }
    strapi.log.info("SCHEDULER::COIN_PROMOTION_STATUS_UPDATE::EXIT");
  },
  '30 */1 * * * *':  async () => {
    // initial coin check, runs every 1 minute at 30th second
    strapi.log.info("SCHEDULER::COIN_INITIAL_UPDATE::INIT");
    let coin = await strapi.query('coin').findOne({ active: false, in_coingecko: false });
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
  '0 */1 * * *':  async () => {
    // coin daily update check, runs every hour
    // if the coins in coingecko and last updated before 24 hours from now, they will picked up and updated
    strapi.log.info("SCHEDULER::COIN_DAILY_UPDATE::INIT");
    let coins = [];
    coins = await strapi.query('coin').find({ in_coingecko: true, updated_lt: new Date((new Date()).valueOf() - 1000*60*60*24).toISOString(), _sort: 'name:desc', _limit: 5 });
    await Promise.all(coins.map(async (coin) => {
      const updatedCoin = await strapi.services.coin.coinGeckoUpdate(coin);
      if(updatedCoin !== null){
        strapi.log.info(`SCHEDULER::COIN_DAILY_UPDATE::UPDATE_ENTRY_SUCCESS[${updatedCoin['name']}]`);
      }else{
        strapi.log.info(`SCHEDULER::COIN_DAILY_UPDATE::UPDATE_ENTRY_FAIL[${coin['name']}]`);
      }
    }));
    strapi.log.info("SCHEDULER::COIN_DAILY_UPDATE::EXIT");
  },
  '0 0 * * *':  async () => {
    // reset daily votes, runs every day at 00:00 AM
    strapi.log.info("SCHEDULER::RESET_DAILY_VOTES::INIT");
    let dailyVotes = [];
    dailyVotes = await strapi.query('daily-votes').find({}, ['']);
    await Promise.all(dailyVotes.map(async (vote) => {
      const deletedCoin = await strapi.services['daily-votes'].delete({ id: vote.id });
      if (deletedCoin !== null) {
        strapi.log.info(`SCHEDULER::RESET_DAILY_VOTES::DELETE_ENTRY_SUCCESS[${deletedCoin['id']}]`);
      } else {
        strapi.log.info(`SCHEDULER::RESET_DAILY_VOTES::DELETE_ENTRY_FAIL[${vote['id']}]`);
      }
    }));
    strapi.log.info("SCHEDULER::RESET_DAILY_VOTES::EXIT");
  },
};
