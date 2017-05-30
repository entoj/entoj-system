'use strict';

/**
 * Requirements
 */
const taskSpec = require(ES_TEST + '/task/TaskShared.js').spec;
const pathes = require(ES_SOURCE + '/utils/pathes.js');
const sinon = require('sinon');
const co = require('co');



/**
 * Shared TransformingTask spec
 */
function spec(type, className, prepareParameters, options)
{
    /**
     * Task Test
     */
    taskSpec(type, className, prepareParameters, options);
    spec.readStream = taskSpec.readStream;
    spec.filesStream = taskSpec.filesStream;


    /**
     * TransformingTask Test
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


    describe('#stream()', function()
    {
        it('should processFile each file in the stream', function()
        {
            const promise = co(function *()
            {
                const testee = createTestee();
                sinon.spy(testee, 'processFile');
                yield taskSpec.feedFiles(testee, pathes.concat(ES_FIXTURES, '/files/**/*.js'));
                expect(testee.processFile.calledTwice).to.be.ok;
            });
            return promise;
        });
    });
}

/**
 * Exports
 */
module.exports.spec = spec;
