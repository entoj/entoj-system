'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;


/**
 * @memberOf nunjucks.filter
 */
class SettingFilter extends Filter
{
    /**
     * @inheritDoc
     */
    constructor(settings)
    {
        super();
        this._name = 'settings';

        // Assign options
        this._settings = settings || {};
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': ['nunjucks.filter/SettingFilter.settings'] };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'nunjucks.filter/SettingFilter';
    }


    /**
     * @type {Object}
     */
    get settings()
    {
        return this._settings;
    }

    set settings(value)
    {
        this._settings = value || {};
    }


    /**
     * @inheritDoc
     */
    filter()
    {
        const scope = this;
        return function (value, context)
        {
            // Use value or key for settings
            if (!value || typeof value !== 'string')
            {
                scope.logger.warn('Missing key for settings', value);
                return {};
            }

            // Get Setting
            if (!scope.settings[value])
            {
                scope.logger.warn('Missing settings for key', value);
                return {};
            }

            return scope.settings[value];
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.SettingFilter = SettingFilter;
