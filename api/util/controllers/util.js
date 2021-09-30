'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async test (ctx) {
    const res = await strapi.services.icount.getAllClients('sample@sample.com', 'sample');
    strapi.log.debug('res', res);
    return res;
  }
};
