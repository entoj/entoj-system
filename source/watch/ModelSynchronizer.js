'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const ErrorHandler = require('../error/ErrorHandler.js').ErrorHandler;
const CliLogger = require('../cli/CliLogger.js').CliLogger;
const FileWatcher = require('./FileWatcher.js').FileWatcher;
const assertParameter = require('../utils/assert.js').assertParameter;
const co = require('co');
const signals = require('signals');
const merge = require('lodash.merge');

/**
 * @memberOf watch
 */
class ModelSynchronizer extends Base {
    /**
     * @param {CliLogger} cliLogger
     * @param {watch.FileWatcher} fileWatcher
     * @param {Array} plugins
     */
    constructor(cliLogger, fileWatcher, plugins) {
        super();

        //Check params
        assertParameter(this, 'cliLogger', cliLogger, true, CliLogger);
        assertParameter(this, 'fileWatcher', fileWatcher, true, FileWatcher);

        // Assign options
        this._cliLogger = cliLogger.createPrefixed('modelsynchronizer');
        this._fileWatcher = fileWatcher;
        this._plugins = Array.isArray(plugins) ? plugins : [];
        this._signals = {};

        // Add signals
        this.signals.invalidated = new signals.Signal();

        // Add listeners
        this._fileWatcherListener = (watcher, changes) => this.processChanges(changes);
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return {
            parameters: [CliLogger, FileWatcher, 'watch/ModelSynchronizer.plugins'],
            modes: [false, false, 'instance']
        };
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'watch/ModelSynchronizer';
    }

    /**
     * @inheritDoc
     */
    get signals() {
        return this._signals;
    }

    /**
     * @type {Array}
     */
    get plugins() {
        return this._plugins;
    }

    /**
     * @type {cli.CliLogger}
     */
    get cliLogger() {
        return this._cliLogger;
    }

    /**
     * @returns {Promise.<*>}
     */
    processChanges(changes) {
        const scope = this;
        const promise = co(function*() {
            // Prepare result
            let result = {
                files: changes.files,
                extensions: changes.extensions
            };

            // Run plugins
            for (const plugin of scope.plugins) {
                if (!result.consumed) {
                    const pluginResult = yield plugin.execute(changes);
                    result = merge(result, pluginResult);
                }
            }

            // dispatch signal
            scope.signals.invalidated.dispatch(scope, result);

            return result;
        }).catch(ErrorHandler.handler(scope));
        return promise;
    }

    /**
     * @returns {Promise.<*>}
     */
    start() {
        this._fileWatcher.signals.changed.add(this._fileWatcherListener);
        return this._fileWatcher.start();
    }

    /**
     * @returns {Promise.<*>}
     */
    stop() {
        this._fileWatcher.signals.changed.remove(this._fileWatcherListener);
        return this._fileWatcher.stop();
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.ModelSynchronizer = ModelSynchronizer;
