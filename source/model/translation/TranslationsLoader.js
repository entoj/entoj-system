'use strict';

/**
 * Requirements
 * @ignore
 */
const Loader = require('../Loader.js').Loader;
const PathesConfiguration = require('../configuration/PathesConfiguration.js').PathesConfiguration;
const SitesRepository = require('../site/SitesRepository.js').SitesRepository;
const Translation = require('./Translation.js').Translation;
const ErrorHandler = require('../../error/ErrorHandler.js').ErrorHandler;
const assertParameter = require('../../utils/assert.js').assertParameter;
const co = require('co');
const fs = require('co-fs-extra');


/**
 * @class
 * @memberOf mode.translation
 * @extends {model.Loader}
 */
class TranslationsLoader extends Loader
{
    /**
     * @ignore
     */
    constructor(sitesRepository, pathesConfiguration, filenameTemplate)
    {
        super();

        //Check params
        assertParameter(this, 'sitesRepository', sitesRepository, true, SitesRepository);
        assertParameter(this, 'pathesConfiguration', pathesConfiguration, true, PathesConfiguration);

        // Assign options
        this._sitesRepository = sitesRepository;
        this._pathesConfiguration = pathesConfiguration;
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


    /**
     * @type {model.site.SitesRepository}
     */
    get sitesRepository()
    {
        return this._sitesRepository;
    }


    /**
     * @type {model.configuration.PathesConfiguration}
     */
    get pathesConfiguration()
    {
        return this._pathesConfiguration;
    }


    /**
     * @type {String}
     */
    get filenameTemplate()
    {
        return this._filenameTemplate;
    }


    /**
     * Loads all Translations
     *
     * @returns {Promise.<Array>}
     */
    load(changes)
    {
        const scope = this;
        const promise = co(function *()
        {
            const sites = yield scope.sitesRepository.getItems();
            const result = [];
            const filesProcessed = {};
            for (const site of sites)
            {
                const filename = yield scope.pathesConfiguration.resolve(scope.filenameTemplate, { site: site });
                if (!filesProcessed[filename])
                {
                    const fileExists = yield fs.exists(filename);
                    if (fileExists)
                    {
                        const translations = JSON.parse(yield fs.readFile(filename));
                        for (const translation in translations)
                        {
                            result.push(new Translation({ name: translation, value: translations[translation], site: site }));
                        }
                    }
                    filesProcessed[filename] = true;
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
