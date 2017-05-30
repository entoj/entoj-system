'use strict';

/**
 * Requirements
 */
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const sinon = require('sinon');
const co = require('co');
const gulp = require('gulp');


/**
 * Shared Task spec
 */
function spec(type, className, prepareParameters, options)
{
    const opts = options || {};

    /**
     * Base Test
     */
    baseSpec(type, className, prepareParameters);


    /**
     * Task Test
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


    /**
     * Reads the given stream and resolves to an array of all chunks
     */
    function readStream(stream)
    {
        const promise = new Promise((resolve) =>
        {
            const data = [];
            stream.on('data', (item) =>
            {
                process.nextTick(() =>
                {
                    data.push(item);
                });
            })
            .on('finish', () =>
            {
                process.nextTick(() =>
                {
                    resolve(data);
                });
            });
        });
        return promise;
    }
    spec.readStream = readStream;


    /**
     * Creates a stream of files
     */
    function filesStream(glob)
    {
        return gulp.src(glob);
    }
    spec.filesStream = filesStream;


    /**
     * Creates a stream of files and waits until they ran through the task
     */
    function feedFiles(task, glob)
    {
        return readStream(task.stream(filesStream(glob)));
    }
    spec.feedFiles = feedFiles;


    describe('#pipe()', function()
    {
        it('should return the piped Task', function()
        {
            const testee = createTestee();
            const pipedTestee = createTestee();
            const result = testee.pipe(pipedTestee);
            expect(result).to.be.equal(pipedTestee);
            return result;
        });

        it('should set previousTask on the piped task', function()
        {
            const testee = createTestee();
            const pipedTestee = createTestee();
            const result = testee.pipe(pipedTestee);
            expect(pipedTestee.previousTask).to.be.equal(testee);
            return result;
        });

        it('should set nextTask on the task', function()
        {
            const testee = createTestee();
            const pipedTestee = createTestee();
            const result = testee.pipe(pipedTestee);
            expect(testee.nextTask).to.be.equal(pipedTestee);
            return result;
        });
    });


    describe('#stream()', function()
    {
        it('should return a stream', function()
        {
            const promise = co(function *()
            {
                const testee = createTestee();
                const result = testee.stream();
                expect(result.pipe).to.be.instanceof(Function); // We want to support through2 here....
                yield readStream(result);
            });
            return promise;
        });
    });


    describe('#run()', function()
    {
        it('should return a promise', function()
        {
            const testee = createTestee();
            const result = testee.run();
            expect(result).to.be.instanceof(Promise);
            return result;
        });

        if (!opts.skipDelegateTest)
        {
            it('should delegate to the root task', function()
            {
                const promise = co(function *()
                {
                    const testee = createTestee();
                    const pipedTestee = createTestee();
                    sinon.spy(testee, 'run');
                    sinon.spy(pipedTestee, 'run');
                    testee.pipe(pipedTestee);
                    yield pipedTestee.run();
                    expect(testee.run.calledOnce).to.be.ok;
                    expect(pipedTestee.run.calledOnce).to.be.ok;
                });
                return promise;
            });
        }
    });

}

/**
 * Exports
 */
module.exports.spec = spec;
