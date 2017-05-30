'use strict';

/**
 * Requirements
 */
const BuildConfiguration = require(ES_SOURCE + '/model/configuration/BuildConfiguration.js').BuildConfiguration;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;


/**
 * Spec
 */
describe(BuildConfiguration.className, function()
{
    /**
     * Base Tests
     */
    baseSpec(BuildConfiguration, 'model.configuration/BuildConfiguration');


    /**
     * BuildConfiguration Tests
     */
    beforeEach(function()
    {
        global.fixtures = {};
        global.fixtures.build = {};
        global.fixtures.build.default = 'development';
        global.fixtures.build.environments = {};
        global.fixtures.build.environments.development =
        {
            sass:
            {
                sourceMaps: true,
                comments: false,
                optimize: false,
                minimize: false
            }
        };
        global.fixtures.build.environments.production =
        {
            sass:
            {
                sourceMaps: false,
                comments: false,
                optimize: false,
                minimize: false
            }
        };
    });

    // Simple properties
    baseSpec.assertProperty(new BuildConfiguration(global.fixtures.build), ['environment'], 'production');

    describe('#get()', function()
    {
        it('should allow to query values via their pathes', function()
        {
            const testee = new BuildConfiguration(global.fixtures.build);
            expect(testee.get('sass.sourceMaps')).to.be.equal(true);
        });


        it('should allow to specify a default value', function()
        {
            const testee = new BuildConfiguration(global.fixtures.build);
            expect(testee.get('sass.unconfigured', 'default')).to.be.equal('default');
        });


        it('should allow to switch the environment', function()
        {
            const testee = new BuildConfiguration(global.fixtures.build);
            testee.environment = 'production';
            expect(testee.get('sass.sourceMaps')).to.be.equal(false);
        });
    });
});
