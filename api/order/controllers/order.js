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
      const orders = await strapi.query('order').find({ user: userId });
      await Promise.all(orders.map(async (order) => {
        const orderEntry = await strapi.query('order').find({ id: order });
        entities.push(orderEntry);
      }));
    } catch (error) {
      ctx.notFound('No orders found!');
    }
    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.order }));
  },
};
