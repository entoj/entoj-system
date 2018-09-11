'use strict';

/**
 * Requirements
 */
const FileLoader = require(ES_SOURCE + '/nunjucks/loader/FileLoader.js').FileLoader;
const Template = require(ES_SOURCE + '/nunjucks/Template.js').Template;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');

/**
 * Spec
 */
describe(FileLoader.className, function() {
    /**
     * Base Test
     */
    baseSpec(FileLoader, 'nunjucks.loader/FileLoader', function(parameters) {
        const fixture = projectFixture.createStatic();
        const template = new Template(fixture.entitiesRepository);
        return [undefined, template];
    });

    /**
     * FileLoader Test
     */
    beforeEach(function() {
        global.fixtures = projectFixture.createDynamic();
    });

    // Creates a initialized testee
    function createTestee(basePath) {
        const template = new Template(global.fixtures.entitiesRepository);
        return new FileLoader(basePath, template);
    }

    describe('#resolve', function() {
        it('should return false for a non existing file', function() {
            const testee = createTestee(global.fixtures.pathesConfiguration.sites);
            const result = testee.resolve('/foo/foo.j2');
            expect(result).to.be.not.ok;
        });

        it('should return the path for a existing file absolute to the basePath', function() {
            const testee = createTestee(global.fixtures.pathesConfiguration.sites);
            const result = testee.resolve('/base/elements/e-cta/e-cta.j2');
            expect(result).to.be.ok;
            expect(result).to.contain('e-cta.j2');
        });

        it('should return the path for a existing file in its short form that is absolute to the basePath', function() {
            const testee = createTestee(global.fixtures.pathesConfiguration.sites);
            const result = testee.resolve('/base/elements/e-cta');
            expect(result).to.be.ok;
            expect(result).to.contain('e-cta.j2');
        });
    });

    describe('#getSource', function() {
        it('should return false for a non existing file', function() {
            const testee = createTestee(global.fixtures.pathesConfiguration.sites);
            const result = testee.getSource('/foo/foo.j2');
            expect(result).to.be.not.ok;
        });

        it('should return a object containng the source and filename for a existing file', function() {
            const testee = createTestee(global.fixtures.pathesConfiguration.sites);
            const result = testee.getSource('/base/elements/e-cta/e-cta.j2');
            expect(result).to.be.ok;
            expect(result.src).to.contain('{% macro e_cta');
            expect(result.path).to.contain('e-cta.j2');
        });

        it('should add all needed imports', function() {
            const testee = createTestee(global.fixtures.pathesConfiguration.sites);
            const result = testee.getSource('/base/modules/m-teaser/m-teaser.j2');
            expect(result).to.be.ok;
            expect(result.src).to.contain('import e_cta');
            expect(result.src).to.contain('import e_headline');
            expect(result.src).to.contain('import e_image');
        });
    });
});
