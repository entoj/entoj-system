'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const BaseMap = require('../base/BaseMap.js').BaseMap;
const ModuleConfiguration = require('./ModuleConfiguration.js').ModuleConfiguration;
const assertParameter = require('../utils/assert.js').assertParameter;

/**
 * @memberOf configuration
 */
class ModuleConfigurations extends Base {
    /**
     * @param {Array} moduleConfigurations
     */
    constructor(moduleConfigurations) {
        super();

        // Options
        this._items = new BaseMap();

        // Load configurations
        if (moduleConfigurations && Array.isArray(moduleConfigurations)) {
            for (const moduleConfiguration of moduleConfigurations) {
                this.register(moduleConfiguration);
            }
        }
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'configuration/ModuleConfigurations';
    }

    /**
     * @type {base.BaseMap}
     */
    get items() {
        return this._items;
    }

    /**
     * Replaces any variables in value with their current configuration value
     *
     * @param {String} value
     * @returns {String}
     */
    resolveConfiguration(value) {
        let result = value;
        for (const moduleConfiguration of this.items.values()) {
            result = moduleConfiguration.resolveConfiguration(result);
        }
        return result;
    }

    /**
     * Checks if the configuration exists
     *
     * @param {String} name
     * @returns {Boolean}
     */
    hasConfiguration(name) {
        for (const moduleConfiguration of this.items.values()) {
            if (moduleConfiguration.has(name)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns the configuration value
     *
     * @param {String} name
     * @returns {mixed}
     */
    getConfiguration(name) {
        for (const moduleConfiguration of this.items.values()) {
            if (moduleConfiguration.has(name)) {
                return moduleConfiguration.get(name);
            }
        }
        return undefined;
    }

    /**
     * Updates a configuration.
     *
     * @param {String} name
     * @param {mixed} value
     * @returns {mixed}
     */
    setConfiguration(name, value) {
        for (const moduleConfiguration of this.items.values()) {
            if (moduleConfiguration.has(name)) {
                return moduleConfiguration.set(name, value);
            }
        }
        return false;
    }

    /**
     * @param {configuration.ModuleConfiguration} moduleConfiguration
     */
    register(moduleConfiguration) {
        assertParameter(
            this,
            'moduleConfiguration',
            moduleConfiguration,
            true,
            ModuleConfiguration
        );
        this.items.set(moduleConfiguration.name, moduleConfiguration);
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.ModuleConfigurations = ModuleConfigurations;
