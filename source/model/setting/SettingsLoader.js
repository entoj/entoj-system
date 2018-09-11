'use strict';

/**
 * Requirements
 * @ignore
 */
const DataLoader = require('../data/DataLoader.js').DataLoader;
const PathesConfiguration = require('../configuration/PathesConfiguration.js').PathesConfiguration;
const SitesRepository = require('../site/SitesRepository.js').SitesRepository;

/**
 * @class
 * @memberOf mode.setting
 * @extends {model.Loader}
 */
class SettingsLoader extends DataLoader {
    /**
     * @ignore
     */
    constructor(sitesRepository, pathesConfiguration, filenameTemplate) {
        super(sitesRepository, pathesConfiguration, filenameTemplate);

        // Assign options
        this._filenameTemplate = filenameTemplate || '${sites}/${site.name.urlify()}/settings.json';
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return {
            parameters: [
                SitesRepository,
                PathesConfiguration,
                'model.setting/SettingsLoader.filenameTemplate'
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
