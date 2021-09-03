'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  /**
   * Validates the bulk payload with multiple events
   * @param {Object} data bulk data payload
   * @returns {Object} validity, message
   */
  validateBulkPayload: (data) => {
    const { validity, message } = strapi.services.helper.checkObjectProperties(data, ["advertisement_id", "events", "source"]);
    return {
      validity,
      message
    }
  },
  /**
   * Creates multiple events
   * @param {Object[]} items events
   * @param {Object} rest other properties to be in events
   * @returns {number} number of successfully created events
   */
  createEvents: async (items, rest) => {
    let i = 0;
    await Promise.all(items.map(async (item) => {
      const events = {
        ...rest,
        type: item.type,
        timestamp: item.timestamp
      };
      try {
        const eventEntry = await strapi.services["analytics-event"].create(events);
        // strapi.log.debug("createEvents", eventEntry, events);
        i += 1;
      } catch (error) {
        // strapi.plugins.sentry.services.sentry.sendError(error);
        ctx.badRequest("Oops, Something happened!");
      }
    }));
    return i;
  }
};
