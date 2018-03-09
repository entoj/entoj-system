'use strict';

/**
 * Requirements
 * @ignore
 */
const Repository = require('../Repository.js').Repository;
const TranslationsLoader = require('./TranslationsLoader.js').TranslationsLoader;
const co = require('co');


/**
 * @class
 * @memberOf model.Translation
 * @extends {Base}
 */
class TranslationsRepository extends Repository
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
     * @returns {Promise}
     */
    getByNameAndSite(name, site)
    {
        const scope = this;
        const promise = co(function *()
        {
            const items = yield scope.getItems();
            const found = items.find((item) => item.name === name && (!site || item.site.name === site.name));
            if (found)
            {
                return found;
            }
            if (site && site.extends)
            {
                return yield scope.getByNameAndSite(name, site.extends);
            }
            return false;
        });
        return promise;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.TranslationsRepository = TranslationsRepository;
