'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const DEFAULT_ADVERTISEMENT_EXPIRE_DAYS = 7;

/**
 * Add a given number of days to a given date
 * 
 * @param {Date} date Date object
 * @param {number} days Number of days
 * @returns 
 */
const addDays = (date, days) => {
  const copy = new Date(Number(date));
  // strapi.log.debug('copy', copy);
  copy.setDate(date.getDate() + days);
  // strapi.log.debug('copy updated', new Date(copy));
  return new Date(copy);
}

module.exports = {
  /**
   * Triggered before `advertisement` create query.
   */
  async beforeCreate(data) {
    // strapi.log.debug("beforeCreate", Object.keys(data));
    if (!data.start) {
      data.start = new Date();
    } else if (!data.end) {
      data.end = addDays(data.start, DEFAULT_ADVERTISEMENT_EXPIRE_DAYS);
    } else if (!data.start && !data.end) {
      data.start = new Date();
      data.end = addDays(new Date(), DEFAULT_ADVERTISEMENT_EXPIRE_DAYS);
    }
  },
  /**
   * Triggered before `advertisement` update query.
   */
  async beforeUpdate(params, data) {
    // strapi.log.debug("beforeCreate", Object.keys(data));
    if (!data.start) {
      data.start = new Date();
    } else if (!data.end) {
      data.end = addDays(data.start, DEFAULT_ADVERTISEMENT_EXPIRE_DAYS);
    } else if (!data.start && !data.end) {
      data.start = new Date();
      data.end = addDays(new Date(), DEFAULT_ADVERTISEMENT_EXPIRE_DAYS);
    }
  },
};
