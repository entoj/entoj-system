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
 * @memberOf mode.translation
 * @extends {model.Loader}
 */
class TranslationsLoader extends DataLoader
{
    /**
     * @ignore
     */
    constructor(sitesRepository, pathesConfiguration, filenameTemplate)
    {
        super(sitesRepository, pathesConfiguration, filenameTemplate);

        // Assign options
        this._filenameTemplate = filenameTemplate || '${sites}/${site.name.urlify()}/translations.json';
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [SitesRepository, PathesConfiguration, 'model.translation/TranslationsLoader.filenameTemplate'] };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.translation/TranslationsLoader';
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.TranslationsLoader = TranslationsLoader;
