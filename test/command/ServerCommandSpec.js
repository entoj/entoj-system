'use strict';

/**
 * Requirements
 */
const ServerCommand = require(ES_SOURCE + '/command/ServerCommand.js').ServerCommand;
const Server = require(ES_SOURCE + '/server/Server.js').Server;
const commandSpec = require(ES_TEST + '/command/CommandShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const Route = require(ES_SOURCE + '/server/route/Route.js').Route;
const request = require('supertest');
const co = require('co');

/**
 * Spec
 */
describe(ServerCommand.className, function() {
    /**
     * Command Test
     */
    commandSpec(ServerCommand, 'command/ServerCommand', prepareParameters);

    // Adds necessary parameters to create a testee
    function prepareParameters(parameters) {
        global.fixtures = projectFixture.createDynamic();
        return [global.fixtures.diContainer];
    }

    /**
     * ServerCommand Test
     */
    beforeEach(function() {
        global.fixtures = projectFixture.createDynamic();
    });

    afterEach(function(done) {
        const promise = co(function*() {
            for (const instance of Server.instances) {
                yield instance.stop();
            }
        });
        promise.then(done);
    });

    describe('#execute', function() {
        it('should start a webserver', function(done) {
            co(function*() {
                const testee = new ServerCommand(global.fixtures.diContainer);
                const server = yield testee.execute({ command: 'server' });
                request(server.express)
                    .get('/')
                    .expect(404, done);
            });
        });

        it('should allow to configure the server port via SystemModuleConfiguration', function() {
            const promise = co(function*() {
                global.fixtures.moduleConfiguration.configuration.set('server.port', 3200);
                const testee = new ServerCommand(global.fixtures.diContainer);
                const server = yield testee.execute({ command: 'server' });
                expect(server.port).to.be.equal(3200);
            });
            return promise;
        });

        it('should allow to configure the server routes via options.routes', function() {
            const promise = co(function*() {
                const routes = [global.fixtures.diContainer.create(Route)];
                const testee = new ServerCommand(global.fixtures.diContainer, routes);
                const server = yield testee.execute({ command: 'server' });
                expect(server.routes).to.have.length(1);
                expect(server.routes[0]).to.be.instanceof(Route);
            });
            return promise;
        });
    });
});
