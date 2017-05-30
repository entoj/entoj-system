'use strict';

/**
 * Requirements
 * @ignore
 */
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const Context = require(ES_SOURCE + '/application/Context.js').Context;
const CliLogger = require(ES_SOURCE + '/cli/CliLogger.js').CliLogger;
const co = require('co');
const sinon = require('sinon');


/**
 * Shared Command spec
 */
function spec(type, className, prepareParameters)
{
    /**
     * Base Test
     */
    baseSpec(type, className, (parameters) =>
    {
        parameters.unshift(global.fixtures.context);
        return parameters;
    });


    /**
     * Command Test
     */
    const createTestee = function()
    {
        let parameters = Array.from(arguments);
        if (prepareParameters)
        {
            parameters = prepareParameters(parameters);
        }
        return new type(...parameters);
    };

    beforeEach(function()
    {
        global.fixtures.context = new Context();
    });


    // Simple properties
    baseSpec.assertProperty(createTestee(new Context()), ['context', 'help']);
    baseSpec.assertProperty(createTestee(new Context()), ['name'], ['command']);


    describe('#createLogger()', function()
    {
        it('should return a prefixed logger instance', function()
        {
            const testee = createTestee(global.fixtures.context);
            const logger = testee.createLogger('some-prefix');
            expect(logger).to.be.instanceof(CliLogger);
        });
    });


    describe('#dispatch()', function()
    {
        it('should return a promise', function()
        {
            const testee = createTestee(global.fixtures.context);
            const promise = testee.dispatch();
            expect(promise).to.be.instanceof(Promise);
            return promise;
        });
    });


    describe('#execute()', function()
    {
        it('should return a promise', function()
        {
            const testee = createTestee(global.fixtures.context);
            const promise = testee.execute();
            expect(promise).to.be.instanceof(Promise);
            return promise;
        });

        it('should dispatch when the command name matches', function()
        {
            const promise = co(function*()
            {
                const parameters =
                {
                    command: 'command',
                    action: 'action'
                };
                const testee = createTestee(global.fixtures.context);
                testee.name = 'command';
                sinon.spy(testee, 'dispatch');
                yield testee.execute(parameters);
                expect(testee.dispatch.calledOnce).to.be.ok;
            });
            return promise;
        });

        it('should allow multiple command names', function()
        {
            const promise = co(function*()
            {
                const testee = createTestee(global.fixtures.context);
                testee.name = ['command', 'foo'];
                sinon.spy(testee, 'dispatch');
                yield testee.execute({ command: 'command' });
                yield testee.execute({ command: 'foo' });
                expect(testee.dispatch.calledTwice).to.be.ok;
            });
            return promise;
        });
    });
}

/**
 * Exports
 */
module.exports.spec = spec;
