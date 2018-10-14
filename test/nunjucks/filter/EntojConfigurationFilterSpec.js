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
    class TestModuleConfiguration extends ModuleConfiguration {
        constructor(globalConfiguration, buildConfiguration) {
            super(globalConfiguration, buildConfiguration, 'test');
        }

        createMeta() {
            this.addMeta('foo', 'test.foo', 'bar');
            this.addMeta('bar', 'test.bar', 'foo');
        }

        get foo() {
            return this.configuration.get('foo');
        }

        get bar() {
            return this.configuration.get('bar');
        }

        set bar(value) {
            this.configuration.set('bar', value);
        }
    }

    const createTestee = function() {
        return new EntojConfigurationFilter(
            new ModuleConfigurations([
                new TestModuleConfiguration(new GlobalConfiguration(), new BuildConfiguration())
            ])
        );
    };

    describe('#filter()', function() {
        it('should return a existing configuration value', function() {
            const testee = createTestee().filter();
            expect(testee('foo')).to.be.equal('bar');
            expect(testee('test.foo')).to.be.equal('bar');
        });

        it('should return a undefined for a non existing configuration value', function() {
            const testee = createTestee().filter();
            expect(testee('zonk')).to.be.undefined;
            expect(testee('test.zonk')).to.be.undefined;
        });
    });
});
