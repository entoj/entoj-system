'use strict';

/**
 * Requirements
 */
const SvgViewBoxFilter = require(ES_SOURCE + '/nunjucks/filter/SvgViewBoxFilter.js')
    .SvgViewBoxFilter;
const GlobalConfiguration = require(ES_SOURCE + '/model/configuration/GlobalConfiguration.js')
    .GlobalConfiguration;
const BuildConfiguration = require(ES_SOURCE + '/model/configuration/BuildConfiguration.js')
    .BuildConfiguration;
const SystemModuleConfiguration = require(ES_SOURCE + '/configuration/SystemModuleConfiguration.js')
    .SystemModuleConfiguration;
const Environment = require(ES_SOURCE + '/nunjucks/Environment.js').Environment;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const pathes = require(ES_SOURCE + '/utils/pathes.js');

/**
 * Spec
 */
describe(SvgViewBoxFilter.className, function() {
    /**
     * Filter Test
     */
    filterSpec(SvgViewBoxFilter, 'nunjucks.filter/SvgViewBoxFilter', () => [
        new SystemModuleConfiguration(new GlobalConfiguration(), new BuildConfiguration())
    ]);

    /**
     * SvgViewBoxFilter Test
     */

    // Creates a initialized testee
    function createTestee(configuration) {
        return new SvgViewBoxFilter(
            new SystemModuleConfiguration(
                new GlobalConfiguration(configuration),
                new BuildConfiguration()
            )
        );
    }

    describe('#filter()', function() {
        it('should return the default viewbox 0 0 0 0 for a non existing svg', function() {
            const testee = new createTestee({
                system: {
                    filter: {
                        svgViewBox: {
                            basePath: pathes.concat(
                                projectFixture.pathToSites,
                                '/base/global/assets/svg'
                            )
                        }
                    }
                }
            }).filter();
            expect(testee('error')).to.be.equal('0 0 0 0');
        });

        it('should return the viewbox of a existing svg', function() {
            const testee = new createTestee({
                system: {
                    filter: {
                        svgViewBox: {
                            basePath: pathes.concat(
                                projectFixture.pathToSites,
                                '/base/global/assets/svg'
                            )
                        }
                    }
                }
            }).filter();
            expect(testee('arrow')).to.be.equal('0 0 82.42 154.57');
        });

        it('should allow to use variables in the base path', function() {
            const fixture = projectFixture.createStatic({
                settings: {
                    system: {
                        filter: {
                            svgViewBox: { basePath: '${system.path.site}/global/assets/svg' }
                        }
                    }
                }
            });
            const environment = new Environment(
                fixture.entitiesRepository,
                fixture.pathesConfiguration,
                fixture.buildConfiguration
            );
            environment.addGlobal('location', { site: fixture.siteBase });
            const filter = new SvgViewBoxFilter(fixture.moduleConfiguration);
            filter.register(environment);
            const testee = filter.filter();
            expect(testee('arrow')).to.be.equal('0 0 82.42 154.57');
        });
    });
});
