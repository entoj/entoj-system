/**
 * Requirements
 */
const MarkdownPlugin = require(ES_SOURCE + '/model/loader/documentation/MarkdownPlugin.js').MarkdownPlugin;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const loaderPluginSpec = require('../LoaderPluginShared.js').spec;


/**
 * Spec
 */
describe(MarkdownPlugin.className, function()
{
    /**
     * LoaderPlugin Test
     */
    loaderPluginSpec(MarkdownPlugin, 'model.loader.documentation/MarkdownPlugin', function(params)
    {
        params.unshift(global.fixtures.pathesConfiguration);
        return params;
    });


    /**
     * MarkupPlugin Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic();
    });
});
