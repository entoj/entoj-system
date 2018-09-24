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
        this._configurations = new BaseMap();

        // Go
        this.createConfigurations();
        this.finalizeConfigurations();
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
    get configurations() {
        return this._configurations;
    }

    /**
     */
    createConfigurations() {}

    /**
     */
    finalizeConfigurations() {
        // Create data
        const data = {};
        for (const key of this.configurations.keys()) {
            if (typeof this.configurations.get(key) == 'string') {
                const parts = kebabCase(key).split('-');
                const object = parts.shift();
                const objectKey = camelCase(parts.join('-'));
                data['${' + key + '}'] = this.configurations.get(key);
                data['${' + object + '.' + objectKey + '}'] = this.configurations.get(key);
            }
        }

        // Replace templates for a key
        const replaceTemplates = (key) => {
            let hasChanges = false;
            const matches = this.configurations.get(key).match(/\$\{[^}]+\}/);
            if (matches) {
                for (const match of matches) {
                    if (typeof data[match] != 'undefined') {
                        this.configurations.set(
                            key,
                            this.configurations.get(key).replace(match, data[match])
                        );
                        hasChanges = true;
                    }
                }
            }
            if (hasChanges) {
                replaceTemplates(key);
            }
        };

        // Replace all templates
        for (const key of this.configurations.keys()) {
            if (typeof this.configurations.get(key) == 'string') {
                replaceTemplates(key);
            }
        }
    }

    /**
     * @param {String} path
     * @param {mixed} defaultValue
     */
    getConfiguration(path, defaultValue) {
        return this.buildConfiguration.get(path, this.globalConfiguration.get(path, defaultValue));
    }

    /**
     * @param {String} name
     * @param {String} path
     * @param {mixed} defaultValue
     */
    addConfiguration(name, path, defaultValue) {
        this.configurations.set(name, this.getConfiguration(path, defaultValue));
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.ModuleConfiguration = ModuleConfiguration;
