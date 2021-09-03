'use strict';

/**
 * `util` service.
 */

module.exports = {
  /**
   * Check (safe) if a key exist in the given Object.
   * 
   * @param {Object} obj object
   * @param {string} key object key
   * @returns 
   */
   checkObjectProperty: (obj, key) => {
    // strapi.log.debug("helper checkObjectProperty", obj, key);
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return true;
    } else {
      return false;
    }
  },
  /**
   * Check (safe) if the given object has the required keys.
   * 
   * @param {Object} object object
   * @param {string[]} requiredKeys object properties as a string array
   * @returns 
   */
  checkObjectProperties: (object, requiredKeys) => {
    // strapi.log.debug("checkObjectProperties: ", object, requiredKeys);
    let count = 0;
    let message = "";
    let validity = false;
    if (Object.keys(object).length < requiredKeys.length) {
      // object does not have the required number of keys
      message = `${requiredKeys.map((attribute) => `${attribute}`)} attributes required!`;
    } else {
      // check each required key exist in the object
      requiredKeys.map((key) => {
        if (strapi.services.helper.checkObjectProperty(object, key)) {
          count += 1;
        }
      });
    }
    if (count === requiredKeys.length) {
      validity = true;
      // strapi.log.debug("Validated!");
    }
    return { validity, message };
  },
  /**
   * Returns a clearn/purged entity from a given entity only keeping the specified attributes
   * 
   * @param {Object} entity object to be clean/purged
   * @param {string[]} attributes allowed array of attributes
   * @returns {Obtect} purged entity
   */
  purgeEntity: async (entity, attributes) => {
    let purgedEntity = {};
    await Promise.all(attributes.map((attribute) => {
      if (entity[attribute]) {
        purgedEntity[attribute] = entity[attribute];
      }
    }));
    return purgedEntity;
  },
  /**
   * Returns a sanitized entity from a given entity only keeping the specified attributes
   * 
   * @param {Object} entity object to be clean/purged
   * @param {string[]} attributes disallowed array of attributes
   * @returns {Obtect} purged entity
   */
  customSanitizeEntity: async (entity, attributes) => {
    let sanitizedEntity = {};
    await Promise.all(Object.keys(entity).map((attribute) => {
      if (!attributes.includes(attribute)) {
        sanitizedEntity[attribute] = entity[attribute];
      }
    }));
    return sanitizedEntity;
  }
};
