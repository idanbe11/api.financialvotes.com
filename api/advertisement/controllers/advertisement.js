'use strict';

const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Retrieve one randomly from active records.
   *
   * @return {Array}
   */
  async findActive(ctx) {
    let entities = [];
    if (ctx.query._q) {
      entities = await strapi.services.advertisement.search({...ctx.query, active: true});
    } else {
      entities = await strapi.services.advertisement.find({...ctx.query, active: true});
    }
    const index = Math.floor(Math.random() * entities.length);
    // strapi.log.debug('findActive', index, entities[index]?.id);
    return sanitizeEntity(entities[index], { model: strapi.models.advertisement });
  },
  /**
   * Create a record.
   *
   * @return {Object}
   */
   async create(ctx) {
    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      strapi.log.debug('parseMultipartData advert', data, files);
      entity = await strapi.services.advertisement.create(data, { files });
    } else {
      strapi.log.debug('advert', ctx.request.body);
      entity = await strapi.services.advertisement.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.advertisement });
  },
};
