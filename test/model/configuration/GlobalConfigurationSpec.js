'use strict';

/**
 * Requirements
 */
const GlobalConfiguration = require(ES_SOURCE + '/model/configuration/GlobalConfiguration.js').GlobalConfiguration;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;


/**
 * Spec
 */
describe(GlobalConfiguration.className, function()
{
    /**
     * Base Tests
     */
    baseSpec(GlobalConfiguration, 'model.configuration/GlobalConfiguration');


    /**
     * GlobalConfiguration Tests
     */
    beforeEach(function()
    {
        global.fixtures = {};
        global.fixtures.global =
        {
            groups:
            {
                default: 'core'
            }
        };
    });


    describe('#has()', function()
    {
        it('should resolve to true when setting exists', function()
        {
            const testee = new GlobalConfiguration(global.fixtures.global);
            expect(testee.has('groups.default')).to.be.ok;
        });

        it('should resolve to false when setting does not exist', function()
        {
            const testee = new GlobalConfiguration(global.fixtures.global);
            expect(testee.has('not.there')).to.be.not.ok;
        });
    });


    describe('#get()', function()
    {
        it('should have default values for all settings', function()
        {
            const testee = new GlobalConfiguration();
            expect(testee.get('groups.default')).to.be.equal('common');
        });

        it('should allow to configure settings', function()
        {
            const testee = new GlobalConfiguration(global.fixtures.global);
            expect(testee.get('groups.default')).to.be.equal('core');
        });


        it('should throw an error for unknown settings', function()
        {
            const testee = new GlobalConfiguration();
            expect(function()
            {
                testee.get('foo');
            }).to.throw();
        });
    });
});
