'use strict';

/**
 * Requirements
 * @ignore
 */
const SearchableArray = require('../../base/SearchableArray.js').SearchableArray;

/**
 * @class
 * @memberOf model.test
 * @extends {Base}
 */
class TestSuiteArray extends SearchableArray {
    /**
     * The namespaced class name
     *
     * @type {string}
     * @static
     */
    static get className() {
        return 'model.test/TestSuiteArray';
    }

    /**
     * @param {Class} type
     * @returns {Array}
     */
    getByType(type) {
        const result = this.filter(function(item) {
            if (typeof type === 'string') {
                return item.className.endsWith(type);
            }
            return item instanceof type;
        });
        return result;
    }

    /**
     * @param {Class} type
     * @returns {Array}
     */
    getFirstByType(type) {
        return this.getByType(type).shift();
    }

    /**
     * @param {String} name
     * @returns {Array}
     */
    getByName(name) {
        const result = this.find(function(item) {
            return item.name == name;
        });
        return result;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.TestSuiteArray = TestSuiteArray;
