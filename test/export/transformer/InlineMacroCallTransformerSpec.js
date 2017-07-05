'use strict';

/**
 * Requirements
 */
const InlineMacroCallTransformer = require(ES_SOURCE + '/export/transformer/InlineMacroCallTransformer.js').InlineMacroCallTransformer;
const nodeTransformerSpec = require(ES_TEST + '/export/transformer/NodeTransformerShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const exportHelper = require(ES_TEST + '/export/ExportHelper.js')();
const co = require('co');


/**
 * Spec
 */
describe(InlineMacroCallTransformer.className, function()
{
    /**
     * NodeTransformer Test
     */
    nodeTransformerSpec(InlineMacroCallTransformer, 'export.transformer/InlineMacroCallTransformer');


    /**
     * DecorateVariablesTransformer Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createDynamic();
    });

    describe('#transform()', function()
    {
        it('should inline macro calls when mode = inline', function()
        {
            const promise = co(function*()
            {
                const settings =
                {
                    settings:
                    {
                        macros:
                        {
                            e_headline:
                            {
                                mode: 'inline'
                            }
                        }
                    }
                };
                const configuration = yield exportHelper.createConfiguration('base/modules/m-teaser', 'm_teaser', settings);
                const testee = new InlineMacroCallTransformer();
                yield nodeTransformerSpec.testFixture(testee, configuration);
            });
            return promise;
        });
    });
});
