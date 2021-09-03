'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    /**
    * Triggered before analytics-report create query.
    */
    async beforeCreate(data) {
      data.created = new Date();
    },
    /**
     * Triggered before analytics-report update query.
     */
    async beforeUpdate(params, data) {
      // data.updated = new Date();
    },
  },
};
