'use strict';

/**
 * Requirements
 */
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const exportHelper = require(ES_TEST + '/export/ExportHelper.js')();
const co = require('co');


/**
 * Shared NodeTransformer spec
 */
function spec(type, className, prepareParameters)
{
    /**
     * Base Test
     */
    baseSpec(type, className, prepareParameters);


    /**
     * Transformer Test
     */
    function createTestee(classType, prepareParameters, ...params)
    {
        let parameters = Array.from(params);
        if (prepareParameters)
        {
            parameters = prepareParameters(parameters);
        }
        const t = classType || type;
        return new t(...parameters);
    }


    describe('#transform()', function()
    {
        it('should return a promise', function()
        {
            const testee = createTestee(type, prepareParameters);
            const promise = testee.transform();
            expect(promise).to.be.instanceof(Promise);
            return promise;
        });

        it('should visit all nodes and clone them', function()
        {
            const promise = co(function *()
            {
                const node = yield exportHelper.loadFixture('/export/transformer/NodeTransformer.input.j2', 'ast');
                const testee = createTestee(type, prepareParameters);
                const transformed = yield testee.transform(node);

                // Shoud be new objects
                expect(transformed).to.be.not.deep.equal(node);

                // Shoud have the same structure
                expect(transformed.serialize()).to.be.deep.equal(node.serialize());
            });
            return promise;
        });
    });
}


/**
 * Loads a fixture and compares the transformed result to the expected
 */
function testFixture(testee, configuration, name)
{
    const promise = co(function *()
    {
        const fixtureName = name || testee.className.split('/').pop();
        const filename = '/export/transformer/' + fixtureName + '.input.j2';
        const node = yield exportHelper.loadFixture(filename, 'ast');
        const transformedNode = yield testee.transform(node, configuration);
        return exportHelper.testNodeFixture(fixtureName, transformedNode);
    });
    return promise;
}
spec.testFixture = testFixture;


/**
 * Exports
 */
module.exports.spec = spec;
