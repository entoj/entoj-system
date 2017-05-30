'use strict';

/**
 * Requirements
 * @ignore
 */
const Repository = require('../Repository.js').Repository;
const SitesLoader = require('../site/SitesLoader.js').SitesLoader;


/**
 * @class
 * @memberOf model.site
 * @extends {Base}
 */
class SitesRepository extends Repository
{
    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [SitesLoader] };
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'model.site/SitesRepository';
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.SitesRepository = SitesRepository;
