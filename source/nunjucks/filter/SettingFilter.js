'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;
const SettingsRepository = require('../../model/setting/SettingsRepository.js').SettingsRepository;
const waitForPromise = require('../../utils/synchronize.js').waitForPromise;


/**
 * @memberOf nunjucks.filter
 */
class SettingFilter extends Filter
{
    /**
     * @inheritDoc
     */
    constructor(settingsRepository)
    {
        super();
        this._name = 'settings';

        // Assign options
        this._settingsRepository = settingsRepository;
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [SettingsRepository] };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'nunjucks.filter/SettingFilter';
    }


    /**
     * @type {model.setting.SettingsRepository}
     */
    get settingsRepository()
    {
        return this._settingsRepository;
    }


    /**
     * @inheritDoc
     */
    filter()
    {
        const scope = this;
        return function (value, context)
        {
            // Check for repo
            if (!scope.settingsRepository)
            {
                scope.logger.warn('Missing settingsRepository');
                return scope.applyCallbacks({}, arguments);
            }

            // Use value or key for settings
            if (!value || typeof value !== 'string')
            {
                scope.logger.warn('Missing key for settings', value);
                return scope.applyCallbacks({}, arguments);
            }

            // Get Setting
            const setting = waitForPromise(scope.settingsRepository.findBy({ name: value }));
            if (!setting)
            {
                scope.logger.warn('Missing settings for key', value);
                return scope.applyCallbacks({}, arguments);
            }

            return scope.applyCallbacks(setting.value, arguments);
        };
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.SettingFilter = SettingFilter;
