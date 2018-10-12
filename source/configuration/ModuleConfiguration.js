'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const BaseMap = require('../base/BaseMap.js').BaseMap;
const BuildConfiguration = require('../model/configuration/BuildConfiguration.js')
    .BuildConfiguration;
const GlobalConfiguration = require('../model/configuration/GlobalConfiguration.js')
    .GlobalConfiguration;
const assertParameter = require('../utils/assert.js').assertParameter;

/**
 * @memberOf configuration
 */
class ModuleConfiguration extends Base {
    /**
     * @param {model.configuration.GlobalConfiguration} globalConfiguration
     * @param {model.configuration.BuildConfiguration} buildConfiguration
     */
    constructor(globalConfiguration, buildConfiguration) {
        super();

        //Check params
        assertParameter(
            this,
            'globalConfiguration',
            globalConfiguration,
            true,
            GlobalConfiguration
        );
        assertParameter(this, 'buildConfiguration', buildConfiguration, true, BuildConfiguration);

        // Set
        this._globalConfiguration = globalConfiguration;
        this._buildConfiguration = buildConfiguration;
        this._name = '';
        this._meta = new BaseMap();
        this._configuration = new BaseMap();
        this._templateVariables = {};
        this._maxRecursionDepth = 10;

        // Go
        this.createMeta();
        this.changedMeta();
        this.createConfiguration();
        this.finalizeConfiguration();

        // Watch for changes
        this.supressChanges = false;
        this.meta.events.on('change', () => {
            if (this.supressChanges) {
                return;
            }
            this.supressChanges = true;
            this.changedMeta();
            this.createConfiguration();
            this.finalizeConfiguration();
            this.supressChanges = false;
        });
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return {
            parameters: [GlobalConfiguration, BuildConfiguration]
        };
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'configuration/ModuleConfiguration';
    }

    /**
     * @type {String}
     */
    get name() {
        return this._name;
    }

    /**
     * @type {model.configuration.GlobalConfiguration}
     */
    get globalConfiguration() {
        return this._globalConfiguration;
    }

    /**
     * @type {model.configuration.BuildConfiguration}
     */
    get buildConfiguration() {
        return this._buildConfiguration;
    }

    /**
     * @type {base.BaseMap}
     */
    get templateVariables() {
        return this._templateVariables;
    }

    /**
     * @type {base.BaseMap}
     */
    get meta() {
        return this._meta;
    }

    /**
     * @type {base.BaseMap}
     */
    get configuration() {
        return this._configuration;
    }

