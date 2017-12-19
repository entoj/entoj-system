'use strict';

/**
 * Requirements
 * @ignore
 */
const Repository = require('../Repository.js').Repository;
const TranslationsLoader = require('./TranslationsLoader.js').TranslationsLoader;


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
     * @inheritDocs
     */
    static get className()
    {
        return 'model.translation/TranslationsRepository';
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.TranslationsRepository = TranslationsRepository;
