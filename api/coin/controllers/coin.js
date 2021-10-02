'use strict';

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */
   async create(ctx) {
    let entity;
    const userId = ctx.state.user.id;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      strapi.log.debug('parseMultipartData coin', data, files);
      entity = await strapi.services.coin.create({...data, investors: [userId]}, { files });
    } else {
      strapi.log.debug('coin', ctx.request.body);
      entity = await strapi.services.coin.create({...ctx.request.body, investors: [userId]});
    }
    return sanitizeEntity(entity, { model: strapi.models.coin });
  },
  /**
   * Retrieve records by user.
   *
   * @return {Array}
   */
   async findByUser(ctx) {
    let entities = [];
    // strapi.log.debug('user', ctx.state.user);
    try {
      const invested_coins = ctx.state.user.invested_coins;
      await Promise.all(invested_coins.map(async (coin) => {
        const coinEntry = await strapi.query('coin').find({ id: coin });
        entities.push(coinEntry);
      }));
    } catch (error) {
      ctx.notFound('No coins found!');
    }

    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.coin }));
  },
  /**
   * Retrieve records by votes and votesUpdated.
   *
   * @return {Array}
   */
   async findTodaysBest(ctx) {
    let entities = [];
    if (ctx.query._q) {
      entities = await strapi.services.coin.search({...ctx.query, _sort: 'votes:DESC,votesUpdated:DESC,name:ASC'});
    } else {
      entities = await strapi.services.coin.find({...ctx.query, _sort: 'votes:DESC,votesUpdated:DESC,name:ASC'});
    }

    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.coin }));
  },
};
