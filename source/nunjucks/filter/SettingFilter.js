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
        this.settings = settings || {};
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
        return function (value, key)
        {
            // Use value or key for settings
            let settingsKey = value;
            if (!settingsKey && key)
            {
                settingsKey = key;
            }
            if (!settingsKey || typeof settingsKey !== 'string')
            {
                scope.logger.warn('Missing key for settings', value);
                return {};
            }

            // Get Setting
            if (!scope.settings[settingsKey])
            {
                scope.logger.warn('Missing settings for key', settingsKey);
                return {};
            }
            return scope.settings[settingsKey];
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.SettingFilter = SettingFilter;
