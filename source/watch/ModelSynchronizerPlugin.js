'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const CliLogger = require('../cli/CliLogger.js').CliLogger;
const assertParameter = require('../utils/assert.js').assertParameter;


/**
 * @memberOf watch
 */
class ModelSynchronizerPlugin extends Base
{
    /**
     * @param {CliLogger} cliLogger
     */
    constructor(cliLogger)
    {
        super();

        //Check params
        assertParameter(this, 'cliLogger', cliLogger, true, CliLogger);

        // Assign options
        this._cliLogger = cliLogger;
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [CliLogger] };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'watch/ModelSynchronizerPlugin';
    }


    /**
     * @type {cli.CliLogger}
     */
    get cliLogger()
    {
        return this._cliLogger;
    }


    /**
     * @returns {Promise.<*>}
     */
    execute(changes)
    {
        return Promise.resolve({});
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.ModelSynchronizerPlugin = ModelSynchronizerPlugin;
