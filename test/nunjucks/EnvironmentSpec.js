'use strict';

/**
 * Requirements
 */
const Environment = require(ES_SOURCE + '/nunjucks/Environment.js').Environment;
const Filters = require(ES_SOURCE + '/nunjucks/filter/index.js');
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');

/**
 * Spec
 */
describe(Environment.className, function() {
    /**
     * Base Test
     */
    baseSpec(Environment, 'nunjucks/Environment', function(parameters) {
        const fixture = projectFixture.createStatic();
        return [
            fixture.entitiesRepository,
            fixture.pathesConfiguration,
            fixture.buildConfiguration
        ];
    });

    /**
     * Environment Test
     */
    beforeEach(function() {
        global.fixtures = projectFixture.createDynamic();
    });

    // Creates a initialized testee
    function createTestee(templatePaths) {
        return new Environment(
            global.fixtures.entitiesRepository,
            global.fixtures.pathesConfiguration,
            global.fixtures.buildConfiguration,
            [new Filters.ModuleClassesFilter()],
            [],
            {
                templatePaths: templatePaths
            }
        );
    }

    describe('#addTemplatePath', function() {
        it('should allow to specify a single path as a string', function() {
            const testee = createTestee();
            testee.addTemplatePath(global.fixtures.pathesConfiguration.sites);
            expect(testee.templatePaths).to.be.deep.equal([
                global.fixtures.pathesConfiguration.sites
            ]);
        });

        it('should allow to specify a array of pathes', function() {
            const testee = createTestee();
            testee.addTemplatePath([
                global.fixtures.pathesConfiguration.sites,
                global.fixtures.pathesConfiguration.data
            ]);
            expect(testee.templatePaths).to.be.deep.equal([
                global.fixtures.pathesConfiguration.sites,
                global.fixtures.pathesConfiguration.data
            ]);
        });

        it('should resolve any pathes given', function() {
            const testee = createTestee();
            testee.addTemplatePath('${system.path.sites}');
            expect(testee.templatePaths).to.be.deep.equal([
                global.fixtures.pathesConfiguration.sites
            ]);
        });

        it('should eliminate duplicates', function() {
            const testee = createTestee();
            testee.addTemplatePath(
                '${system.path.sites}',
                global.fixtures.pathesConfiguration.sites
            );
            expect(testee.templatePaths).to.be.deep.equal([
                global.fixtures.pathesConfiguration.sites
            ]);
        });
    });

    describe('#renderString', function() {
        it('should add all necessary includes to render a template', function() {
            const testee = createTestee(global.fixtures.pathesConfiguration.sites);
            const input = '{{ e_cta() }}';
            const source = testee.renderString(input);
            expect(source).to.include('<a class="e-cta');
        });

        it('should allow to register a callback for supporting filters', function() {
            const testee = createTestee(global.fixtures.pathesConfiguration.sites);
            let calls = 0;
            testee.addFilterCallback('moduleClasses', (value) => {
                calls++;
                return value;
            });
            const input = '{{ e_cta() }}';
            testee.renderString(input);
            expect(calls).to.equal(1);
        });

        it('should allow to remove all registered filter callbacks', function() {
            const testee = createTestee(global.fixtures.pathesConfiguration.sites);
            let calls = 0;
            testee.addFilterCallback('moduleClasses', (value) => {
                calls++;
                return value;
            });
            testee.clearFilterCallbacks();
            const input = '{{ e_cta() }}';
            testee.renderString(input);
            expect(calls).to.equal(0);
        });
    });
});
