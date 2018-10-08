'use strict';

/**
 * Requirements
 * @ignore
 */
const BaseMap = require('../base/BaseMap.js').BaseMap;

/**
 * @memberOf configuration
 */
class ModuleConfigurations extends BaseMap {
    /**
     * @inheritDoc
     */
    static get className() {
        return 'configuration/ModuleConfigurations';
    }

    /**
     * @param {configuration.ModuleConfiguration} moduleConfiguration
     */
    register(moduleConfiguration) {
        this.set(moduleConfiguration.name, moduleConfiguration);
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.ModuleConfigurations = ModuleConfigurations;
