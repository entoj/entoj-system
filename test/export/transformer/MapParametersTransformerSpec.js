'use strict';

/**
 * Requirements
 */
const MapParametersTransformer = require(ES_SOURCE +
    '/export/transformer/MapParametersTransformer.js').MapParametersTransformer;
const nodeTransformerSpec = require(ES_TEST + '/export/transformer/NodeTransformerShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const co = require('co');

/**
 * Spec
 */
describe(MapParametersTransformer.className, function() {
    /**
     * NodeTransformer Test
     */
    const options = {
        basePath: ES_FIXTURES + '/export/transformer'
    };
    const exportHelper = require(ES_TEST + '/export/ExportHelper.js')(options);
    nodeTransformerSpec(
        MapParametersTransformer,
        'export.transformer/MapParametersTransformer',
        undefined,
        undefined,
        options
    );

    /**
     * MapParametersTransformer Test
     */
    beforeEach(function() {
        global.fixtures = projectFixture.createDynamic();
    });

    describe('#transform()', function() {
        it('should rename all mapped parameters', function() {
            const promise = co(function*() {
                const settings = {
                    parameters: {
                        type: {
                            name: 'renamed_type'
                        }
                    }
                };
                const testee = new MapParametersTransformer();
                const configuration = yield exportHelper.createConfiguration(
                    'base/modules/m-teaser',
                    'm_teaser',
                    settings
                );
                const node = yield exportHelper.loadInputFixture(
                    'MapParametersTransformer.input.j2',
                    'ast'
                );
                const transformedNode = yield testee.transform(node, configuration);
                return exportHelper.testNodeFixture('MapParametersTransformer', transformedNode);
            });
            return promise;
        });
    });
});
