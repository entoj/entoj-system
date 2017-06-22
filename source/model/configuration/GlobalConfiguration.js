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
        return this._values.getByPath(name, defaultValue);
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.GlobalConfiguration = GlobalConfiguration;
