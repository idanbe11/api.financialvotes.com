'use strict';

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Retrieve records by user.
   *
   * @return {Array}
   */
   async findByUser(ctx) {
    let entities = [];
    // strapi.log.debug('user', ctx.state.user);
    const userId = ctx.state.user.id;
    try {
      entities = await strapi.query('order').find({ ...ctx.query, user: userId });
    } catch (error) {
      ctx.notFound('No orders found!');
    }
    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.order }));
  },
  async create(ctx) {
    let entity;
    const userId = ctx.state.user.id;
    const email = ctx.state.user.email;
    const client_name = ctx.state.user.firstname + ' ' + ctx.state.user.lastname;
    try {
      if (ctx.is('multipart')) {
        const { data, files } = parseMultipartData(ctx);
        strapi.log.debug('orderCreate', data);
        entity = await strapi.services.order.create({...data, created: new Date(), user: userId}, { files });
      } else {
        strapi.log.debug('orderCreate', ctx.request.body);
        entity = await strapi.services.order.create({...ctx.request.body, created: new Date(), user: userId});
      }
      return sanitizeEntity(entity, { model: strapi.models.order });
    } catch (error) {
      strapi.log.debug(error);
      ctx.badRequest(error.message);
    }
  },
};
