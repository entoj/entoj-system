'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../../Base.js').Base;
const BaseMap = require('../../base/BaseMap.js').BaseMap;


/**
 * Holds all global configurations.
 *
 * @memberOf model.configuration
 */
class GlobalConfiguration extends Base
{
    /**
     * @param {object} options
     */
    constructor(options)
    {
        super();

        // Settings
        this._values = new BaseMap();
        this._values.load(this.defaults);
        this._values.load(options);

        // Create media queries
        this.generateMediaQueries();
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': ['model.configuration/GlobalConfiguration.options'] };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.configuration/GlobalConfiguration';
    }


    /**
     * @inheritDoc
     */
    get defaults()
    {
        const result =
        {
            groups:
            {
                default: 'common'
            },
            formats:
            {
                date: 'YYYY-MM-DD',
                number: '0.000'
            },
            breakpoints:
            {
                application:
                {
                    minWidth: '1280px'
                },
                desktop:
                {
                    minWidth: '1025px',
                    maxWidth: '1279px'
                },
                tablet:
                {
                    minWidth: '1024px',
                    maxWidth: '1024px'
                },
                miniTablet:
                {
                    minWidth: '768px',
                    maxWidth: '1023px'
                },
                phablet:
                {
                    minWidth: '376px',
                    maxWidth: '767px'
                },
                mobile:
                {
                    maxWidth: '375px'
                }
            },
            tests:
            [
            ]
        };
        return result;
    }


    /**
     * Generates a list of media queries based on the configured breakpoints
     *
     * @protected
     * @todo make this a plugin?
     */
    generateMediaQueries()
    {
        const mediaQueries = {};
        const breakpoints = this.get('breakpoints');
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
        this._values.set('mediaQueries', mediaQueries);
    }


    /**
     * @inheritDoc
     */
    has(name)
    {
        return this._values.getByPath(name) !== undefined;
    }


    /**
     * @inheritDoc
     */
    get(name, defaultValue)
    {
        const result = this._values.getByPath(name, defaultValue);
        if (typeof result === 'undefined')
        {
            throw new Error('Could not find settings for ' + name);
        }
        return result;
    }


    /**
     * @inheritDoc
     */
    set(name, value)
    {
        this._values.setByPath(name, value);
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.GlobalConfiguration = GlobalConfiguration;
