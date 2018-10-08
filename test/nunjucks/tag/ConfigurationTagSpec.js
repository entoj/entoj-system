'use strict';

/**
 * Requirements
 */
const ConfigurationTag = require(ES_SOURCE + '/nunjucks/tag/ConfigurationTag.js').ConfigurationTag;
const ModuleConfigurations = require(ES_SOURCE + '/configuration/ModuleConfigurations.js')
    .ModuleConfigurations;
const Environment = require('nunjucks').Environment;
const tagSpec = require(ES_TEST + '/nunjucks/tag/TagShared.js').spec;

/**
 * Spec
 */
describe(ConfigurationTag.className, function() {
    /**
     * Tag Test
     */
    tagSpec(ConfigurationTag, 'nunjucks.tag/ConfigurationTag', false, () => [
        new ModuleConfigurations()
    ]);

    /**
     * ConfigurationTag Test
     */
    class TestModuleConfiguration {
        get foo() {
            return 'readonly';
        }
    }

    const createTestee = function(moduleConfigs) {
        return new ConfigurationTag(new ModuleConfigurations(moduleConfigs));
    };

    describe('#generate()', function() {
        it('should update the given module configuration', function() {
            const testee = createTestee({ test: {} });
            const environment = new Environment();
            testee.register(environment);
            const template = "{% configuration name='test', key='foo', value='bar' %}";
            environment.renderString(template);
            expect(testee.moduleConfigurations.get('test').foo).to.be.equal('bar');
        });

        it('should not throw an error when module configuration does not exists', function() {
            const testee = createTestee({ test: {} });
            const environment = new Environment();
            testee.register(environment);
            const template = "{% configuration name='nope', key='foo', value='bar' %}";
            environment.renderString(template);
        });

        it('should not throw an error when configuration is not writable', function() {
            const testee = createTestee({ test: new TestModuleConfiguration() });
            const environment = new Environment();
            testee.register(environment);
            const template = "{% configuration name='test', key='foo', value='bar' %}";
            environment.renderString(template);
        });
    });
});
