/**
 * Requirements
 */
const JinjaPlugin = require(ES_SOURCE + '/model/loader/documentation/JinjaPlugin.js').JinjaPlugin;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const loaderPluginSpec = require('../LoaderPluginShared.js').spec;

/**
 * Spec
 */
describe(JinjaPlugin.className, function() {
    /**
     * LoaderPlugin Test
     */
    loaderPluginSpec(JinjaPlugin, 'model.loader.documentation/JinjaPlugin', function(params) {
        params.unshift(global.fixtures.pathesConfiguration);
        return params;
    });

    /**
     * JinjaPlugin Test
     */
    beforeEach(function() {
        global.fixtures = projectFixture.createStatic();
    });
});
