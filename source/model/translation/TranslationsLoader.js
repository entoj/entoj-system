'use strict';

/**
 * Requirements
 * @ignore
 */
const Loader = require('../Loader.js').Loader;
const PathesConfiguration = require('../configuration/PathesConfiguration.js').PathesConfiguration;
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
    constructor(pathesConfiguration, filename)
    {
        super();

        //Check params
        assertParameter(this, 'pathesConfiguration', pathesConfiguration, true, PathesConfiguration);

        // Assign options
        this._pathesConfiguration = pathesConfiguration;
        this._filename = filename;
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [PathesConfiguration, 'model.translation/TranslationsLoader.filename'] };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.translation/TranslationsLoader';
    }


    /**
     * @inheritDoc
     */
    get pathesConfiguration()
    {
        return this._pathesConfiguration;
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
            if (scope.pathesConfiguration && scope._filename)
            {
                const result = [];
                const filename = yield scope.pathesConfiguration.resolve(scope._filename);
                const fileExists = yield fs.exists(filename);
                if (fileExists)
                {
                    const translations = JSON.parse(yield fs.readFile(filename));
                    for (const translation in translations)
                    {
                        result.push(new Translation({ name: translation, value: translations[translation] }));
                    }
                }
                return result;
            }
        }).catch(ErrorHandler.handler(scope));
        return promise;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.TranslationsLoader = TranslationsLoader;
