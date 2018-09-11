'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;
const SystemModuleConfiguration = require('../../configuration/SystemModuleConfiguration.js')
    .SystemModuleConfiguration;
const assertParameter = require('../../utils/assert.js').assertParameter;

/**
 * Returns a media query for a configured breakpoint.
 * To every breakpoint name you may add AndAbove or AndBelow to
 * specify ranges e.g. 'tabletAndAbove'
 *
 * @memberOf nunjucks.filter
 */
class MediaQueryFilter extends Filter {
    /**
     * @inheritDoc
     */
    constructor(moduleConfiguration) {
        super();
        this._name = 'mediaQuery';

        // Check params
        assertParameter(
            this,
            'moduleConfiguration',
            moduleConfiguration,
            true,
            SystemModuleConfiguration
        );

        // Assign options
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
        return 'nunjucks.filter/MediaQueryFilter';
    }

    /**
     * @inheritDoc
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
            return scope.applyCallbacks(
                scope.moduleConfiguration.mediaQueries[value] || '',
                arguments
            );
        };
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.MediaQueryFilter = MediaQueryFilter;
