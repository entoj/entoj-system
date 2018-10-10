'use strict';

/**
 * Requirements
 */
const LinkUrlFilter = require(ES_SOURCE + '/nunjucks/filter/LinkUrlFilter.js').LinkUrlFilter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;
const GlobalConfiguration = require(ES_SOURCE + '/model/configuration/GlobalConfiguration.js')
    .GlobalConfiguration;
const BuildConfiguration = require(ES_SOURCE + '/model/configuration/BuildConfiguration.js')
    .BuildConfiguration;
const SystemModuleConfiguration = require(ES_SOURCE + '/configuration/SystemModuleConfiguration.js')
    .SystemModuleConfiguration;

/**
 * Spec
 */
describe(LinkUrlFilter.className, function() {
    /**
     * Filter Test
     */
    filterSpec(LinkUrlFilter, 'nunjucks.filter/LinkUrlFilter', () => [
        new SystemModuleConfiguration(new GlobalConfiguration(), new BuildConfiguration())
    ]);

    /**
     * LinkUrlFilter Test
     */
    // Creates a initialized testee
    function createTestee(configuration) {
        return new LinkUrlFilter(
            new SystemModuleConfiguration(
                new GlobalConfiguration(configuration),
                new BuildConfiguration()
            )
        );
    }

    describe('#filter()', function() {
        it('should return a "empty" link when no valid link given', function() {
            const testee = createTestee().filter();
            expect(testee()).to.be.equal('JavaScript:;');
            expect(testee(1)).to.be.equal('JavaScript:;');
            expect(testee(true)).to.be.equal('JavaScript:;');
            expect(testee({})).to.be.equal('JavaScript:;');
        });

        it('should return a link when given a string', function() {
            const testee = createTestee().filter();
            expect(testee('/hi/there')).to.be.equal('/hi/there');
        });

        it('should allow to configure properties to search for a link when given a object', function() {
            const testee = createTestee({
                system: { filter: { linkUrl: { properties: ['url'] } } }
            }).filter();
            expect(testee({ url: '/hi/there' })).to.be.equal('/hi/there');
        });
    });
});
