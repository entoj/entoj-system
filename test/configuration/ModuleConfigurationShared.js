'use strict';

/**
 * Requirements
 * @ignore
 */
const BuildConfiguration = require(ES_SOURCE + '/model/configuration/BuildConfiguration.js')
    .BuildConfiguration;
const GlobalConfiguration = require(ES_SOURCE + '/model/configuration/GlobalConfiguration.js')
    .GlobalConfiguration;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;

/**
 * Shared Renderer spec
 */
function spec(type, className, prepareParameters) {
    /**
     * Base Test
     */
    baseSpec(type, className, prepareParameters);

    /**
     * ModuleConfiguration Test
     */
    const createTestee = function() {
        let parameters = Array.from(arguments);
        if (prepareParameters) {
            parameters = prepareParameters(parameters);
        }
        return new type(...parameters);
    };

    // Simple properties
    baseSpec.assertProperty(createTestee(), ['buildConfiguration'], undefined, BuildConfiguration);
    baseSpec.assertProperty(
        createTestee(),
        ['globalConfiguration'],
        undefined,
        GlobalConfiguration
    );

    describe('#getConfiguration', function() {
        it('should return the default value when path does not exist', function() {
            const testee = createTestee();
            expect(testee.getConfiguration('does.not.exist', 'default')).to.be.equal('default');
        });

        it('should return the value from GlobalConfiguration when it exists', function() {
            const testee = createTestee(
                new GlobalConfiguration({ system: { value: '42' } }),
                new BuildConfiguration()
            );
            expect(testee.getConfiguration('system.value', 'default')).to.be.equal('42');
        });

        it('should return the value from BuildConfiguration when it exists', function() {
            const testee = createTestee(
                new GlobalConfiguration(),
                new BuildConfiguration({
                    environments: { development: { system: { value: '42' } } }
                })
            );
            expect(testee.getConfiguration('system.value', 'default')).to.be.equal('42');
        });

        it('should prefer the value from BuildConfiguration over GlobalConfiguration', function() {
            const testee = createTestee(
                new GlobalConfiguration({ system: { value: '21' } }),
                new BuildConfiguration({
                    environments: { development: { system: { value: '42' } } }
                })
            );
            expect(testee.getConfiguration('system.value', 'default')).to.be.equal('42');
        });
    });
}

/**
 * Exports
 */
module.exports.spec = spec;
