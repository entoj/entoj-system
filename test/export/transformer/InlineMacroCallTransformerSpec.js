'use strict';

/**
 * Requirements
 */
const InlineMacroCallTransformer = require(ES_SOURCE +
    '/export/transformer/InlineMacroCallTransformer.js').InlineMacroCallTransformer;
const nodeTransformerSpec = require(ES_TEST + '/export/transformer/NodeTransformerShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const co = require('co');

/**
 * Spec
 */
describe(InlineMacroCallTransformer.className, function() {
    /**
     * NodeTransformer Test
     */
    const options = {
        basePath: ES_FIXTURES + '/export/transformer'
    };
    const exportHelper = require(ES_TEST + '/export/ExportHelper.js')(options);
    nodeTransformerSpec(
        InlineMacroCallTransformer,
        'export.transformer/InlineMacroCallTransformer',
        undefined,
        undefined,
        options
    );

    /**
     * InlineMacroCallTransformer Test
     */
    beforeEach(function() {
        global.fixtures = projectFixture.createDynamic();
    });

    describe('#transform()', function() {
        it('should inline macro calls when mode = inline', function() {
            const promise = co(function*() {
                const settings = {
                    settings: {
                        e_headline: {
                            mode: 'inline'
                        }
                    }
                };
                const testee = new InlineMacroCallTransformer();
                const configuration = yield exportHelper.createConfiguration(
                    'base/modules/m-teaser',
                    'm_teaser',
                    settings
                );
                const node = yield exportHelper.loadInputFixture(
                    'InlineMacroCallTransformer.input.j2',
                    'ast'
                );
                const transformedNode = yield testee.transform(node, configuration);
                return exportHelper.testNodeFixture('InlineMacroCallTransformer', transformedNode);
            });
            return promise;
        });
    });
});
