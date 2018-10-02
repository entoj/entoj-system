'use strict';

/**
 * Requirements
 * @ignore
 */
const DataLoader = require('../data/DataLoader.js').DataLoader;
const SystemModuleConfiguration = require('../../configuration/SystemModuleConfiguration.js').SystemModuleConfiguration;
const PathesConfiguration = require('../configuration/PathesConfiguration.js').PathesConfiguration;
const SitesRepository = require('../site/SitesRepository.js').SitesRepository;
const assertParameter = require('../../utils/assert.js').assertParameter;


/**
 * @class
 * @memberOf mode.setting
 * @extends {model.Loader}
 */
class SettingsLoader extends DataLoader {
    /**
     * @ignore
     */
    constructor(sitesRepository, pathesConfiguration, moduleConfiguration) {
        super(sitesRepository, pathesConfiguration, moduleConfiguration.filenameSettings);

        // Check params
        assertParameter(this, 'moduleConfiguration', moduleConfiguration, true, SystemModuleConfiguration);
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return {
            parameters: [
                SitesRepository,
                PathesConfiguration,
                SystemModuleConfiguration
            ]
        };
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'model.setting/SettingsLoader';
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.SettingsLoader = SettingsLoader;
