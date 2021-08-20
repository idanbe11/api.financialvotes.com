'use strict';

const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Retrieve records.
   *
   * @return {Array}
   */
  async findActive(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.advertisement.search({...ctx.query, active: true});
    } else {
      entities = await strapi.services.advertisement.find({...ctx.query, active: true});
    }

    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.advertisement }));
  },
};
