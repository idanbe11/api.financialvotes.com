'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */


/**
 * Add a given number of days to a given date
 * 
 * @param {Date} date Date object
 * @param {number} days Number of days
 * @returns 
 */
const addDays = (date, days) => {
  const copy = new Date(Number(date));
  // strapi.log.debug('copy', copy);
  copy.setDate(date.getDate() + days);
  // strapi.log.debug('copy updated', new Date(copy));
  return new Date(copy);
}

module.exports = {
  lifecycles: {
    /**
     * Triggered before `order` create query.
     */
    async beforeCreate(data) {
      // strapi.log.debug("beforeCreate", Object.keys(data));
      data.created = new Date();
    },
    /**
     * Triggered afrer `order` create query.
     */
    async afterCreate(result, data) {
      // strapi.log.debug("afterCreate", result);
    },
    /**
     * Triggered before `order` update query.
     */
    async beforeUpdate(params, data) {
      // strapi.log.debug("beforeUpdate", Object.keys(params), Object.keys(data));
      data.updated = new Date();
    },
    /**
     * Triggered before `order` update query.
     */
    async afterUpdate(result, params, data) {
      // strapi.log.debug("afterUpdate", Object.keys(result), Object.keys(data));
      if (result.status === "Completed") {
        if (result.type === "Advert") {
          const advert = await strapi.services.advertisement.findOne({ id: result.entityId });
          try {
            if (!!advert) {
              const { id, start, end } = advert;
              await strapi.services.advertisement.update({ id }, { start: start || new Date(), end: end || addDays(new Date(), result.selectedDays), no_of_days: result.selectedDays, active: true });
            }
          } catch (error) {
            strapi.log.error(error.message);
            strapi.log.debug(`ORDER::ADVERTISEMENT::ACTIVATE_ENTRY_FAIL[${advert.id}]`);
          }
        } else if (result.type === "Coin_Promotion") {
          const coin = await strapi.services.coin.findOne({ id: result.entityId });
          try {
            if (!!coin) {
              const { id, start, end } = coin;
              await strapi.services.coin.update({ id }, { start: start || new Date(), end: end || addDays(new Date(), result.selectedDays), no_of_days: result.selectedDays, active: true, promoted: true });
            }
          } catch (error) {
            strapi.log.error(error.message);
            strapi.log.debug(`ORDER::COIN_PROMOTION::ACTIVATE_ENTRY_FAIL[${coin.id}]`);
          }
        }
        // Send Invoice for Completed and Confirmed Order
        const email = result.user.email;
        const client_name = result.user.firstname + ' ' + result.user.lastname;
        try {
          await strapi.services.icount.createNewOrderDocument(email, client_name, result.orderItemText + `- ${result.selectedDays} Days`, result.base_price, result.discount, result.selectedDays);
        } catch (error) {
          strapi.log.error(error.message);
          strapi.log.debug(`ORDER::INVOICE::SEND_ORDER_INVOICE_FAIL[${result.id}]`);
        }
      }
    },
  }
};
