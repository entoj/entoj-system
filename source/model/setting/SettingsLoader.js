'use strict';

/**
 * Requirements
 * @ignore
 */
const Loader = require('../Loader.js').Loader;
const PathesConfiguration = require('../configuration/PathesConfiguration.js').PathesConfiguration;
const Setting = require('./Setting.js').Setting;
const ErrorHandler = require('../../error/ErrorHandler.js').ErrorHandler;
const assertParameter = require('../../utils/assert.js').assertParameter;
const co = require('co');
const fs = require('co-fs-extra');


/**
 * @class
 * @memberOf mode.setting
 * @extends {model.Loader}
 */
class SettingsLoader extends Loader
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
        return { 'parameters': [PathesConfiguration, 'model.setting/SettingsLoader.filename'] };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.setting/SettingsLoader';
    }


    /**
     * @inheritDoc
     */
    get pathesConfiguration()
    {
        return this._pathesConfiguration;
    }


    /**
     * Loads all settings
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
                    const settings = JSON.parse(yield fs.readFile(filename));
                    for (const setting in settings)
                    {
                        result.push(new Setting({ name: setting, value: settings[setting] }));
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
module.exports.SettingsLoader = SettingsLoader;
