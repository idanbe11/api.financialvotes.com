'use strict';

const { sanitizeEntity } = require('strapi-utils');

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
      entities = await strapi.query('vote-interaction').find({ voter: userId }, ['']);
    } catch (error) {
      strapi.log.error(error.message);
      ctx.notFound('No votes found!');
    }
    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.vote }));
  },
  /**
   * Retrieve records by coin id.
   *
   * @return {Array}
   */
   async findByCoin(ctx) {
    let entity = {};
    // strapi.log.debug('user', ctx.state.user);
    try {
      const { id } = ctx.params;
      entity = await strapi.query('vote').findOne({ coin_id: id }, []);
      if(!entity) {
        ctx.notFound('No votes found!');
      }
    } catch (error) {
      strapi.log.error(error.message);
      ctx.badRequest();
    }
    return sanitizeEntity(entity, { model: strapi.models.vote });
  },
  /**
   * Create a record.
   *
   * @return {Object}
   */
  async create(ctx) {
    let entity;
    try {
      const { coin_id } = ctx.request.body;
      const userId = ctx.state.user.id;
      let voteEntry = await strapi.services.vote.findOrCreate(coin_id, userId);
      let coin = await strapi.services.coin.find({ id: coin_id });
      let interaction = await strapi.services['vote-interaction'].findOne({ coin_id, voter: userId, created_gt :new Date(Date.now() - 24*60*60 * 1000)}, ['']);
      // strapi.log.debug('int:', interaction);
      if(!!interaction) {
        ctx.badRequest('You cannot vote again within 24 hours!');
      } else {
        //strapi.log.debug('Found Vote:', voteEntry);
        let voteCount = voteEntry.votes + 1;
        const voteInteraction = {
          coin_id,
          created: new Date(),
          voter: ctx.state.user.id,
          vote: voteEntry.id,
        }
        const voteInteractionEntity = await strapi.services['vote-interaction'].create(voteInteraction);
        entity = await strapi.services.vote.update({ id: voteEntry.id }, { votes: voteCount });
        if(!!coin){
          await strapi.services.coin.update({ id: coin_id }, { votes: voteCount, votesUpdated: new Date() });
        }
        // strapi.log.debug('voteInteractionEntity:', voteInteractionEntity);
      }
    } catch (error) {
      strapi.log.error(error.message);
      ctx.badRequest('Bad Request');
    }
    return sanitizeEntity(entity, { model: strapi.models.vote });
  },
};
