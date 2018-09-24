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
const kebabCase = require('lodash.kebabcase');
const camelCase = require('lodash.camelcase');

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
        this._rawConfigurations = new BaseMap();
        this._configurations = new BaseMap();
        this._maxRecursionDepth = 10;

        // Go
        this.createConfigurations();
        this.updateConfigurations();

        // Watch for changes
        this._rawConfigurations.events.on('change', () => this.updateConfigurations());
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
    get rawConfigurations() {
        return this._rawConfigurations;
    }

    /**
     * @type {base.BaseMap}
     */
    get configurations() {
        return this._configurations;
    }

    /**
     */
    createConfigurations() {}

    /**
     * Walks all configurations and replaces any templates
     * with their current value
     *
     * @protected
     */
    updateConfigurations() {
        // Create data
        const data = {};
        for (const key of this.rawConfigurations.keys()) {
            if (typeof this.rawConfigurations.get(key) == 'string') {
                const parts = kebabCase(key).split('-');
                const object = parts.shift();
                const objectKey = camelCase(parts.join('-'));
                data['${' + key + '}'] = this.rawConfigurations.get(key);
                data['${' + object + '.' + objectKey + '}'] = this.rawConfigurations.get(key);
            }
        }

        // Replace templates for a key
        const replaceTemplates = (key, count) => {
            if (count > this._maxRecursionDepth) {
                throw new Error('Detected recursive template for ' + key);
            }
            const matches = this.configurations.get(key).match(/\$\{[^}]+\}/);
            let replaceCount = 0;
            if (matches && replaceCount < this._maxRecursionDepth) {
                for (const match of matches) {
                    if (
                        typeof data[match] == 'string' &&
                        typeof this.configurations.get(key) == 'string'
                    ) {
                        this.configurations.set(
                            key,
                            this.configurations.get(key).replace(match, data[match])
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
        this.configurations.clear();
        for (const key of this.rawConfigurations.keys()) {
            this.configurations.set(key, this.rawConfigurations.get(key));
            if (typeof this.configurations.get(key) == 'string') {
                replaceTemplates(key, 0);
            }
        }
        /*
        console.log('updateConfigurations data=', data);
        console.log('updateConfigurations rawConfigurations=', this.rawConfigurations);
        console.log('updateConfigurations configurations=', this.configurations);
        */
    }

    /**
     * @protected
     * @param {String} path
     * @param {mixed} defaultValue
     */
    getConfiguration(path, defaultValue) {
        return this.buildConfiguration.get(path, this.globalConfiguration.get(path, defaultValue));
    }

    /**
     * @protected
     * @param {String} name
     * @param {String} path
     * @param {mixed} defaultValue
     */
    addConfiguration(name, path, defaultValue) {
        this.rawConfigurations.set(name, this.getConfiguration(path, defaultValue));
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.ModuleConfiguration = ModuleConfiguration;
