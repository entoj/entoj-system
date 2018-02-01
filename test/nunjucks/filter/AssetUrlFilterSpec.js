'use strict';

/**
 * Requirements
 */
const AssetUrlFilter = require(ES_SOURCE + '/nunjucks/filter/AssetUrlFilter.js').AssetUrlFilter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;
const Environment = require(ES_SOURCE + '/nunjucks/Environment.js').Environment;
const projectFixture = require(ES_FIXTURES + '/project/index.js');


/**
 * Spec
 */
describe(AssetUrlFilter.className, function()
{
    /**
     * Filter Test
     */
    filterSpec(AssetUrlFilter, 'nunjucks.filter/AssetUrlFilter');


    /**
     * AssetUrlFilter Test
     */
    describe('#filter()', function()
    {
        it('should return a url for a asset path', function()
        {
            const testee = new AssetUrlFilter().filter();
            expect(testee('boo.svg')).to.be.equal('/boo.svg');
            expect(testee('/base/assets/boo.svg')).to.be.equal('/base/assets/boo.svg');
        });

        it('should allow to configure the base url', function()
        {
            const testee = new AssetUrlFilter('/base/assets').filter();
            expect(testee('boo.svg')).to.be.equal('/base/assets/boo.svg');
            expect(testee('/hotshit/boo.svg')).to.be.equal('/base/assets/hotshit/boo.svg');
        });

        it('should allow to override the base url via buildConfiguration filters.assetUrl', function()
        {
            const options =
            {
                build:
                {
                    default: 'development',
                    environments:
                    {
                        development:
                        {
                            filters:
                            {
                                assetUrl: '/build/specific'
                            }
                        }
                    }
                }
            };
            const fixture = projectFixture.createStatic(options);
            const environment = new Environment(fixture.entitiesRepository, fixture.pathesConfiguration, fixture.buildConfiguration);
            const filter = new AssetUrlFilter();
            filter.register(environment);
            const testee = filter.filter();
            expect(testee('boo.svg')).to.be.equal('/build/specific/boo.svg');
            expect(testee('/hotshit/boo.svg')).to.be.equal('/build/specific/hotshit/boo.svg');
        });
    });
});
