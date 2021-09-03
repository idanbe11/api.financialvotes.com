'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Bulk create Analytics Events
   */
  bulkCreate: async (ctx) => {
    const { header, body } = ctx.request;
    const { validity, message } = strapi.services["analytics-event"].validateBulkPayload(body);
    if (validity) {
      const { advertisement_id, events, source } = body;
      try {
        const analyticsEntry = await strapi.services["analytics-report"].findOrCreate(new Date(), advertisement_id);
        const { id: analyticsEntryId } = analyticsEntry;
        const osInfo = strapi.services.util.getOSInfo(header["user-agent"]);
        const restProps = {
          analytics_report: analyticsEntryId,
          userAgent: header["user-agent"],
          source,
          osInfo,
          meta: { header }
        };
        // strapi.log.debug('bulkCreate', restProps);
        const i = await strapi.services["analytics-event"].createEvents(events, restProps);
        if (i === events.length) {
          ctx.response.status = 200;
          ctx.response.body = {
            success: true
          };
        } else {
          ctx.badRequest("Oops, Something happened!");
        }
      } catch (error) {
        // strapi.plugins.sentry.services.sentry.sendError(error);
        strapi.log.error(error);
        ctx.badRequest(error.message);
      }
    } else {
      ctx.badRequest(message);
    }
  }
};
