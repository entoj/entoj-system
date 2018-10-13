'use strict';

/**
 * Requirements
 */
const EntojConfigurationTag = require(ES_SOURCE + '/nunjucks/tag/EntojConfigurationTag.js')
    .EntojConfigurationTag;
const ModuleConfigurations = require(ES_SOURCE + '/configuration/ModuleConfigurations.js')
    .ModuleConfigurations;
const ModuleConfiguration = require(ES_SOURCE + '/configuration/ModuleConfiguration.js')
    .ModuleConfiguration;
const BuildConfiguration = require(ES_SOURCE + '/model/configuration/BuildConfiguration.js')
    .BuildConfiguration;
const GlobalConfiguration = require(ES_SOURCE + '/model/configuration/GlobalConfiguration.js')
    .GlobalConfiguration;
const Environment = require('nunjucks').Environment;
const tagSpec = require(ES_TEST + '/nunjucks/tag/TagShared.js').spec;

/**
 * Spec
 */
describe(EntojConfigurationTag.className, function() {
    /**
     * Tag Test
     */
    tagSpec(EntojConfigurationTag, 'nunjucks.tag/EntojConfigurationTag', false, () => [
        new ModuleConfigurations()
    ]);

    /**
     * EntojConfigurationTag Test
     */
    class TestModuleConfiguration extends ModuleConfiguration {
        constructor(globalConfiguration, buildConfiguration) {
            super(globalConfiguration, buildConfiguration, 'test');
        }

        /**
         * @inheritDoc
         */
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
        global.fixtures = {
            globalConfiguration: new GlobalConfiguration(),
            buildConfiguration: new BuildConfiguration()
        };
        global.fixtures.moduleConfiguration = new TestModuleConfiguration(
            global.fixtures.globalConfiguration,
            global.fixtures.buildConfiguration
        );
        return new EntojConfigurationTag(
            new ModuleConfigurations({ test: global.fixtures.moduleConfiguration })
        );
    };

    describe('#generate()', function() {
        it('should update the given module configuration', function() {
            const testee = createTestee();
            const environment = new Environment();
            testee.register(environment);
            const template = "{% entojConfiguration moduleName='test', key='bar', value='fooz' %}";
            environment.renderString(template);
            expect(testee.moduleConfigurations.get('test').bar).to.be.equal('fooz');
        });

        it('should not throw an error when module configuration does not exists', function() {
            const testee = createTestee();
            const environment = new Environment();
            testee.register(environment);
            const template = "{% entojConfiguration moduleName='nope', key='foo', value='bar' %}";
            environment.renderString(template);
        });

        it('should not throw an error when configuration is not writable', function() {
            const testee = createTestee();
            const environment = new Environment();
            testee.register(environment);
            const template = "{% entojConfiguration moduleName='test', key='foo', value='bar' %}";
            environment.renderString(template);
        });
    });
});
