'use strict';

/**
 * Requirements
 * @ignore
 */
const Command = require('./Command.js').Command;
const Server = require('../server/Server.js').Server;
const DIContainer = require('../utils/DIContainer.js').DIContainer;
const SystemModuleConfiguration = require('../configuration/SystemModuleConfiguration.js')
    .SystemModuleConfiguration;
const Communication = require('../application/Communication.js').Communication;
const ModelSynchronizer = require('../watch/ModelSynchronizer.js').ModelSynchronizer;
const EntitiesRepository = require('../model/entity/EntitiesRepository.js').EntitiesRepository;
const ErrorHandler = require('../error/ErrorHandler.js').ErrorHandler;
const co = require('co');

/**
 * @memberOf command
 */
class ServerCommand extends Command {
    /**
     * @param {utils.DIContainer} diContainer
     * @param {Array} routes
     */
    constructor(diContainer, routes) {
        super(diContainer);

        this._name = 'server';
        this._routes = routes || [];
        this._server = false;
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return {
            parameters: [DIContainer, 'command/ServerCommand.routes'],
            modes: [false, 'instance']
        };
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'command/ServerCommand';
    }

    /**
     * @type {server.Server}
     */
    get server() {
        return this._server;
    }

    /**
     * @type {Object}
     */
    get routes() {
        return this._routes;
    }

    /**
     * @inheritDoc
     */
    get help() {
        const help = {
            name: this._name,
            description: 'Provides the development server',
            actions: [
                {
                    name: 'start',
                    options: [],
                    description: 'Start the server'
                }
            ]
        };
        return help;
    }

    /**
     * @inheritDoc
     */
    importLinterResults(lintResults) {
        if (!lintResults) {
            return;
        }
        const scope = this;
        co(function*() {
            const entityRepository = scope.diContainer.create(EntitiesRepository);
            for (const lintResult of lintResults) {
                const entityAspect = yield entityRepository.getById(lintResult.entity);
                if (entityAspect && entityAspect.entity) {
                    lintResult.site = entityAspect.id.site;
                    entityAspect.entity.lintResults.import(lintResult);
                }
            }
        });
    }

    /**
     * @returns {Promise<server.Server>}
     */
    start(parameters) {
        const scope = this;
        const promise = co(function*() {
            if (!scope.server) {
                const logger = scope.createLogger('command.server');

                // Create moduleConfiguration
                const moduleConfiguration = scope.diContainer.create(SystemModuleConfiguration);

                // Start ipc communication
                logger.info('Starting IPC server');
                const com = scope.diContainer.create(Communication);
                com.events.on('find-server', () => {
                    if (scope.server && scope.server.baseUrl) {
                        com.send('found-server', scope.server.baseUrl);
                    }
                });
                com.events.on('lint-results', (data) => {
                    scope.importLinterResults(data);
                });
                com.serve();

                // prepare routes
                const configure = logger.section('Configuring routes');
                const routes = [];
                for (const route of scope.routes) {
                    const work = logger.work('Configuring route <' + route.className + '>');
                    route.cliLogger = logger;
                    routes.push(route);
                    logger.end(work);
                }
                logger.end(configure);

                // create server
                const start = logger.section('Starting server');
                try {
                    const options = {
                        port: moduleConfiguration.serverPort,
                        http2: moduleConfiguration.serverHttp2,
                        sslKey: moduleConfiguration.serverSslKey,
                        sslCert: moduleConfiguration.serverSslCert,
                        authentication: moduleConfiguration.serverAuthentication,
                        user: moduleConfiguration.serverUser,
                        password: moduleConfiguration.serverPassword
                    };
                    scope._server = new Server(logger, routes, options);
                } catch (error) {
                    ErrorHandler.error(scope, error);
                    logger.end(start, true);
                }

                // start server
                yield scope.server.start();

                // start synchronizer
                const modelSynchronizer = scope.diContainer.create(ModelSynchronizer);
                yield modelSynchronizer.start();

                // Done
                logger.end(start);
            }

            return scope.server;
        }).catch(ErrorHandler.handler(scope));
        return promise;
    }

    /**
     * @inheritDoc
     * @returns {Promise<Server>}
     */
    dispatch(action, parameters) {
        return this.start();
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.ServerCommand = ServerCommand;
