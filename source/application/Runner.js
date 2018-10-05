'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const DIContainer = require('../utils/DIContainer.js').DIContainer;
const CliLogger = require('../cli/CliLogger.js').CliLogger;
const SystemModuleConfiguration = require('../configuration/SystemModuleConfiguration.js')
    .SystemModuleConfiguration;
const PathesConfiguration = require('../model/configuration/PathesConfiguration.js')
    .PathesConfiguration;
const assertParameter = require('../utils/assert.js').assertParameter;
const metrics = require('../utils/performance.js').metrics;
const co = require('co');
const chalk = require('chalk');

/**
 * The runner is the main cli interface to entoj.
 * It will parse any requests and hand them over to the appropriate command(s).
 *
 * @memberOf application
 * @extends Base
 */
class Runner extends Base {
    /**
     * @param {utils.DIContainer} diContainer
     * @param {cli.CliLogger} cliLogger
     * @param {Array} commands
     */
    constructor(diContainer, cliLogger, commands) {
        super();

        //Check params
        assertParameter(this, 'diContainer', diContainer, true, DIContainer);
        assertParameter(this, 'cliLogger', cliLogger, true, CliLogger);

        // Add initial values
        this._diContainer = diContainer;
        this._cliLogger = cliLogger;
        this._commands = [];

        // Create commands
        if (Array.isArray(commands)) {
            for (const command of commands) {
                this._commands.push(
                    this.diContainer.create(typeof command === 'function' ? command : command.type)
                );
            }
        }
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        /* istanbul ignore next */
        return { parameters: [DIContainer, CliLogger, 'application/Runner.commands'] };
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'application/Runner';
    }

    /**
     * @type {utils.DIContainer}
     */
    get diContainer() {
        return this._diContainer;
    }

    /**
     * @type {cli.CliLogger}
     */
    get cliLogger() {
        return this._cliLogger;
    }

    /**
     * @type {array}
     */
    get commands() {
        return this._commands;
    }

    /* istanbul ignore next */
    /**
     * @returns {Promise}
     */
    help() {
        this.cliLogger.info('Usage:');
        this.cliLogger.info('  entoj command [action] [options]');
        this.cliLogger.info('');
        this.cliLogger.info('Options:');
        this.cliLogger.info('  --environment=[development]');
        this.cliLogger.info('    Use the build settings from the given environment');
        this.cliLogger.info('');
        this.cliLogger.info('Commands:');

        const data = [];
        let isFirstCommand = true;
        for (const command of this._commands) {
            if (!isFirstCommand) {
                data.push({});
            }
            isFirstCommand = false;

            data.push({
                command: String.fromCharCode(6) + '    ' + command.help.name,
                description: chalk.white(command.help.description)
            });

            let isFirstAction = true;
            if (command.help.actions && command.help.actions.length) {
                for (const action of command.help.actions) {
                    if (!isFirstAction) {
                        data.push({});
                    }
                    isFirstAction = false;

                    let parameters = '';
                    if (action.options) {
                        for (const option of action.options) {
                            if (option.optional) {
                                parameters += chalk.dim('[');
                            }
                            if (option.type == 'named') {
                                parameters += chalk.yellow('--');
                            }
                            parameters += chalk.yellow(option.name);
                            if (option.defaultValue || option.value) {
                                parameters += chalk.yellow(
                                    '=' + (option.defaultValue || option.value)
                                );
                            }
                            if (option.optional) {
                                parameters += chalk.dim(']');
                            }
                            parameters += ' ';
                        }
                    }

                    data.push({
                        command: String.fromCharCode(6) + '      ' + action.name + ' ' + parameters,
                        description: chalk.white(action.description)
                    });

                    if (action.options) {
                        for (const option of action.options) {
                            let command = String.fromCharCode(6) + '        ';
                            if (option.type == 'named') {
                                command += chalk.yellow('--');
                            }
                            command += chalk.yellow(option.name);
                            data.push({
                                command: command,
                                description: chalk.white(option.description)
                            });
                        }
                    }
                }
            }
        }
        this.cliLogger.table(data);
    }

    /**
     * @returns {Promise}
     */
    run() {
        const scope = this;
        metrics.start(scope.className + '::run');
        let handled = false;
        const moduleConfiguration = this.diContainer.create(SystemModuleConfiguration);
        moduleConfiguration.cliArguments.command = moduleConfiguration.cliArguments._.length
            ? moduleConfiguration.cliArguments._.shift()
            : false;
        moduleConfiguration.cliArguments.action = moduleConfiguration.cliArguments._.length
            ? moduleConfiguration.cliArguments._.shift()
            : false;
        const promise = co(function*() {
            for (const command of scope._commands) {
                const result = yield command.execute(moduleConfiguration.cliArguments);
                if (result !== false) {
                    handled = true;
                }
            }
            if (!handled) {
                scope.cliLogger.error('No command handled request');
                scope.help();
            }
            metrics.stop(scope.className + '::run');
            if (typeof moduleConfiguration.cliArguments.performance != 'undefined') {
                let patterns = undefined;
                if (typeof moduleConfiguration.cliArguments.performance == 'string') {
                    patterns = moduleConfiguration.cliArguments.performance.split(',');
                }
                metrics.show(patterns);

                const pathesConfiguration = scope.diContainer.create(PathesConfiguration);
                const performanceLabel = moduleConfiguration.cliArguments.performanceLabel || '';
                const filename = yield pathesConfiguration.resolveCache(
                    '/metrics/performance-' + performanceLabel.urlify() + '-' + Date.now() + '.json'
                );
                metrics.save(filename, performanceLabel);
            }
            return true;
        }).catch(function(error) {
            metrics.stop(scope.className + '::run');
            scope.cliLogger.error(error);
        });
        return promise;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.Runner = Runner;
