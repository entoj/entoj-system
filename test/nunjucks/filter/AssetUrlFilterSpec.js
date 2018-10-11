'use strict';

/**
 * Requirements
 */
const AssetUrlFilter = require(ES_SOURCE + '/nunjucks/filter/AssetUrlFilter.js').AssetUrlFilter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;
const GlobalConfiguration = require(ES_SOURCE + '/model/configuration/GlobalConfiguration.js')
    .GlobalConfiguration;
const BuildConfiguration = require(ES_SOURCE + '/model/configuration/BuildConfiguration.js')
    .BuildConfiguration;
const SystemModuleConfiguration = require(ES_SOURCE + '/configuration/SystemModuleConfiguration.js')
    .SystemModuleConfiguration;
const Environment = require(ES_SOURCE + '/nunjucks/Environment.js').Environment;
const projectFixture = require(ES_FIXTURES + '/project/index.js');

/**
 * Spec
 */
describe(AssetUrlFilter.className, function() {
    /**
     * Filter Test
     */
    filterSpec(AssetUrlFilter, 'nunjucks.filter/AssetUrlFilter', () => [
        new SystemModuleConfiguration(new GlobalConfiguration(), new BuildConfiguration())
    ]);

    /**
     * AssetUrlFilter Test
     */

    // Creates a initialized testee
    function createTestee(configuration) {
        return new AssetUrlFilter(
            new SystemModuleConfiguration(
                new GlobalConfiguration(configuration),
                new BuildConfiguration()
            )
        );
    }

    describe('#filter()', function() {
        it('should return a url for a asset path', function() {
            const testee = createTestee().filter();
            expect(testee('boo.svg')).to.be.equal('/boo.svg');
            expect(testee('/base/assets/boo.svg')).to.be.equal('/base/assets/boo.svg');
        });

        it('should allow to configure the base url', function() {
            const testee = createTestee({
                system: { filter: { assetUrl: { baseUrl: '/base/assets' } } }
            }).filter();
            expect(testee('boo.svg')).to.be.equal('/base/assets/boo.svg');
            expect(testee('/hotshit/boo.svg')).to.be.equal('/base/assets/hotshit/boo.svg');
        });

        it('should allow to use variables in the base url', function() {
            const fixture = projectFixture.createStatic();
            const environment = new Environment(
                fixture.entitiesRepository,
                fixture.pathesConfiguration,
                fixture.buildConfiguration
            );
            environment.addGlobal('location', { site: fixture.siteBase });
            const filter = createTestee({
                system: { filter: { assetUrl: { baseUrl: '${system.url.site}/assets' } } }
            });
            filter.register(environment);
            const testee = filter.filter();
            expect(testee('boo.svg')).to.be.equal('/base/assets/boo.svg');
            expect(testee('/hotshit/boo.svg')).to.be.equal('/base/assets/hotshit/boo.svg');
        });
    });
});
