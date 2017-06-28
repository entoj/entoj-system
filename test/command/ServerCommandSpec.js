'use strict';

/**
 * Requirements
 */
const ServerCommand = require(ES_SOURCE + '/command/ServerCommand.js').ServerCommand;
const Server = require(ES_SOURCE + '/server/Server.js').Server;
const commandSpec = require(ES_TEST + '/command/CommandShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const Route = require(ES_SOURCE + '/server/route/Route.js').Route;
const Context = require(ES_SOURCE + '/application/Context.js').Context;
const request = require('supertest');
const co = require('co');


/**
 * Spec
 */
describe(ServerCommand.className, function()
{
    /**
     * Command Test
     */
    commandSpec(ServerCommand, 'command/ServerCommand', prepareParameters);

    // Adds necessary parameters to create a testee
    function prepareParameters(parameters)
    {
        global.fixtures = projectFixture.createDynamic();
        return [global.fixtures.context];
    }


    /**
     * ServerCommand Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createDynamic();
    });


    afterEach(function(done)
    {
        const promise = co(function*()
        {
            for (const instance of Server.instances)
            {
                yield instance.stop();
            }
        });
        promise.then(done);
    });


    describe('#execute', function()
    {
        it('should start a webserver', function(done)
        {
            co(function*()
            {
                const testee = new ServerCommand(global.fixtures.context);
                const server = yield testee.execute({ command: 'server' });
                request(server.express)
                    .get('/')
                    .expect(404, done);
            });
        });

        it('should allow to configure the server port via options.port', function()
        {
            const promise = co(function*()
            {
                const options =
                {
                    port: 3200
                };
                const testee = new ServerCommand(global.fixtures.context, options);
                const server = yield testee.execute({ command: 'server' })
                expect(server.port).to.be.equal(options.port);
            });
            return promise;
        });

        it('should allow to configure the server routes via options.routes', function()
        {
            const promise = co(function*()
            {
                const options =
                {
                    routes:
                    [
                        {
                            type: Route
                        }
                    ]
                };
                const testee = new ServerCommand(global.fixtures.context, options);
                const server = yield testee.execute({ command: 'server' })
                expect(server.routes).to.have.length(1);
                expect(server.routes[0]).to.be.instanceof(Route);
            });
            return promise;
        });
    });
});
