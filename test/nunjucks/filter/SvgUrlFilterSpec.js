'use strict';

/**
 * Requirements
 */
const SvgUrlFilter = require(ES_SOURCE + '/nunjucks/filter/SvgUrlFilter.js').SvgUrlFilter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;
const Environment = require(ES_SOURCE + '/nunjucks/Environment.js').Environment;
const projectFixture = require(ES_FIXTURES + '/project/index.js');

/**
 * Spec
 */
describe(SvgUrlFilter.className, function() {
    /**
     * Filter Test
     */
    filterSpec(SvgUrlFilter, 'nunjucks.filter/SvgUrlFilter');

    /**
     * SettingFilter Test
     */
    describe('#filter()', function() {
        it('should return a svg sprite url', function() {
            const testee = new SvgUrlFilter().filter();
            expect(testee('arrow')).to.be.equal('/arrow.svg#icon');
        });

        it('should allow to configure the svg base url', function() {
            const testee = new SvgUrlFilter('/path/to/svg').filter();
            expect(testee('arrow')).to.be.equal('/path/to/svg/arrow.svg#icon');
        });

        it('should allow to override the base url via buildConfiguration filters.svgUrl', function() {
            const options = {
                build: {
                    default: 'development',
                    environments: {
                        development: {
                            filters: {
                                svgUrl: '/build/specific'
                            }
                        }
                    }
                }
            };
            const fixture = projectFixture.createStatic(options);
            const environment = new Environment(
                fixture.entitiesRepository,
                fixture.pathesConfiguration,
                fixture.buildConfiguration
            );
            const filter = new SvgUrlFilter();
            filter.register(environment);
            const testee = filter.filter();
            expect(testee('boo')).to.be.equal('/build/specific/boo.svg#icon');
        });
    });
});
