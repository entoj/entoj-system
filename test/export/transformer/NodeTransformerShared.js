'use strict';

/**
 * Requirements
 */
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const co = require('co');

/**
 * Shared NodeTransformer spec
 */
function spec(type, className, prepareParameters, testFixtures, options) {
    // Initialize helpers
    const exportHelper = require(ES_TEST + '/export/ExportHelper.js')(options);

    /**
     * Base Test
     */
    baseSpec(type, className, prepareParameters);

    /**
     * Transformer Test
     */
    function createTestee(classType, prepareParameters, ...params) {
        let parameters = Array.from(params);
        if (prepareParameters) {
            parameters = prepareParameters(parameters);
        }
        const t = classType || type;
        return new t(...parameters);
    }

    // Loads a fixture and compares the transformed result to the expected
    function testFixture(name, configuration) {
        const promise = co(function*() {
            const testee = createTestee(type, prepareParameters);
            const fixtureName = name || testee.className.split('/').pop();
            const node = yield exportHelper.loadInputFixture(fixtureName + '.input.j2', 'ast');
            const transformedNode = yield testee.transform(node, configuration);
            return exportHelper.testNodeFixture(fixtureName, transformedNode);
        });
        return promise;
    }
    spec.testFixture = testFixture;

    describe('#transform()', function() {
        it('should return a promise', function() {
            const testee = createTestee(type, prepareParameters);
            const promise = testee.transform();
            expect(promise).to.be.instanceof(Promise);
            return promise;
        });

        if (testFixtures) {
            for (const fixtureName in testFixtures) {
                it(fixtureName, function() {
                    return testFixture(testFixtures[fixtureName]);
                });
            }
        }
    });
}

/**
 * Exports
 */
module.exports.spec = spec;
