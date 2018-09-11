'use strict';

/**
 * Requirements
 * @ignore
 */
const BaseArray = require('./BaseArray.js').BaseArray;
const matchObject = require('../utils/match.js').matchObject;

/**
 * @class
 * @memberOf model.performance.resource
 * @extends {Base}
 */
class SearchableArray extends BaseArray {
    /**
     * @inheritDoc
     */
    static get className() {
        return 'base/SearchableArray';
    }

    /**
     * Find item by property queries.
     *
     * @param {Object} properties
     * @returns {*}
     */
    findBy(properties) {
        return this.find((item) => matchObject(item, properties));
    }

    /**
     * Filter items by property queries.
     *
     * @param {Object} properties
     * @returns {Promise.<Array>}
     */
    filterBy(properties) {
        const result = new SearchableArray();
        result.push(...this.filter((item) => matchObject(item, properties)));
        return result;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.SearchableArray = SearchableArray;
