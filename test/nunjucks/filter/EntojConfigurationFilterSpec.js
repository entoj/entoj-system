'use strict';

/**
 * Requirements
 */
const EntojConfigurationFilter = require(ES_SOURCE + '/nunjucks/filter/EntojConfigurationFilter.js')
    .EntojConfigurationFilter;
const ModuleConfigurations = require(ES_SOURCE + '/configuration/ModuleConfigurations.js')
    .ModuleConfigurations;
const ModuleConfiguration = require(ES_SOURCE + '/configuration/ModuleConfiguration.js')
    .ModuleConfiguration;
const BuildConfiguration = require(ES_SOURCE + '/model/configuration/BuildConfiguration.js')
    .BuildConfiguration;
const GlobalConfiguration = require(ES_SOURCE + '/model/configuration/GlobalConfiguration.js')
    .GlobalConfiguration;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;

/**
 * Spec
 */
describe(EntojConfigurationFilter.className, function() {
    /**
     * Filter Test
     */
    filterSpec(EntojConfigurationFilter, 'nunjucks.filter/EntojConfigurationFilter', function(
        parameters
    ) {
        return [new ModuleConfigurations(new GlobalConfiguration(), new BuildConfiguration())];
    });

    /**
     * EntojConfigurationFilter Test
     */
    const createTestee = function() {
        global.fixtures = {
            global: new ModuleConfiguration(new GlobalConfiguration(), new BuildConfiguration())
        };
        global.fixtures.global.addMeta('foo', 'global.foo', 'bar');
        return new EntojConfigurationFilter(
            new ModuleConfigurations({ global: global.fixtures.global })
        );
    };

    describe('#filter()', function() {
        it('should return a existing configuration value', function() {
            const testee = createTestee().filter();
            expect(testee('foo', 'global')).to.be.equal('bar');
            expect(testee('global.foo', 'global')).to.be.equal('bar');
        });

        it('should return a undefined for a non existing configuration value', function() {
            const testee = createTestee().filter();
            expect(testee('bar', 'global')).to.be.undefined;
            expect(testee('global.bar', 'global')).to.be.undefined;
        });
    });
});
