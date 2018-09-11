'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;
const isPlainObject = require('lodash.isplainobject');

/**
 * Generates a link url fro the given link object.
 * This serves as a integration helper for cms's
 *
 * @memberOf nunjucks.filter
 */
class LinkUrlFilter extends Filter {
    /**
     * @inheritDocs
     */
    constructor(dataProperties) {
        super();
        this._name = ['linkUrl', 'link'];

        // Assign options
        this.dataProperties = dataProperties || ['url'];
    }

    /**
     * @inheritDocs
     */
    static get injections() {
        return { parameters: ['nunjucks.filter/LinkUrlFilter.dataProperties'] };
    }

    /**
     * @inheritDocs
     */
    static get className() {
        return 'nunjucks.filter/LinkUrlFilter';
    }

    /**
     * @inheritDocs
     */
    filter() {
        const scope = this;
        return function(value) {
            let result = 'JavaScript:;';
            if (typeof value === 'string') {
                result = value;
            } else if (isPlainObject(value)) {
                for (const dataProperty of scope.dataProperties) {
                    if (typeof value[dataProperty] === 'string') {
                        result = value[dataProperty];
                    }
                }
            }
            return scope.applyCallbacks(result, arguments, {
                dataProperties: scope.dataProperties
            });
        };
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.LinkUrlFilter = LinkUrlFilter;
