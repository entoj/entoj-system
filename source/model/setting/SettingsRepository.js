'use strict';

/**
 * Requirements
 * @ignore
 */
const DataRepository = require('../data/DataRepository.js').DataRepository;
const SettingsLoader = require('./SettingsLoader.js').SettingsLoader;


/**
 * @class
 * @memberOf model.translation
 * @extends {Base}
 */
class SettingsRepository extends DataRepository
{
    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [SettingsLoader] };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.setting/SettingsRepository';
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.SettingsRepository = SettingsRepository;
