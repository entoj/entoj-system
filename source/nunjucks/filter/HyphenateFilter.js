'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;
const Hypher = require('hypher');

/**
 * @memberOf nunjucks.filter
 */
class HyphenateFilter extends Filter {
    /**
     * @inheritDocs
     */
    constructor() {
        super();
        this._name = 'hyphenate';
        this._hypher = new Hypher(require('hyphenation.de'));
    }

    /**
     * @inheritDocs
     */
    static get className() {
        return 'nunjucks.filter/HyphenateFilter';
    }

    /**
     * @inheritDocs
     */
    get hypher() {
        return this._hypher;
    }

    /**
     * @inheritDocs
     */
    filter() {
        const scope = this;
        return function(value) {
            let result = '';
            if (value) {
                result = scope.hypher.hyphenateText(value);
            }
            return scope.applyCallbacks(result, arguments);
        };
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.HyphenateFilter = HyphenateFilter;
