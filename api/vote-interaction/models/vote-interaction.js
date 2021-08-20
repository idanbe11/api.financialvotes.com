'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    /**
     * Triggered before `vote-interaction` create query.
     */
    async beforeCreate(data) {
      // strapi.log.debug("beforeCreate", Object.keys(data));
      data.created = new Date();
    },
  }
};
