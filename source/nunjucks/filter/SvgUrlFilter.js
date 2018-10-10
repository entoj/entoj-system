'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;
const urls = require('../../utils/urls.js');
const SystemModuleConfiguration = require('../../configuration/SystemModuleConfiguration.js')
    .SystemModuleConfiguration;
const templateString = require('es6-template-strings');
const assertParameter = require('../../utils/assert.js').assertParameter;

/**
 * Generates a svg spritesheet url.
 *
 * @memberOf nunjucks.filter
 */
class SvgUrlFilter extends Filter {
    /**
     * @inheritDoc
     */
    constructor(moduleConfiguration) {
        super();
        // Check
        assertParameter(
            this,
            'moduleConfiguration',
            moduleConfiguration,
            true,
            SystemModuleConfiguration
        );

        // Assign options
        this._name = ['svgUrl', 'svg'];
        this._moduleConfiguration = moduleConfiguration;
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return { parameters: [SystemModuleConfiguration] };
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'nunjucks.filter/SvgUrlFilter';
    }

    /**
     * @type {configuration.SystemModuleConfiguration}
     */
    get moduleConfiguration() {
        return this._moduleConfiguration;
    }

    /**
     * @inheritDoc
     */
    filter(value) {
        const scope = this;
        return function(value) {
            const globals = scope.getGlobals(this);
            let result = urls.concat(
                templateString(
                    scope.moduleConfiguration.filterSvgUrlBaseUrl,
                    globals.location || {}
                ),
                value
            );
            if (!result.endsWith('.svg')) {
                result += '.svg';
            }
            result += '#icon';
            return scope.applyCallbacks(result, arguments, { asset: value });
        };
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.SvgUrlFilter = SvgUrlFilter;
