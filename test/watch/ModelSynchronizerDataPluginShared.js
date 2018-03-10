'use strict';

/**
 * Requirements
 */
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const co = require('co');
const sinon = require('sinon');


/**
 * Shared ModelSynchronizerDataPlugin spec
 */
function spec(type, className, prepareParameters)
{
    /**
     * Base Test
     */
    baseSpec(type, className, prepareParameters);


    /**
     * ModelSynchronizerTranslationsPlugin Test
     */
    const createTestee = function(fileTemplate)
    {
        let parameters = [];
        if (prepareParameters)
        {
            parameters = prepareParameters(parameters, fileTemplate);
        }
        return new type(...parameters);
    };


    describe('#processChanges', function()
    {
        it('should invalidate the underlying repository when matching files are found', function()
        {
            const promise = co(function *()
            {
                const testee = createTestee('${sites}/${site.name.urlify()}/data.json');
                const input =
                {
                    files: ['/base/data.json']
                };
                const invalidate = sinon.spy(testee.dataRepository, 'invalidate');
                yield testee.execute(input);
                expect(invalidate.calledOnce).to.be.ok;
            });
            return promise;
        });

        it('should not invalidate the underlying repository when no matching files found', function()
        {
            const promise = co(function *()
            {
                const testee = createTestee('${sites}/${site.name.urlify()}/data.json');
                const input =
                {
                    files: ['/base/foo.json']
                };
                const invalidate = sinon.spy(testee.dataRepository, 'invalidate');
                yield testee.execute(input);
                expect(invalidate.calledOnce).to.be.not.ok;
            });
            return promise;
        });
    });
}

/**
 * Exports
 */
module.exports = spec;
module.exports.spec = spec;
