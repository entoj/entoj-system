'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const DIContainer = require('../utils/DIContainer.js').DIContainer;
const BaseMap = require('../base/BaseMap.js').BaseMap;
const CliLogger = require('../cli/CliLogger.js').CliLogger;
const assertParameter = require('../utils/assert.js').assertParameter;

/**
 * @memberOf command
 * @extends Base
 */
class Command extends Base {
    /**
     * @param {utils.DIContainer} diContainer
     */
    constructor(diContainer) {
        super();

        //Check params
        assertParameter(this, 'diContainer', diContainer, true, DIContainer);

        // Assign options
        this._name = [];
        this._diContainer = diContainer;
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return { parameters: [DIContainer] };
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'command/Command';
    }

    /**
     * @type {utils.DIContainer}
     */
    get diContainer() {
        return this._diContainer;
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
     * Returns a object describing the command and it's parameters
     *
     * @type {Object}
     */
    get help() {
        return { name: this._name };
    }

    /**
     * @protected
     * @param {object} parameters
     */
    createLogger(prefix) {
        return this.diContainer.create(CliLogger, new BaseMap({ 'cli/CliLogger.prefix': prefix }));
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
        if (parameters && this.name.indexOf(parameters.command) > -1) {
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
