'use strict';

/**
 * Requirements
 * @ignore
 */
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');


/**
 * Shared Renderer spec
 */
function spec(type, className, prepareParameters, testFixtures, options)
{
    /**
     * Initialize export shared
     */
    const exportShared = require(ES_TEST + '/export/ExportShared.js')(options);


    /**
     * Base Test
     */
    baseSpec(type, className, prepareParameters);


    /**
     * Renderer Test
     */
    beforeEach(function()
    {
        global.fixtures = (options && options.createFixture)
            ? options.createFixture()
            : projectFixture.createStatic();
    });


    // Create testee
    const createTestee = function()
    {
        let parameters = Array.from(arguments);
        if (prepareParameters)
        {
            parameters = prepareParameters(parameters);
        }
        return new type(...parameters);
    };

    // Runs a simple testfixture
    function testFixture(name, nodeRenderers)
    {
        const basePath = (options && options.rootPath)
            ? options.rootPath
            : ES_FIXTURES + '/export/renderer/';
        return exportShared.testFixture(name, nodeRenderers, basePath);
    }
    spec.testFixture = testFixture;


    describe('#renderNode', function()
    {
        it('should return a promise', function()
        {
            const testee = createTestee();
            expect(testee.renderNode()).to.be.instanceof(Promise);
        });
    });

    if (testFixtures)
    {
        describe('#render', function()
        {
            for (const fixtureName in testFixtures)
            {
                it(fixtureName, function()
                {
                    return testFixture(testFixtures[fixtureName]);
                });
            }
        });
    }
}

/**
 * Exports
 */
module.exports.spec = spec;
