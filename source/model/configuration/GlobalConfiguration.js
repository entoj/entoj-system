'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../../Base.js').Base;
const BaseMap = require('../../base/BaseMap.js').BaseMap;
const breakpointsToMediaQueries = require('../../utils/processors.js').breakpointsToMediaQueries;


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
        if (!this._values.has('mediaQueries'))
        {
            this._values.set('mediaQueries', breakpointsToMediaQueries(this._values.get('breakpoints')));
        }
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
            breakpoints:
            {
            },
            tests:
            [
            ]
        };
        return result;
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
    get(name)
    {
        const result = this._values.getByPath(name);
        if (typeof result === 'undefined')
        {
            throw new Error('Could not find settings for ' + name);
        }
        return result;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.GlobalConfiguration = GlobalConfiguration;
