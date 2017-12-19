'use strict';

/**
 * Requirements
 * @ignore
 */
const Repository = require('../Repository.js').Repository;
const SettingsLoader = require('./SettingsLoader.js').SettingsLoader;


/**
 * @class
 * @memberOf model.setting
 * @extends {Base}
 */
class SettingsRepository extends Repository
{
    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [SettingsLoader] };
    }


    /**
     * @inheritDocs
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
