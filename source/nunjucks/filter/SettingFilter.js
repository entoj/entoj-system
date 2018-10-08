'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;
const SettingsRepository = require('../../model/setting/SettingsRepository.js').SettingsRepository;
const waitForPromise = require('../../utils/synchronize.js').waitForPromise;
const assertParameter = require('../../utils/assert.js').assertParameter;

/**
 * @memberOf nunjucks.filter
 */
class SettingFilter extends Filter {
    /**
     * @inheritDoc
     */
    constructor(settingsRepository) {
        super();
        this._name = 'settings';

        // Check params
        assertParameter(this, 'settingsRepository', settingsRepository, true, SettingsRepository);

        // Assign options
        this._settingsRepository = settingsRepository;
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return { parameters: [SettingsRepository] };
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'nunjucks.filter/SettingFilter';
    }

    /**
     * @type {model.setting.SettingsRepository}
     */
    get settingsRepository() {
        return this._settingsRepository;
    }

    /**
     * @inheritDoc
     */
    filter() {
        const scope = this;
        return function(value, context) {
            // Check key for settings
            if (!value || typeof value !== 'string') {
                scope.logger.warn('Missing key for settings', value);
                return scope.applyCallbacks({}, arguments);
            }

            // Get Setting
            const globals = scope.getGlobals(this);
            const site = globals.location.site || false;
            const setting = waitForPromise(scope.settingsRepository.getByNameAndSite(value, site));
            if (!setting) {
                scope.logger.warn('Missing settings for key', value);
                return scope.applyCallbacks({}, arguments);
            }

            return scope.applyCallbacks(setting, arguments);
        };
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.SettingFilter = SettingFilter;
