'use strict';

const { cid, user, pass, tax_exempt, vat_percent, currency_code, lang, doc_lang } = require('../config/');

const axios = require("axios");
const queryString = require("query-string");
const icountURL = "https://api.icount.co.il/api/v3.php";

/**
 * `icount` service.
 */

module.exports = {
  /**
   * Get clients
   * @returns null
   */
  getAllClients: async () => {
    let data = {};
    const params = queryString.stringify({ cid, user, pass, list_type: 'array', detail_level: 2 });
    // strapi.log.debug('getAllClients', params);
    await axios.get(`${icountURL}/client/get_list?${params}`)
      .then((res) => {
        strapi.log.debug('result', res.data);
        // res.data.status = true?
        data = res.data;
      })
      .catch((err) => {
        strapi.log.error(err.message);
      });
    return data;
  },
  /**
   * Create a new client
   * @param {string} email 
   * @param {string} client_name 
   * @returns null
   */
  createNewClient: async (email, client_name) => {
    let data = {};
    const params = queryString.stringify({ cid, user, pass, email, client_name });
    // strapi.log.debug('createNewClient', params);
    await axios.get(`${icountURL}/client/create?${params}`)
      .then((res) => {
        // strapi.log.debug('result', res.data);
        data = res.data;
      })
      .catch((err) => {
        strapi.log.error(err.message);
      });
    return data;
  },
  /**
   * Create a new order and send email
   * @param {string} email 
   * @param {string} client_name 
   * @returns null
   */
  createNewOrderDocument: async (email, client_name, description, unitprice, sum, discount, vat_percent=vat_percent) => {
    let data = {};
    const params = queryString.stringify({
      cid,
      user,
      pass,
      email,
      client_name,
      discount,
      tax_exempt,
      vat_percent,
      currency_code,
      lang,
      doc_lang,
      doctype: 'order',
      send_email: 1,
      email_cc_me: 1,
      // email_to_client: 0,
      email_to_client: 1,
      doc_title: 'Your new Order on FinancialVotes',
      
    });
    strapi.log.debug('createNewOrderDocument', params);
    // await axios.get(`${icountURL}/doc/create?${params}`)
    //   .then((res) => {
    //     // strapi.log.debug('result', res.data);
    //     data = res.data;
    //   })
    //   .catch((err) => {
    //     strapi.log.error(err.message);
    //   });
    return data;
  },
};
