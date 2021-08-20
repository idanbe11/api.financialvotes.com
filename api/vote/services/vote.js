'use strict';

const _ = require('lodash');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  /**
   * Promise to add/update the record
   *
   * @return {Promise}
   */
  async findOrCreate(coin_id, userId) {
    let entry;
    entry = await strapi.query('vote').findOne({ coin_id });
    if (!entry) {
      entry = await strapi.query('vote').create({ coin_id, votes: 0, updated: new Date() });
    }
    // strapi.log.debug('Found:', entry);
    return entry;
  },
};
