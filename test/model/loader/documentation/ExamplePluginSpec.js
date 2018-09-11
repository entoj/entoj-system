/**
 * Requirements
 */
const ExamplePlugin = require(ES_SOURCE + '/model/loader/documentation/ExamplePlugin.js')
    .ExamplePlugin;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const loaderPluginSpec = require('../LoaderPluginShared.js').spec;

/**
 * Spec
 */
describe(ExamplePlugin.className, function() {
    /**
     * LoaderPlugin Test
     */
    loaderPluginSpec(ExamplePlugin, 'model.loader.documentation/ExamplePlugin', function(params) {
        params.unshift(global.fixtures.pathesConfiguration);
        return params;
    });

    /**
     * ExamplePlugin Test
     */
    beforeEach(function() {
        global.fixtures = projectFixture.createStatic();
    });
});
