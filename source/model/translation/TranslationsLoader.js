'use strict';

/**
 * Requirements
 * @ignore
 */
const DataLoader = require('../data/DataLoader.js').DataLoader;
const PathesConfiguration = require('../configuration/PathesConfiguration.js').PathesConfiguration;
const SitesRepository = require('../site/SitesRepository.js').SitesRepository;
const Translation = require('./Translation.js').Translation;
const ErrorHandler = require('../../error/ErrorHandler.js').ErrorHandler;
const co = require('co');
const fs = require('co-fs-extra');


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
    constructor(sitesRepository, pathesConfiguration, filenameTemplate, languages)
    {
        super(sitesRepository, pathesConfiguration, filenameTemplate);

        // Assign options
        this._filenameTemplate = filenameTemplate || '${sites}/${site.name.urlify()}/translations.json';
        this._dataClass = Translation;
        this._languages = languages || ['en_EN'];
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [SitesRepository, PathesConfiguration, 'model.translation/TranslationsLoader.filenameTemplate', 'model.translation/TranslationsLoader.languages'] };
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
    get languages()
    {
        return this._languages;
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
