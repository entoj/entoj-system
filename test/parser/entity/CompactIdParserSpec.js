'use strict';

/**
 * Requirements
 */
const CompactIdParser = require(ES_SOURCE + '/parser/entity/CompactIdParser.js').CompactIdParser;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;


/**
 * Spec
 */
describe(CompactIdParser.className, function()
{
    /**
     * Base Test
     */
    baseSpec(CompactIdParser, 'parser.entity/CompactIdParser', prepareParameters);


    function prepareParameters(parameters)
    {
        parameters.unshift(global.fixtures.categoriesRepository);
        parameters.unshift(global.fixtures.sitesRepository);
        return parameters;
    }


    /**
     * CompactIdParser Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic();
    });


    describe('#parse()', function()
    {
        describe('useNumbers = false', function()
        {
            it('should resolve to a valid entity when given string like m-gallery', function()
            {
                const testee = new CompactIdParser(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, { useNumbers: false });
                const promise = testee.parse('m-gallery').then(function(result)
                {
                    expect(result).to.be.ok;
                    expect(result.entityCategory).to.be.equal(global.fixtures.categoryModule);
                    expect(result.entityName).to.be.equal('gallery');
                    expect(result.entityNumber).to.be.equal(0);
                });
                return promise;
            });

            it('should resolve to a valid entity category when given a string like /base/global', function()
            {
                const testee = new CompactIdParser(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, { useNumbers: false });
                const promise = testee.parse('/base/global').then(function(result)
                {
                    expect(result).to.be.ok;
                    expect(result.siteName).to.be.equal('base');
                    expect(result.entityCategory).to.be.equal(global.fixtures.categoryGlobal);
                });
                return promise;
            });

            it('should resolve to a valid entity when given a full compact id like /base/module-groups/g-gallery', function()
            {
                const testee = new CompactIdParser(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, { useNumbers: false });
                const promise = testee.parse('/base/module-groups/g-gallery').then(function(result)
                {
                    expect(result).to.be.ok;
                    expect(result.entityCategory).to.be.equal(global.fixtures.categoryModuleGroup);
                    expect(result.entityName).to.be.equal('gallery');
                    expect(result.entityNumber).to.be.equal(0);
                    expect(result.siteName).to.be.equal('base');
                });
                return promise;
            });

            it('should accept windows style slashes like \\whatever\\base\\modules\\m-teaser\\js\\test.js', function()
            {
                const testee = new CompactIdParser(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, { useNumbers: false });
                const promise = testee.parse('\\whatever\\base\\modules\\m-teaser\\js\\test.js').then(function(result)
                {
                    expect(result).to.be.ok;
                    expect(result.entityCategory).to.be.equal(global.fixtures.categoryModule);
                    expect(result.entityName).to.be.equal('teaser');
                    expect(result.entityNumber).to.be.equal(0);
                    expect(result.siteName).to.be.equal('base');
                });
                return promise;
            });

            it('should ignore anything around valid path like /whatever/default/modules/m-gallery/test.j2', function()
            {
                const testee = new CompactIdParser(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, { useNumbers: false });
                const promise = testee.parse('/whatever/default/modules/m-gallery/test.j2').then(function(result)
                {
                    expect(result).to.be.ok;
                    expect(result.entityCategory).to.be.equal(global.fixtures.categoryModule);
                    expect(result.entityName).to.be.equal('gallery');
                    expect(result.entityNumber).to.be.equal(0);
                    expect(result.siteName).to.be.equal('default');
                });
                return promise;
            });

            xit('should handle trailing pathes that look like entities gracefully /hamburg-sued-relaunch/sites/default/modules/m-gallery/test.j2', function()
            {
                const testee = new CompactIdParser(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, { useNumbers: false });
                const promise = testee.parse('/hamburg-sued-relaunch/sites/default/modules/m-gallery/test.j2').then(function(result)
                {
                    expect(result).to.be.ok;
                    expect(result.entityCategory).to.be.equal(global.fixtures.categoryModule);
                    expect(result.entityName).to.be.equal('gallery');
                    expect(result.entityNumber).to.be.equal(0);
                    expect(result.siteName).to.be.equal('default');
                });
                return promise;
            });

            it('should resolve to false when a unconfigured category is used like in x-gallery', function()
            {
                const testee = new CompactIdParser(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, { useNumbers: false });
                return expect(testee.parse('x-gallery')).to.eventually.be.equal(false);
            });
        });

        describe('useNumbers = true', function()
        {
            it('should resolve to a valid entity when given string like m001-gallery', function()
            {
                const testee = new CompactIdParser(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, { useNumbers: true });
                const promise = testee.parse('m001-gallery').then(function(result)
                {
                    expect(result).to.be.ok;
                    expect(result.entityCategory).to.be.equal(global.fixtures.categoryModule);
                    expect(result.entityName).to.be.equal('gallery');
                    expect(result.entityNumber).to.be.equal(1);
                });
                return promise;
            });

            it('should resolve to a valid category when given a string like /base/global', function()
            {
                const testee = new CompactIdParser(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, { useNumbers: true });
                const promise = testee.parse('/base/global').then(function(result)
                {
                    expect(result).to.be.ok;
                    expect(result.siteName).to.be.equal('base');
                    expect(result.entityCategory).to.be.equal(global.fixtures.categoryGlobal);
                });
                return promise;
            });

            it('should resolve to a valid entity when given a full compact id like /base/module-groups/g001-teaserlist', function()
            {
                const testee = new CompactIdParser(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, { useNumbers: true });
                const promise = testee.parse('/base/module-groups/g001-teaserlist').then(function(result)
                {
                    expect(result).to.be.ok;
                    expect(result.entityCategory).to.be.equal(global.fixtures.categoryModuleGroup);
                    expect(result.entityName).to.be.equal('teaserlist');
                    expect(result.entityNumber).to.be.equal(1);
                    expect(result.siteName).to.be.equal('base');
                });
                return promise;
            });

            it('should accept windows style slashes like \\whatever\\base\\modules\\m001-teaser\\js\\test.js', function()
            {
                const testee = new CompactIdParser(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, { useNumbers: true });
                const promise = testee.parse('\\whatever\\base\\modules\\m001-teaser\\js\\test.js').then(function(result)
                {
                    expect(result).to.be.ok;
                    expect(result.entityCategory).to.be.equal(global.fixtures.categoryModule);
                    expect(result.entityName).to.be.equal('teaser');
                    expect(result.entityNumber).to.be.equal(1);
                    expect(result.siteName).to.be.equal('base');
                });
                return promise;
            });

            it('should ignore anything around valid path like /whatever/base/modules/m001-teaser/test.j2', function()
            {
                const testee = new CompactIdParser(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, { useNumbers: true });
                const promise = testee.parse('/whatever/base/modules/m001-teaser/test.j2').then(function(result)
                {
                    expect(result).to.be.ok;
                    expect(result.entityCategory).to.be.equal(global.fixtures.categoryModule);
                    expect(result.entityName).to.be.equal('teaser');
                    expect(result.entityNumber).to.be.equal(1);
                    expect(result.siteName).to.be.equal('base');
                });
                return promise;
            });

            it('should resolve to false when a unconfigured category is used like in x001-teaser', function()
            {
                const testee = new CompactIdParser(global.fixtures.sitesRepository, global.fixtures.categoriesRepository, { useNumbers: true });
                return expect(testee.parse('x001-teaser')).to.eventually.be.equal(false);
            });
        });
    });
});
