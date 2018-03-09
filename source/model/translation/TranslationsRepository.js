'use strict';

/**
 * Requirements
 * @ignore
 */
const DataRepository = require('../data/DataRepository.js').DataRepository;
const TranslationsLoader = require('./TranslationsLoader.js').TranslationsLoader;


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
}

/**
 * Exports
 * @ignore
 */
module.exports.TranslationsRepository = TranslationsRepository;
