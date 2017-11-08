'use strict';

/**
 * Requirements
 */
const Server = require(ES_SOURCE + '/server/Server.js').Server;
const Route = require(ES_SOURCE + '/server/route/Route.js').Route;
const CliLogger = require(ES_SOURCE + '/cli/CliLogger.js').CliLogger;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const request = require('supertest');
const sinon = require('sinon');
const express = require('express');


/**
 * Spec
 */
describe(Server.className, function()
{
    /**
     * Base Test
     */
    baseSpec(Server, 'server/Server', function(parameters)
    {
        const cliLogger = new CliLogger('', { muted: true });
        return [cliLogger];
    });


    /**
     * Server Test
     */
    beforeEach(function()
    {
        global.fixtures = {};
        global.fixtures.cliLogger = new CliLogger('', { muted: true });
    });


    // stop a running server after any test
    afterEach(function(done)
    {
        if (global.fixtures.server)
        {
            global.fixtures.server.stop().then(() => done());
        }
        else
        {
            done();
        }
    });

    // Create a initialized testee
    const createTestee = function(routes, options)
    {
        const cliLogger = new CliLogger('', { muted: true });
        return new Server(cliLogger, routes, options);
    };


    describe('#constructor', function()
    {
        it('should per default listen on port 3000 with http2 off', function()
        {
            const testee = createTestee();
            expect(testee.port).to.be.equal(3000);
            expect(testee.http2).to.be.not.ok;
        });

        it('should allow to configure port and http2 via options', function()
        {
            const options =
            {
                port: 443,
                http2: true
            };
            const testee = createTestee(undefined, options);
            expect(testee.port).to.be.equal(443);
            expect(testee.http2).to.be.ok;
        });
    });


    describe('#start', function()
    {
        it('should start a http server', function(done)
        {
            global.fixtures.server = createTestee();
            global.fixtures.server.express.use(express.static(ES_FIXTURES + '/files'));
            global.fixtures.server.start().then(function(server)
            {
                request(server)
                    .get('/js/js-01.js')
                    .expect(200, done);
            });
        });

        it('should start a https server', function(done)
        {
            const options =
            {
                http2: true
            };
            global.fixtures.server = createTestee(undefined, options);
            global.fixtures.server.express.use(express.static(ES_FIXTURES + '/files'));
            global.fixtures.server.start().then(function(server)
            {
                expect(server).to.be.ok;
                done();
            });
        });


        xit('should allow to add http basic auth', function(done)
        {
            const options =
            {
                authentication: true
            };
            global.fixtures.server = createTestee(undefined, options);
            global.fixtures.server.express.use(express.static(ES_FIXTURES + '/files'));
            global.fixtures.server.start().then(function(server)
            {
                request(server)
                    .get('/js/js-01.js')
                    .expect(401, done);
            });
        });
    });


    describe('#addRoute', function()
    {
        it('should allow to add routes that will be registered via route#register', function()
        {
            const testee = createTestee();
            const route = new Route(global.fixtures.cliLogger);
            sinon.spy(route, 'register');
            testee.addRoute(route);
            expect(route.register.calledOnce).to.be.ok;
        });
    });
});
