'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;
const isPlainObject = require('lodash.isplainobject');
const SystemModuleConfiguration = require('../../configuration/SystemModuleConfiguration.js')
    .SystemModuleConfiguration;
const assertParameter = require('../../utils/assert.js').assertParameter;

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
        this._name = ['linkUrl', 'link'];
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
        return 'nunjucks.filter/LinkUrlFilter';
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
    filter() {
        const scope = this;
        return function(value) {
            let result = 'JavaScript:;';
            if (typeof value === 'string') {
                result = value;
            } else if (isPlainObject(value)) {
                for (const dataProperty of scope.moduleConfiguration.filterLinkUrlProperties) {
                    if (typeof value[dataProperty] === 'string') {
                        result = value[dataProperty];
                    }
                }
            }
            return scope.applyCallbacks(result, arguments, {
                properties: scope.moduleConfiguration.filterLinkUrlProperties
            });
        };
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.LinkUrlFilter = LinkUrlFilter;
