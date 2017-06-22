'use strict';

/**
 * Requirements
 * @ignore
 */
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
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
    baseSpec(type, className, prepareParameters);


    /**
     * Command Test
     */
    const createTestee = function()
    {
        const parameters = prepareParameters();
        return new type(...parameters);
    };


    // Simple properties
    baseSpec.assertProperty(createTestee(), ['context', 'help']);
    baseSpec.assertProperty(createTestee(), ['name'], ['command']);


    describe('#createLogger()', function()
    {
        it('should return a prefixed logger instance', function()
        {
            const testee = createTestee();
            const logger = testee.createLogger('some-prefix');
            expect(logger).to.be.instanceof(CliLogger);
        });
    });


    describe('#dispatch()', function()
    {
        it('should return a promise', function()
        {
            const testee = createTestee();
            const promise = testee.dispatch();
            expect(promise).to.be.instanceof(Promise);
            return promise;
        });
    });


    describe('#execute()', function()
    {
        it('should return a promise', function()
        {
            const testee = createTestee();
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
                const testee = createTestee();
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
                const testee = createTestee();
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
