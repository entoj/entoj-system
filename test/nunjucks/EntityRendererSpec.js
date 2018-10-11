'use strict';

/**
 * Requirements
 */
const EntityRenderer = require(ES_SOURCE + '/nunjucks/EntityRenderer.js').EntityRenderer;
const Environment = require(ES_SOURCE + '/nunjucks/Environment.js').Environment;
const Filters = require(ES_SOURCE + '/nunjucks/filter/index.js');
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const co = require('co');
const isWin32 = process.platform == 'win32';

/**
 * Spec
 */
describe(EntityRenderer.className, function() {
    /**
     * Base Test
     */
    baseSpec(EntityRenderer, 'nunjucks/EntityRenderer', function(parameters) {
        const environment = new Environment(
            global.fixtures.entitiesRepository,
            global.fixtures.pathesConfiguration,
            global.fixtures.buildConfiguration
        );
        return [
            global.fixtures.urlsConfiguration,
            global.fixtures.pathesConfiguration,
            environment
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
        const environment = new Environment(
            global.fixtures.entitiesRepository,
            global.fixtures.pathesConfiguration,
            global.fixtures.buildConfiguration,
            [new Filters.ModuleClassesFilter()]
        );
        return new EntityRenderer(
            global.fixtures.urlsConfiguration,
            global.fixtures.pathesConfiguration,
            environment
        );
    }

    describe('#templatePathes', function() {
        it('should allow to set a template path as a string', function() {
            const testee = createTestee();
            testee.templatePaths = '/tmp';
            expect(testee.templatePaths).to.be.deep.equal([isWin32 ? 'C:\\tmp' : '/tmp']);
        });

        it('should allow to set template pathes with variables', function() {
            const testee = createTestee();
            testee.templatePaths = ['${system.path.cache}'];
            expect(testee.templatePaths).to.be.deep.equal([
                global.fixtures.pathesConfiguration.cache
            ]);
        });
    });

    describe('#renderString', function() {
        it('should render the given template', function() {
            const promise = co(function*() {
                const testee = createTestee();
                const source = yield testee.renderString(
                    '{{ name }} - {{ hero }}',
                    'just/a/path/to/file.j2',
                    false,
                    false,
                    { name: 'Clark' },
                    { hero: 'Superman' }
                );
                expect(source).to.be.equal('Clark - Superman');
            });
            return promise;
        });
    });

    describe('#renderForUrl', function() {
        it('should render the template for a valid url', function() {
            const promise = co(function*() {
                const testee = createTestee();
                const source = yield testee.renderForUrl(
                    'base/elements/e-cta/examples/overview.j2'
                );
                expect(source).to.be.ok;
            });
            return promise;
        });

        it('should resolve to false for a invalid url', function() {
            const promise = co(function*() {
                const testee = createTestee();
                const source = yield testee.renderForUrl('base/elements/e-cta/examples/missing.j2');
                expect(source).to.be.not.ok;
            });
            return promise;
        });

        it('should throw a exception when the template contains errors', function() {
            const promise = co(function*() {
                const testee = createTestee();
                let error;
                try {
                    yield testee.renderForUrl('base/elements/e-cta/examples/failure.j2');
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.ok;
            });
            return promise;
        });
    });
});
