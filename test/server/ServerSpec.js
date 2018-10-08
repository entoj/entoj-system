'use strict';

/**
 * Requirements
 */
const Server = require(ES_SOURCE + '/server/Server.js').Server;
const Route = require(ES_SOURCE + '/server/route/Route.js').Route;
const CliLogger = require(ES_SOURCE + '/cli/CliLogger.js').CliLogger;
const GlobalConfiguration = require(ES_SOURCE + '/model/configuration/GlobalConfiguration.js')
    .GlobalConfiguration;
const BuildConfiguration = require(ES_SOURCE + '/model/configuration/BuildConfiguration.js')
    .BuildConfiguration;
const SystemModuleConfiguration = require(ES_SOURCE + '/configuration/SystemModuleConfiguration.js')
    .SystemModuleConfiguration;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const request = require('supertest');
const sinon = require('sinon');
const express = require('express');

/**
 * Spec
 */
describe(Server.className, function() {
    /**
     * Base Test
     */
    baseSpec(Server, 'server/Server', function(parameters) {
        const cliLogger = new CliLogger('', { muted: true });
        const moduleConfiguration = new SystemModuleConfiguration(
            new GlobalConfiguration(),
            new BuildConfiguration()
        );
        return [cliLogger, moduleConfiguration];
    });

    /**
     * Server Test
     */
    beforeEach(function() {
        global.fixtures = {};
        global.fixtures.cliLogger = new CliLogger('', { muted: true });
    });

    // stop a running server after any test
    afterEach(function(done) {
        if (global.fixtures.server) {
            global.fixtures.server.stop().then(() => done());
        } else {
            done();
        }
    });

    // Create a initialized testee
    const createTestee = function(routes, options) {
        const cliLogger = new CliLogger('', { muted: true });
        const moduleConfiguration = new SystemModuleConfiguration(
            new GlobalConfiguration(options),
            new BuildConfiguration()
        );
        return new Server(cliLogger, moduleConfiguration, routes);
    };

    describe('#start', function() {
        it('should start a http server listening on the configured port', function(done) {
            global.fixtures.server = createTestee();
            global.fixtures.server.express.use(express.static(ES_FIXTURES + '/files'));
            global.fixtures.server.start().then(function(server) {
                expect(server.address().port).to.be.equal(
                    global.fixtures.server.moduleConfiguration.serverPort
                );
                request(server)
                    .get('/js/js-01.js')
                    .expect(200, done);
            });
        });

        it('should start a https server', function(done) {
            const options = {
                system: {
                    server: {
                        http2: true
                    }
                }
            };
            global.fixtures.server = createTestee(undefined, options);
            global.fixtures.server.express.use(express.static(ES_FIXTURES + '/files'));
            global.fixtures.server.start().then(function(server) {
                expect(server).to.be.ok;
                done();
            });
        });

        xit('should allow to add http basic auth', function(done) {
            const options = {
                system: {
                    server: {
                        authentication: true
                    }
                }
            };
            global.fixtures.server = createTestee(undefined, options);
            global.fixtures.server.express.use(express.static(ES_FIXTURES + '/files'));
            global.fixtures.server.start().then(function(server) {
                request(server)
                    .get('/js/js-01.js')
                    .expect(401, done);
            });
        });
    });

    describe('#addRoute', function() {
        it('should allow to add routes that will be registered via route#register', function() {
            const testee = createTestee();
            const route = new Route(global.fixtures.cliLogger);
            sinon.spy(route, 'register');
            testee.addRoute(route);
            expect(route.register.calledOnce).to.be.ok;
        });
    });
});
