'use strict';

/**
 * Requirements
 */
const GlobalConfiguration = require(ES_SOURCE + '/model/configuration/GlobalConfiguration.js')
    .GlobalConfiguration;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;

/**
 * Spec
 */
describe(GlobalConfiguration.className, function() {
    /**
     * Base Tests
     */
    baseSpec(GlobalConfiguration, 'model.configuration/GlobalConfiguration');

    /**
     * GlobalConfiguration Tests
     */
    beforeEach(function() {
        global.fixtures = {};
        global.fixtures.global = {
            groups: {
                default: 'core'
            }
        };
    });

    describe('#has()', function() {
        it('should resolve to true when setting exists', function() {
            const testee = new GlobalConfiguration(global.fixtures.global);
            expect(testee.has('groups.default')).to.be.ok;
        });

        it('should resolve to false when setting does not exist', function() {
            const testee = new GlobalConfiguration(global.fixtures.global);
            expect(testee.has('not.there')).to.be.not.ok;
        });
    });

    describe('#get()', function() {
        it('should return configured values', function() {
            const testee = new GlobalConfiguration({ some: { path: 'common' } });
            expect(testee.get('some.path')).to.be.equal('common');
        });

        it('should allow to specify a default value', function() {
            const testee = new GlobalConfiguration();
            expect(testee.get('some.path', 'global')).to.be.equal('global');
        });

        it('should throw an error for unknown settings', function() {
            const testee = new GlobalConfiguration();
            expect(function() {
                testee.get('foo');
            }).to.throw();
        });
    });
});
