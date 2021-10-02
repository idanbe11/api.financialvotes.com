'use strict';

const slugify = require("slugify");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    /**
     * Triggered before `coin` create query.
     */
    async beforeCreate(data) {
      // strapi.log.debug("beforeCreate", Object.keys(data));
      data.updated = new Date();
      if(!data.slug){
        data.slug = slugify(String(data.name).toLowerCase())
      }
    },
    /**
     * Triggered before `coin` update query.
     */
    async beforeUpdate(params, data) {
      // strapi.log.debug("beforeUpdate", Object.keys(data));
      data.updated = new Date();
    },
  }
};
