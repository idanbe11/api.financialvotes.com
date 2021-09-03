'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    /**
     * Triggered before `vote` create query.
     */
    async beforeCreate(data) {
      // strapi.log.debug("beforeCreate", Object.keys(data));
      data.updated = new Date();
      data.votes = 0;
    },
    /**
     * Triggered before `vote` update query.
     */
    async beforeUpdate(params, data) {
      // strapi.log.debug("beforeUpdate", Object.keys(data), Object.keys(params));
      data.updated = new Date();
    },
  }
};
