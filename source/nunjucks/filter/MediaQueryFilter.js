'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;
const GlobalConfiguration = require('../../model/configuration/GlobalConfiguration.js').GlobalConfiguration;
const assertParameter = require('../../utils/assert.js').assertParameter;


/**
 * Returns a media query for a configured breakpoint.
 * To every breakpoint name you may add AndAbove or AndBelow to
 * specify ranges e.g. 'tabletAndAbove'
 *
 * @memberOf nunjucks.filter
 */
class MediaQueryFilter extends Filter
{
    /**
     * @inheritDoc
     */
    constructor(globalConfiguration)
    {
        super();
        this._name = 'mediaQuery';

        // Check params
        assertParameter(this, 'globalConfiguration', globalConfiguration, true, GlobalConfiguration);

        // Assign options
        this._mediaQueries = globalConfiguration.get('mediaQueries');
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [GlobalConfiguration] };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'nunjucks.filter/MediaQueryFilter';
    }


    /**
     * @inheritDoc
     */
    filter()
    {
        const scope = this;
        return function (value)
        {
            return scope.applyCallbacks(scope._mediaQueries[value] || value, arguments);
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.MediaQueryFilter = MediaQueryFilter;
