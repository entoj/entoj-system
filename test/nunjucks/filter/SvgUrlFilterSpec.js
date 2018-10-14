'use strict';

/**
 * Requirements
 */
const SvgUrlFilter = require(ES_SOURCE + '/nunjucks/filter/SvgUrlFilter.js').SvgUrlFilter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;
const Environment = require(ES_SOURCE + '/nunjucks/Environment.js').Environment;
const GlobalConfiguration = require(ES_SOURCE + '/model/configuration/GlobalConfiguration.js')
    .GlobalConfiguration;
const BuildConfiguration = require(ES_SOURCE + '/model/configuration/BuildConfiguration.js')
    .BuildConfiguration;
const SystemModuleConfiguration = require(ES_SOURCE + '/configuration/SystemModuleConfiguration.js')
    .SystemModuleConfiguration;
const projectFixture = require(ES_FIXTURES + '/project/index.js');

/**
 * Spec
 */
describe(SvgUrlFilter.className, function() {
    /**
     * Filter Test
     */
    filterSpec(SvgUrlFilter, 'nunjucks.filter/SvgUrlFilter', () => [
        new SystemModuleConfiguration(new GlobalConfiguration(), new BuildConfiguration())
    ]);

    /**
     * SettingFilter Test
     */

    // Creates a initialized testee
    function createTestee(configuration) {
        return new SvgUrlFilter(
            new SystemModuleConfiguration(
                new GlobalConfiguration(configuration),
                new BuildConfiguration()
            )
        );
    }

    describe('#filter()', function() {
        it('should return a svg sprite url', function() {
            const testee = createTestee().filter();
            expect(testee('arrow')).to.be.equal('/arrow.svg#icon');
            expect(testee('arrow.svg')).to.be.equal('/arrow.svg#icon');
        });

        it('should allow to configure the base url', function() {
            const testee = createTestee({
                system: { filter: { svgUrl: { baseUrl: '/base/assets' } } }
            }).filter();
            expect(testee('boo.svg')).to.be.equal('/base/assets/boo.svg#icon');
            expect(testee('/hotshit/boo')).to.be.equal('/base/assets/hotshit/boo.svg#icon');
        });

        it('should allow to use variables in the base url', function() {
            const fixture = projectFixture.createStatic({
                settings: {
                    system: { filter: { svgUrl: { baseUrl: '${system.url.site}/assets' } } }
                }
            });
            const environment = new Environment(
                fixture.entitiesRepository,
                fixture.pathesConfiguration,
                fixture.buildConfiguration
            );
            environment.addGlobal('entoj', { location: { site: fixture.siteBase } });
            const filter = new SvgUrlFilter(fixture.moduleConfiguration);
            filter.register(environment);
            const testee = filter.filter();
            expect(testee('boo.svg')).to.be.equal('/base/assets/boo.svg#icon');
            expect(testee('/hotshit/boo')).to.be.equal('/base/assets/hotshit/boo.svg#icon');
        });
    });
});
