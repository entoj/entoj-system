'use strict';

/**
 * Requirements
 * @ignore
 */
const Command = require('./Command.js').Command;
const Server = require('../server/Server.js').Server;
const Context = require('../application/Context.js').Context;
const CliLogger = require('../cli/CliLogger.js').CliLogger;
const ModelSynchronizer = require('../watch/ModelSynchronizer.js').ModelSynchronizer;
const ErrorHandler = require('../error/ErrorHandler.js').ErrorHandler;
const co = require('co');


/**
 * @memberOf command
 */
class ServerCommand extends Command
{
    /**
     * @param {application.Context} context
     * @param {Object} options
     */
    constructor(context, options)
    {
        super(context);

        this._name = 'server';
        this._options = options || {};
        this._server = false;
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [Context, 'command/ServerCommand.options'] };
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'command/ServerCommand';
    }


    /**
     * @type {server.Server}
     */
    get server()
    {
        return this._server;
    }


    /**
     * @type {Object}
     */
    get options()
    {
        return this._options;
    }


    /**
     * @inheritDocs
     */
    get help()
    {
        const help =
        {
            name: this._name,
            description: 'Provides the development server',
            actions:
            [
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
     * @returns {Promise<server.Server>}
     */
    start(parameters)
    {
        const scope = this;
        const promise = co(function*()
        {
            if (!scope.server)
            {
                const logger = scope.createLogger('command.server');

                // prepare routes
                const configure = logger.section('Configuring routes');
                const routes = [];
                if (Array.isArray(scope.options.routes))
                {
                    for (const route of scope.options.routes)
                    {
                        const work = logger.work('Configuring route <' + route.type.className + '>');
                        const type = route.type;
                        const mappings = new Map();
                        for (const key in route)
                        {
                            if (key !== 'type')
                            {
                                mappings.set(type.className + '.' + key, route[key]);
                            }
                        }
                        mappings.set(CliLogger, logger);
                        const routeInstance = scope.context.di.create(type, mappings);
                        if (!routeInstance)
                        {
                            throw new Error('Could not get instance of ' + type.className);
                        }
                        routes.push(routeInstance);
                        logger.end(work);
                    }
                }
                logger.end(configure);

                // create server
                const start = logger.section('Starting server');
                try
                {
                    scope._server = new Server(logger, routes, scope.options);
                }
                catch(error)
                {
                    ErrorHandler.error(scope, error);
                    logger.end(start, true);
                }

                // start server
                yield scope.server.start();

                // start synchronizer
                const modelSynchronizer = scope.context.di.create(ModelSynchronizer);
                yield modelSynchronizer.start()

                // Done
                logger.end(start);
            }

            return scope.server;
        }).catch(ErrorHandler.handler(scope));
        return promise;
    }


    /**
     * @inheritDocs
     * @returns {Promise<Server>}
     */
    dispatch(action, parameters)
    {
        return this.start();
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.ServerCommand = ServerCommand;
