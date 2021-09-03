'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  /**
   * Find or Create an Analytics Report Entry with the given date
   */
   findOrCreate: async (date, id) => {
    const existingEntry = await strapi.query('analytics-report').findOne({ date, advertisement: id });
    // strapi.log.debug("findOrCreate", date, id, existingEntry);
    let entry;
    if (existingEntry === null) {
      try {
        entry = await strapi.services["analytics-report"].create({ date, created: new Date(), advertisement: id });
      } catch (error) {
        strapi.log.error(error.message);
        // strapi.plugins.sentry.services.sentry.sendError(error);
        throw new Error(error);
      }
    } else {
      entry = existingEntry;
    }
    return entry;
  }
};
