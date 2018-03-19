'use strict';

/**
 * Requirements
 * @ignore
 */
const DataRepository = require('../data/DataRepository.js').DataRepository;
const TranslationsLoader = require('./TranslationsLoader.js').TranslationsLoader;
const co = require('co');


/**
 * @class
 * @memberOf model.translation
 * @extends {Base}
 */
class TranslationsRepository extends DataRepository
{
    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [TranslationsLoader] };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.translation/TranslationsRepository';
    }


    /**
     * @param {String} name
     * @param {model.site.Site} site
     * @param {String} language
     * @returns {Promise}
     */
    getByNameSiteAndLanguage(name, site, language)
    {
        const scope = this;
        const promise = co(function *()
        {
            const items = yield scope.getItems();
            const found = items.find((item) => (!site || item.site.name === site.name) && (!language || item.language === language));
            if (found &&
                typeof found.data[name] !== 'undefined')
            {
                return found.data[name];
            }
            if (site && site.extends)
            {
                return yield scope.getByNameSiteAndLanguage(name, site.extends, language);
            }
            return undefined;
        });
        return promise;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.TranslationsRepository = TranslationsRepository;