    /**
     * Replaces any variables in value with their current configuration value
     */
    resolveConfiguration(value) {
        // Replace templates for a key
        const replaceTemplates = (value, count) => {
            let result = value;
            if (count > this._maxRecursionDepth) {
                throw new Error('Detected recursive template for ' + value);
            }
            const matches = value.match(/\$\{[^}]+\}/);
            let replaceCount = 0;
            if (matches && replaceCount < this._maxRecursionDepth) {
                for (const match of matches) {
                    if (
                        typeof this._templateVariables[match] == 'string' &&
                        typeof value == 'string'
                    ) {
                        result = result.replace(match, this._templateVariables[match]);
                        replaceCount++;
                    }
                }
            }
            if (replaceCount > 0) {
                result = replaceTemplates(result, count + 1);
            }
            return result;
        };
        return replaceTemplates(value, 0);
    }

    /**
     * @param  {function} filter
     * @returns {Object}
     */
    getMetaAsObject(filter) {
        const result = {};
        for (const key of this.meta.keys()) {
            const meta = this.meta.get(key);
            if (!meta.path) {
                continue;
            }
            const pathParts = meta.path.split('.');
            if (filter && !filter(pathParts)) {
                continue;
            }
            let current = result;
            for (let pathIndex = 0; pathIndex < pathParts.length; pathIndex++) {
                const pathPart = pathParts[pathIndex];
                if (pathIndex < pathParts.length - 1) {
                    if (typeof current[pathPart] == 'undefined') {
                        current[pathPart] = {};
                    }
                    current = current[pathPart];
                } else if (pathIndex == pathParts.length - 1) {
                    current[pathPart] = meta.defaultValue;
                }
            }
        }
        return result;
    }

    /**
     * @param  {function} filter
     * @returns {Object}
     */
    getConfigurationAsObject(filter) {
        const result = {};
        for (const key of this.configuration.keys()) {
            const value = this.configuration.get(key);
            const meta = this.meta.get(key);
            const pathParts = meta && meta.path ? meta.path.split('.') : key.split('.');
            if (filter && !filter(pathParts)) {
                continue;
            }
            let current = result;
            for (let pathIndex = 0; pathIndex < pathParts.length; pathIndex++) {
                const pathPart = pathParts[pathIndex];
                if (pathIndex < pathParts.length - 1) {
                    if (typeof current[pathPart] == 'undefined') {
                        current[pathPart] = {};
                    }
                    current = current[pathPart];
                } else if (pathIndex == pathParts.length - 1) {
                    current[pathPart] = value;
                }
            }
        }
        return result;
    }

    /**
     * Add all needed meta data for configuration
     *
     * @protected
     */
    createMeta() {}

    /**
     * Updates any dependent configs after a config value has changed
     *
     * @protected
     */
    changedMeta() {}

    /**
     * Walks all configuration and replaces any templates
     * with their current value
     *
     * @protected
     */
    createConfiguration() {
        // Create template variables
        this._templateVariables = {};
        for (const key of this.meta.keys()) {
            const meta = this.meta.get(key);
            if (typeof meta.value == 'string') {
                // Add key
                this._templateVariables['${' + key + '}'] = meta.value;

                // Add path
                if (meta.path) {
                    this._templateVariables['${' + meta.path + '}'] = meta.value;
                }
            }
        }

        // Replace templates for a key
        const replaceTemplates = (key, count) => {
            if (count > this._maxRecursionDepth) {
                throw new Error('Detected recursive template for ' + key);
            }
            const matches = this.configuration.get(key).match(/\$\{[^}]+\}/);
            let replaceCount = 0;
            if (matches && replaceCount < this._maxRecursionDepth) {
                for (const match of matches) {
                    if (
                        typeof this._templateVariables[match] == 'string' &&
                        typeof this.configuration.get(key) == 'string'
                    ) {
                        this.configuration.set(
                            key,
                            this.configuration
                                .get(key)
                                .replace(match, this._templateVariables[match])
                        );
                        replaceCount++;
                    }
                }
            }
            if (replaceCount > 0) {
                replaceTemplates(key, count + 1);
            }
        };

        // Replace all templates
        this.configuration.clear();
        for (const key of this.meta.keys()) {
            this.configuration.set(key, this.meta.get(key).value);
            if (typeof this.configuration.get(key) == 'string') {
                replaceTemplates(key, 0);
            }
        }
    }

    /**
     * @protected
     */
    finalizeConfiguration() {}

    /**
     * @protected
     * @param {String} path
     * @param {mixed} defaultValue
     */
    getConfigurationValue(path, defaultValue) {
        if (!path) {
            return defaultValue;
        }
        return this.buildConfiguration.get(path, this.globalConfiguration.get(path, defaultValue));
    }

    /**
     * @protected
     * @param {String} name
     * @param {String} path
     * @param {mixed} defaultValue
     */
    addMeta(name, path, defaultValue) {
        this.meta.set(name, {
            name: name,
            path: path,
            defaultValue: defaultValue,
            value: this.getConfigurationValue(path, defaultValue)
        });
    }

    /**
     * @protected
     * @param {String} name
     * @param {mixed} value
     */
    updateMeta(name, value) {
        const configuration = this.meta.get(name);
        configuration.value = value;
        this.meta.set(name, configuration);
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.ModuleConfiguration = ModuleConfiguration;
