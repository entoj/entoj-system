'use strict';

/**
 * Requirements
 */
const NunjucksLinter = require(ES_SOURCE + '/linter/NunjucksLinter.js').NunjucksLinter;
const EntityRenderer = require(ES_SOURCE + '/nunjucks/EntityRenderer.js').EntityRenderer;
const linterSpec = require('./LinterShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const co = require('co');

/**
 * Spec
 */
describe(NunjucksLinter.className, function() {
    /**
     * Linter Test
     */
    linterSpec(NunjucksLinter, 'linter/NunjucksLinter', {}, () => {
        const fixture = projectFixture.createDynamic();
        const entityRenderer = fixture.context.di.create(EntityRenderer);
        return [entityRenderer];
    });

    /**
     * NunjucksLinter Test
     */
    beforeEach(function() {
        global.fixtures = projectFixture.createDynamic();
        global.fixtures.entityRenderer = global.fixtures.context.di.create(EntityRenderer);
    });

    describe('#lint()', function() {
        it('should lint templates when provided a entity', function() {
            const promise = co(function*() {
                const testee = new NunjucksLinter(global.fixtures.entityRenderer);
                const site = yield global.fixtures.sitesRepository.findBy({ '*': 'Base' });
                const entity = yield global.fixtures.entitiesRepository.getById('e-cta', site);
                const result = yield testee.lint('Hi, no errors!', { entity: entity });
                expect(result.success).to.be.ok;
            });
            return promise;
        });

        it('should report any template errors', function() {
            const promise = co(function*() {
                const testee = new NunjucksLinter(global.fixtures.entityRenderer);
                const site = yield global.fixtures.sitesRepository.findBy({ '*': 'Base' });
                const entity = yield global.fixtures.entitiesRepository.getById('e-cta', site);
                const result = yield testee.lint('Hi, errors!{% call error() %}', {
                    entity: entity
                });
                expect(result.success).to.be.not.ok;
                expect(result.errorCount).to.be.equal(1);
                expect(result.messages).to.have.length(1);
            });
            return promise;
        });
    });
});
