'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const CliLogger = require('../cli/CliLogger.js').CliLogger;
const assertParameter = require('../utils/assert.js').assertParameter;
const EventEmitter = require('events').EventEmitter;
const ipc = require('node-ipc');
const co = require('co');


/**
 * Communication between multiple running entoj commands
 *
 * @memberOf application
 * @extends Base
 */
class Communication extends Base
{
    /**
     * @param {Context} context
     */
    constructor(cliLogger, id)
    {
        super();

        //Check params
        assertParameter(this, 'cliLogger', cliLogger, true, CliLogger);

        // Add initial values
        this._id = id || 'entoj';
        this._cliLogger = cliLogger.createPrefixed('application.communication');
        this._connection = false;

        // ipc config
        ipc.config.id = this._id;
        ipc.config.silent = true;
        ipc.config.retry = 1500;
        ipc.config.maxRetries = 10;
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        /* istanbul ignore next */
        return { 'parameters': [CliLogger, 'application/Communication.id'] };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'application/Communication';
    }


    /**
     * @type {Context}
     */
    get cliLogger()
    {
        return this._cliLogger;
    }


    /**
     * @type {String}
     */
    get id()
    {
        return this._id;
    }


    /**
     * @returns {EventEmitter}
     */
    get events()
    {
        if (!this._events)
        {
            this._events = new EventEmitter(this);
        }
        return this._events;
    }


    /**
     * Disconnect all ipc things (client & server)
     *
     * @returns {Promise<connection>}
     */
    disconnect()
    {
        if (this._connection)
        {
            ipc.disconnect(this.id);
        }
        if (ipc.server)
        {
            ipc.server.stop();
        }
        return Promise.resolve();
    }


    /**
     * Connect to the server
     *
     * @returns {Promise<connection>}
     */
    connect()
    {
        if (this._connection)
        {
            return Promise.resolve(this._connection);
        }
        const promise = new Promise((resolve) =>
        {
            ipc.connectTo(this.id, () =>
            {
                this._connection = ipc.of[this.id];
                this._connection.on('connect', () =>
                {
                    this.cliLogger.info('Connected to server');
                    resolve(this._connection);
                });
                this._connection.on('disconnect', () =>
                {
                    this._connection = false;
                });
                this._connection.on('message', (data, socket) =>
                {
                    this.cliLogger.info('Received command <' + data.command + '>');
                    this.events.emit(data.command, data.data);
                });
            });
        });
        return promise;
    }


    /**
     * Sends a message to the server
     *
     * @returns {Promise}
     */
    send(command, data)
    {
        const scope = this;
        const promise = co(function*()
        {
            scope.cliLogger.info('Sending command <' + command + '>');
            if (ipc.server)
            {
                ipc.server.broadcast('message', { command: command, data: data || false });
            }
            else
            {
                const connection = yield scope.connect();
                connection.emit('message', { command: command, data: data || false });
            }
            return true;
        });
        return promise;
    }


    /**
     * Waits for the command to arrive
     *
     * @returns {Promise}
     */
    waitFor(command, timeout)
    {
        const promise = new Promise((resolve, reject) =>
        {
            const timer = setTimeout(()  =>
            {
                clearTimeout(timer);
                this.events.removeListener(command, handler);
                reject();
            }, timeout || 1000);
            const handler = (data) =>
            {
                clearTimeout(timer);
                this.events.removeListener(command, handler);
                resolve(data);
            };
            this.events.on(command, handler);
        });
        return promise;
    }


    /**
     * Starts the ipc server
     *
     * @returns {Promise}
     */
    serve()
    {
        ipc.serve(() =>
        {
            ipc.server.on('message', (data, socket) =>
            {
                this.cliLogger.info('Broadcasting command <' + data.command + '>');
                this.events.emit(data.command, data.data);
                ipc.server.broadcast('message', data);
            });
        });
        ipc.server.start();

        return Promise.resolve();
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.Communication = Communication;
