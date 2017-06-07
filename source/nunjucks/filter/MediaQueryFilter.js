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
        this._mediaQueries = this.generateMediaQueries(globalConfiguration);
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
     * Generates a list of media queries based on the configured breakpoints
     *
     * @protected
     * @todo make this a plugin?
     */
    generateMediaQueries(globalConfiguration)
    {
        const mediaQueries = {};
        const breakpoints = globalConfiguration.get('breakpoints');
        for (const breakpointName in breakpoints)
        {
            const breakpoint = breakpoints[breakpointName];
            if (breakpoint.maxWidth)
            {
                mediaQueries[breakpointName + 'AndBelow'] = '(max-width: ' + breakpoint.maxWidth + ')';
            }
            if (breakpoint.minWidth)
            {
                mediaQueries[breakpointName + 'AndAbove'] = '(min-width: ' + breakpoint.minWidth + ')';
            }
            mediaQueries[breakpointName] = '';
            if (breakpoint.minWidth)
            {
                mediaQueries[breakpointName]+= '(min-width: ' + breakpoint.minWidth + ')';
            }
            if (breakpoint.maxWidth)
            {
                mediaQueries[breakpointName]+= (mediaQueries[breakpointName].length ? ' and ' : '') + '(max-width: ' + breakpoint.maxWidth + ')';
            }
        }
        return mediaQueries;
    }


    /**
     * @inheritDoc
     */
    filter()
    {
        const scope = this;
        return function (value)
        {
            const mediaQuery = scope._mediaQueries[value] || '';
            scope.logger.info('breakpoint=' + value + ', mediaQuery=' + mediaQuery);
            return mediaQuery;
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.MediaQueryFilter = MediaQueryFilter;
