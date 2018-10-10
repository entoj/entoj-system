'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;
const createRandomNumberGenerator = require('../../utils/random.js').createRandomNumberGenerator;
const striptags = require('striptags');
const htmlify = require('../../utils/string.js').htmlify;
const SystemModuleConfiguration = require('../../configuration/SystemModuleConfiguration.js')
    .SystemModuleConfiguration;
const assertParameter = require('../../utils/assert.js').assertParameter;

/**
 * @memberOf nunjucks.filter
 */
class MarkupFilter extends Filter {
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
        this._name = ['markup'];
        this._moduleConfiguration = moduleConfiguration;
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'nunjucks.filter/MarkupFilter';
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return { parameters: [SystemModuleConfiguration] };
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
        return function(value, style) {
            const result = value || '';
            const styleName = scope.moduleConfiguration.filterMarkupStyles[style] || 'html';
            // Strip tags?
            if (styleName == 'plain') {
                return striptags(result);
            }
            // Cheap test if tags there?
            if (result.indexOf('<') > -1) {
                return result;
            }
            const globals = scope.getGlobals(this);
            const useStaticContent = scope.useStaticContent(globals.request);
            const tags = [
                {
                    name: 'a',
                    probability: 0.2,
                    attributes: {
                        href: 'JavaScript:;'
                    }
                },
                {
                    name: ['b', 'i'],
                    probability: 0.2
                }
            ];
            const options = {
                tags: tags,
                random: createRandomNumberGenerator(useStaticContent)
            };
            return scope.applyCallbacks(htmlify(result, options), arguments, options);
        };
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.MarkupFilter = MarkupFilter;
