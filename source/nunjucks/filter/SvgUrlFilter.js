'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;
const urls = require('../../utils/urls.js');
const templateString = require('es6-template-strings');

/**
 * Generates a svg spritesheet url.
 *
 * @memberOf nunjucks.filter
 */
class SvgUrlFilter extends Filter {
    /**
     * @inheritDoc
     */
    constructor(baseUrl) {
        super();
        this._name = 'svgUrl';

        // Assign options
        this._baseUrl = baseUrl || '/';
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return { parameters: ['nunjucks.filter/SvgUrlFilter.baseUrl'] };
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'nunjucks.filter/SvgUrlFilter';
    }

    /**
     * @returns {String}
     */
    getBaseUrl(globals) {
        let result = this._baseUrl;
        if (this.environment && this.environment.buildConfiguration) {
            result = this.environment.buildConfiguration.get('filters.svgUrl', this._baseUrl);
        }
        return templateString(result, globals.location || {});
    }

    /**
     * @inheritDoc
     */
    filter(value) {
        const scope = this;
        return function(value) {
            const globals = scope.getGlobals(this);
            const result = urls.concat(scope.getBaseUrl(globals), value + '.svg#icon');
            return scope.applyCallbacks(result, arguments, { asset: value });
        };
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.SvgUrlFilter = SvgUrlFilter;
