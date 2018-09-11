'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const Context = require('../application/Context.js').Context;
const BaseMap = require('../base/BaseMap.js').BaseMap;
const CliLogger = require('../cli/CliLogger.js').CliLogger;
const assertParameter = require('../utils/assert.js').assertParameter;

/**
 * @memberOf command
 * @extends Base
 */
class Command extends Base {
    /**
     * @param {String} name
     * @param {application.Context} context
     */
    constructor(context) {
        super();

        //Check params
        assertParameter(this, 'context', context, true, Context);

        // Assign options
        this._name = [];
        this._context = context;
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return { parameters: [Context] };
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'command/Command';
    }

    /**
     * @param {object} parameters
     */
    createLogger(prefix) {
        return this.context.di.create(CliLogger, new BaseMap({ 'cli/CliLogger.prefix': prefix }));
    }

    /**
     * The command name(s)
     *
     * @type {Array}
     */
    set name(value) {
        this._name = Array.isArray(value) ? value : [value];
    }

    get name() {
        return this._name;
    }

    /**
     * @type {application.Context}
     */
    get context() {
        return this._context;
    }

    /**
     * Returns a object describing the command and it's parameters
     *
     * @type {Object}
     */
    get help() {
        return { name: this._name };
    }

    /**
     * Dispatches the command action
     *
     * @private
     * @param {String} action
     * @param {Object} parameters
     * @returns {Promise<Boolean>}
     */
    dispatch(action, parameters) {
        return Promise.resolve(true);
    }

    /**
     * Executes the command and resolves to a Boolean
     * indicating if the command did execute.
     *
     * @param {Object} parameters
     * @returns {Promise<Boolean>}
     */
    execute(parameters) {
        if (parameters && this._name.indexOf(parameters.command) > -1) {
            return this.dispatch(parameters.action, parameters);
        }
        return Promise.resolve(false);
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.Command = Command;
