'use strict';

const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Retrieve analytics report records by advertisement.
   *
   * @return {Array}
   */
  async findByAdvert(ctx) {
    let entities;
    const { id } = ctx.params;
    if (ctx.query._q) {
      entities = await strapi.services['analytics-report'].search({ ...ctx.query, advertisement: id });
    } else {
      entities = await strapi.services['analytics-report'].find({ ...ctx.query, advertisement: id });
    }
    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models['analytics-report'] }));
  },
};
