'use strict';

/**
 * Requirements
 */
const ModuleConfigurations = require(ES_SOURCE + '/configuration/ModuleConfigurations.js')
    .ModuleConfigurations;
const ModuleConfiguration = require(ES_SOURCE + '/configuration/ModuleConfiguration.js')
    .ModuleConfiguration;
const BuildConfiguration = require(ES_SOURCE + '/model/configuration/BuildConfiguration.js')
    .BuildConfiguration;
const GlobalConfiguration = require(ES_SOURCE + '/model/configuration/GlobalConfiguration.js')
    .GlobalConfiguration;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;

/**
 * Spec
 */
describe(ModuleConfigurations.className, function() {
    /**
     * Base Test
     */
    baseSpec(ModuleConfigurations, 'configuration/ModuleConfigurations');

    /**
     * ModuleConfigurations Test
     */
    class TestModuleConfiguration extends ModuleConfiguration {
        constructor(globalConfiguration, buildConfiguration) {
            super(globalConfiguration, buildConfiguration, 'test');
        }

        createMeta() {
            this.addMeta('foo', 'test.foo', 'test-bar');
            this.addMeta('bar', 'test.bar', 'test-foo');
        }

        get bar() {
            return this.configuration.get('bar');
        }

        set bar(value) {
            this.configuration.set('bar', value);
        }
    }

    class AlternativeModuleConfiguration extends ModuleConfiguration {
        constructor(globalConfiguration, buildConfiguration) {
            super(globalConfiguration, buildConfiguration, 'alternative');
        }

        createMeta() {
            this.addMeta('foo', 'alternative.foo', 'alternative-bar');
            this.addMeta('bar', 'alternative.bar', 'alternative-foo');
        }

        get bar() {
            return this.configuration.get('bar');
        }

        set bar(value) {
            this.configuration.set('bar', value);
        }
    }

    const createTestee = function() {
        global.fixtures = {
            globalConfiguration: new GlobalConfiguration(),
            buildConfiguration: new BuildConfiguration()
        };
        global.fixtures.testModuleConfiguration = new TestModuleConfiguration(
            global.fixtures.globalConfiguration,
            global.fixtures.buildConfiguration
        );
        global.fixtures.alternativeModuleConfiguration = new AlternativeModuleConfiguration(
            global.fixtures.globalConfiguration,
            global.fixtures.buildConfiguration
        );
        return new ModuleConfigurations([
            global.fixtures.testModuleConfiguration,
            global.fixtures.alternativeModuleConfiguration
        ]);
    };

    describe('#hasConfiguration', function() {
        it('should return true when the given configuration exists', function() {
            const testee = createTestee();
            expect(testee.hasConfiguration('foo')).to.be.ok;
            expect(testee.hasConfiguration('test.foo')).to.be.ok;
            expect(testee.hasConfiguration('alternative.foo')).to.be.ok;
        });

        it('should return false when the given configuration does not exist', function() {
            const testee = createTestee();
            expect(testee.hasConfiguration('baz')).to.be.not.ok;
            expect(testee.hasConfiguration('test.baz')).to.be.not.ok;
        });
    });

    describe('#getConfiguration', function() {
        it('should return the value of the given configuration', function() {
            const testee = createTestee();
            expect(testee.getConfiguration('foo')).to.be.equal('test-bar');
            expect(testee.getConfiguration('test.foo')).to.be.equal('test-bar');
            expect(testee.getConfiguration('alternative.foo')).to.be.equal('alternative-bar');
        });

        it('should return undefined when the given configuration does not exist', function() {
            const testee = createTestee();
            expect(testee.getConfiguration('baz')).to.be.undefined;
            expect(testee.getConfiguration('test.baz')).to.be.undefined;
        });
    });

    describe('#resolveConfiguration', function() {
        it('should replace all known variables', function() {
            const testee = createTestee();
            expect(testee.resolveConfiguration('')).to.be.equal('');
            expect(testee.resolveConfiguration('${test.foo}:${alternative.foo}')).to.be.equal(
                'test-bar:alternative-bar'
            );
        });
    });
});
