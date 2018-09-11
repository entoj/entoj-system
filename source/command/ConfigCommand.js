'use strict';

/**
 * Requirements
 * @ignore
 */
const Command = require('./Command.js').Command;
const GlobalRepository = require('../model/GlobalRepository.js').GlobalRepository;
const Context = require('../application/Context.js').Context;
const ContentKind = require('../model/ContentKind.js').ContentKind;
const PathesConfiguration = require('../model/configuration/PathesConfiguration.js')
    .PathesConfiguration;
const ErrorHandler = require('../error/ErrorHandler.js').ErrorHandler;
const CliLogger = require('../cli/CliLogger.js').CliLogger;
const co = require('co');
const fs = require('co-fs-extra');

/**
 *
 *
 * @memberOf command
 */
class ConfigCommand extends Command {
    /**
     * @param {application.Context} context
     */
    constructor(context) {
        super(context);

        // Assign options
        this._name = ['config'];
        this._loggerPrefix = 'command.config';
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
        return 'command/ConfigCommand';
    }

    /**
     * @inheritDoc
     */
    get help() {
        const help = {
            name: this._name,
            description: 'Adds configurations to entitites',
            actions: [
                {
                    name: 'export',
                    description: 'Adds export configs',
                    options: [
                        {
                            name: 'exporter',
                            type: 'inline',
                            value: '',
                            optional: false,
                            defaultValue: '',
                            description: 'The exporter to configure'
                        },
                        {
                            name: 'operation',
                            type: 'inline',
                            value: '',
                            optional: false,
                            defaultValue: '',
                            description: 'The operation on the configuration file [add|remove]'
                        },
                        {
                            name: 'query',
                            type: 'inline',
                            optional: true,
                            defaultValue: '*',
                            description: 'Query for entities to use e.g. /base'
                        }
                    ]
                }
            ]
        };
        return help;
    }

    /**
     * @type {String}
     */
    get loggerPrefix() {
        return this._loggerPrefix;
    }

    /**
     * entoj config export add twig
     *
     * @returns {Promise}
     */
    configureExport(parameters) {
        const scope = this;
        const promise = co(function*() {
            const logger = scope.createLogger(scope.loggerPrefix + '.export');

            // Check
            if (!parameters || parameters._.length < 2) {
                logger.error('Missing parameters operation or export!');
                return false;
            }

            // Prepare
            const exportName = parameters._[0];
            const operation = parameters._[1];
            const query = parameters._[2] || '*';

            // Go
            const section = logger.section('Proccesing export config for <' + query + '>');
            const mapping = new Map();
            mapping.set(CliLogger, logger);
            const pathesConfiguration = scope.context.di.create(PathesConfiguration);
            const globalRepository = scope.context.di.create(GlobalRepository);
            const entities = yield globalRepository.resolveEntities(query);
            for (const entity of entities) {
                const work = logger.work('Processing config for <' + entity.pathString + '>');

                // Read
                const settingsFile = yield pathesConfiguration.resolveEntityForSite(
                    entity,
                    entity.id.site,
                    '/entity.json'
                );
                const settingsFileExists = yield fs.exists(settingsFile);
                let settings = {};
                if (settingsFileExists) {
                    settings = JSON.parse(yield fs.readFile(settingsFile, { encoding: 'utf8' }));
                }
                settings.export = settings.export || {};
                settings.export[exportName] = settings.export[exportName] || [];

                // Modify
                if (operation == 'add') {
                    if (!settings.export[exportName].length) {
                        logger.info('Adding export to <' + entity.pathString + '>');
                        settings.export[exportName].push({});
                    }
                } else if (operation == 'macro') {
                    const macros = entity.documentation.getByContentKind(ContentKind.MACRO);
                    for (const macro of macros) {
                        const config = settings.export[exportName].find(
                            (item) => item.macro == macro.name
                        );
                        if (!config) {
                            logger.info(
                                'Adding macro <' +
                                    macro.name +
                                    '> export to <' +
                                    entity.pathString +
                                    '>'
                            );
                            settings.export[exportName].push({ macro: macro.name });
                        }
                    }
                } else {
                    if (settingsFileExists) {
                        logger.info('Removing export from <' + entity.pathString + '>');
                        delete settings.export[exportName];
                        if (Object.keys(settings.export).length == 0) {
                            delete settings.export;
                        }
                    } else {
                        settings = false;
                    }
                }

                // Write
                if (settings) {
                    yield fs.outputJson(settingsFile, settings);
                }
                logger.end(work);
            }
            logger.end(section);
            return true;
        }).catch(ErrorHandler.handler(scope));
        return promise;
    }

    /**
     * @inheritDoc
     */
    dispatch(action, parameters) {
        switch ((action || '').toLowerCase()) {
            case 'export':
                return this.configureExport(parameters);
        }
        return Promise.resolve(false);
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.ConfigCommand = ConfigCommand;
