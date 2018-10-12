'use strict';

/**
 * Requirements
 */
const TemplateRenderer = require(ES_SOURCE + '/nunjucks/TemplateRenderer.js').TemplateRenderer;
const Environment = require(ES_SOURCE + '/nunjucks/Environment.js').Environment;
const Filters = require(ES_SOURCE + '/nunjucks/filter/index.js');
const ContentKind = require(ES_SOURCE + '/model/ContentKind.js').ContentKind;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const co = require('co');
const isWin32 = process.platform == 'win32';

/**
 * Spec
 */
describe(TemplateRenderer.className, function() {
    /**
     * Base Test
     */
    baseSpec(TemplateRenderer, 'nunjucks/TemplateRenderer', function(parameters) {
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
    function createTestee(templatePaths, models, types) {
        const environment = new Environment(
            global.fixtures.entitiesRepository,
            global.fixtures.pathesConfiguration,
            global.fixtures.buildConfiguration,
            [new Filters.ModuleClassesFilter()]
        );
        return new TemplateRenderer(
            global.fixtures.urlsConfiguration,
            global.fixtures.pathesConfiguration,
            environment,
            templatePaths,
            models,
            types
        );
    }

    describe('#addTemplatePath', function() {
        it('should allow to set a template path', function() {
            const testee = createTestee([]);
            testee.addTemplatePath('/tmp');
            expect(testee.templatePaths).to.be.deep.equal([isWin32 ? 'C:\\tmp' : '/tmp']);
        });

        it('should allow to set template pathes with variables', function() {
            const testee = createTestee([]);
            testee.addTemplatePath('${system.path.cache}');
            expect(testee.templatePaths).to.be.deep.equal([
                global.fixtures.pathesConfiguration.cache
            ]);
        });
    });

    describe('#render', function() {
        it('should render the given template', function() {
            const promise = co(function*() {
                const testee = createTestee();
                const source = yield testee.render(
                    '{{ name }} - {{ hero }}',
                    'just/a/path/to/file.j2',
                    { name: 'Clark', hero: 'Superman' }
                );
                expect(source).to.be.equal('Clark - Superman');
            });
            return promise;
        });

        it('should provide access to entoj.type', function() {
            const promise = co(function*() {
                const testee = createTestee(undefined, undefined, [ContentKind]);
                const source = yield testee.render('{{ entoj.type.ContentKind.CSS }}');
                expect(source).to.be.equal('css');
            });
            return promise;
        });

        it('should provide access to entoj.model', function() {
            const promise = co(function*() {
                const testee = createTestee(undefined, [global.fixtures.entitiesRepository], []);
                const source = yield testee.render(
                    '{{ entoj.model.entities.getById("e-cta").idString }}'
                );
                expect(source).to.be.equal('e-cta');
            });
            return promise;
        });

        it('should provide access to entoj.location', function() {
            const promise = co(function*() {
                const entity = yield global.fixtures.entitiesRepository.getById('e-cta');
                const testee = createTestee(undefined, [global.fixtures.entitiesRepository], []);
                const source = yield testee.render(
                    '{{ entoj.location.site.name }}-{{ entoj.location.entityCategory.pluralName }}-{{ entoj.location.entity.idString }}',
                    undefined,
                    undefined,
                    { entity: entity }
                );
                expect(source).to.be.equal('Base-Elements-e-cta');
            });
            return promise;
        });
    });
});
