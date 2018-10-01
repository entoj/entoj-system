'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;
const GlobalConfiguration = require('../../model/configuration/GlobalConfiguration.js').GlobalConfiguration;


/**
 * @memberOf nunjucks.filter
 */
class ConfigurationFilter extends Filter
{
    /**
     * @inheritDoc
     */
    constructor(globalConfiguration)
    {
        super();
        this._name = 'configuration';

        // Assign options
        this._globalConfiguration = globalConfiguration;
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
        return 'nunjucks.filter/ConfigurationFilter';
    }


    /**
     * @type {model.configuration.GlobalConfiguration}
     */
    get globalConfiguration()
    {
        return this._globalConfiguration;
    }


    /**
     * @inheritDoc
     */
    filter()
    {
        const scope = this;
        return function (value, defaultValue)
        {
            // Check for config
            if (!scope.globalConfiguration)
            {
                scope.logger.warn('Missing globalConfiguration');
                return scope.applyCallbacks(false, arguments);
            }

            // Use value or key for settings
            if (!value || typeof value !== 'string')
            {
                scope.logger.warn('Missing key for config', value);
                return scope.applyCallbacks(false, arguments);
            }

            // Get config
            const config = scope.globalConfiguration.get(value, defaultValue);
            if (typeof config == 'undefined')
            {
                scope.logger.warn('Missing config for key', value);
                return scope.applyCallbacks(false, arguments);
            }

            return scope.applyCallbacks(config, arguments);
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.ConfigurationFilter = ConfigurationFilter;
