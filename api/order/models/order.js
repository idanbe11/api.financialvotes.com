'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  /**
   * Triggered before `order` create query.
   */
  async beforeCreate(data) {
    // strapi.log.debug("beforeCreate", Object.keys(data));
    data.created = new Date();
  },
  /**
   * Triggered before `order` update query.
   */
  async beforeUpdate(params, data) {
    strapi.log.debug("beforeUpdate", Object.keys(data), Object.keys(params));
    data.updated = new Date();
  },
};
