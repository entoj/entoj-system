'use strict';

/**
 * Requirements
 * @ignore
 */
const DataRepository = require('../data/DataRepository.js').DataRepository;
const TranslationsLoader = require('./TranslationsLoader.js').TranslationsLoader;
const co = require('co');
const minimatch = require('minimatch');



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
     * @param {model.site.Site} site
     * @param {String} language
     * @returns {Promise}
     */
    getBySiteAndLanguage(site, language)
    {
        return this.findBy({ site: site, language: language });
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


    /**
     * @param {String} query
     * @param {model.site.Site} site
     * @param {String} language
     * @returns {Promise}
     */
    getByQuerySiteAndLanguage(query, site, language)
    {
        const scope = this;
        const promise = co(function *()
        {
            const items = yield scope.getItems();
            const found = items.find((item) => (!site || item.site.name === site.name) && (!language || item.language === language));
            if (found)
            {
                const result = {};
                for (const key in found.data)
                {
                    if (key.startsWith(query) || (minimatch(key, query)))
                    {
                        result[key] = found.data[key];
                    }
                }
                return result;
            }
            if (site && site.extends)
            {
                return yield scope.getByQuerySiteAndLanguage(query, site.extends, language);
            }
            return {};
        });
        return promise;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.TranslationsRepository = TranslationsRepository;
