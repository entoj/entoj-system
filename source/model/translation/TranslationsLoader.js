'use strict';

/**
 * Requirements
 * @ignore
 */
const DataLoader = require('../data/DataLoader.js').DataLoader;
const PathesConfiguration = require('../configuration/PathesConfiguration.js').PathesConfiguration;
const GlobalConfiguration = require('../configuration/GlobalConfiguration.js').GlobalConfiguration;
const SitesRepository = require('../site/SitesRepository.js').SitesRepository;
const Translation = require('./Translation.js').Translation;
const ErrorHandler = require('../../error/ErrorHandler.js').ErrorHandler;
const co = require('co');
const fs = require('co-fs-extra');
const assertParameter = require('../../utils/assert.js').assertParameter;


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
    constructor(sitesRepository, pathesConfiguration, globalConfiguration, filenameTemplate)
    {
        super(sitesRepository, pathesConfiguration, filenameTemplate);

        // Check params
        assertParameter(this, 'globalConfiguration', globalConfiguration, true, GlobalConfiguration);

        // Assign options
        this._globalConfiguration = globalConfiguration;
        this._filenameTemplate = filenameTemplate || '${sites}/${site.name.urlify()}/translations.json';
        this._dataClass = Translation;
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [SitesRepository, PathesConfiguration, GlobalConfiguration, 'model.translation/TranslationsLoader.filenameTemplate'] };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.translation/TranslationsLoader';
    }


    /**
     * @type {Array}
     */
    get globalConfiguration()
    {
        return this._globalConfiguration;
    }


    /**
     * @type {Array}
     */
    get languages()
    {
        return this.globalConfiguration.get('languages', []);
    }


    /**
     * @inheritDoc
     */
    load(changes)
    {
        const scope = this;
        const promise = co(function *()
        {
            const sites = Array.isArray(changes)
                ? changes
                : yield scope.sitesRepository.getItems();
            const result = [];
            const filesProcessed = {};
            for (const site of sites)
            {
                for (const language of scope.languages)
                {
                    const filename = yield scope.generateFilename({ site: site, language: language });
                    if (!filesProcessed[filename])
                    {
                        const fileExists = yield fs.exists(filename);
                        if (fileExists)
                        {
                            const data = JSON.parse(yield fs.readFile(filename));
                            result.push(new scope.dataClass({ data: data, site: site, language: language }));
                        }
                        filesProcessed[filename] = true;
                    }
                }
            }
            return result;
        }).catch(ErrorHandler.handler(scope));
        return promise;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.TranslationsLoader = TranslationsLoader;
