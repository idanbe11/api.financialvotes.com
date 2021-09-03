'use strict';

/**
 * `helper` service.
 */


/**
 * Add a given number of days to a given date
 * 
 * @param {Date} date Date object
 * @param {number} days Number of days
 * @returns 
 */
 const addDays = (date, days) => {
  const updatedDate = new Date(Number(date));
  // strapi.log.debug('updatedDate', updatedDate);
  updatedDate.setDate(date.getDate() + days);
  // strapi.log.debug('updatedDate updated', new Date(updatedDate));
  return new Date(updatedDate);
}

module.exports = {
  timestamp: () => {
    let time = new Date();
    // strapi.log.debug('timestamp', time);
    return time.toUTCString();
  },
  getOSInfo: (userAgentHeader) => {
    if (typeof userAgentHeader === "string") {
      let os = "Other";
      if (userAgentHeader.indexOf("Win") !== -1) os = "Windows";
      if (userAgentHeader.indexOf("Android") !== -1) os = "Android ";
      if (userAgentHeader.indexOf("Mac") !== -1) os = "Macintosh";
      if (userAgentHeader.indexOf("like Mac") !== -1) os = "iOS";
      if (userAgentHeader.indexOf("Linux") !== -1) os = "Linux";
      if (userAgentHeader.indexOf("X11") !== -1) os = "Unix";
      const osInfo = {
        osName: os,
        info: userAgentHeader
      };
      // strapi.log.debug('osInfo', osInfo);
      return osInfo;
    } else {
      throw new TypeError("Invalid user-agent header!");
    }
  },
  addDays,
};
