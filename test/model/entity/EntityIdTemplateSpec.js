'use strict';

/**
 * Requirements
 */
const EntityIdTemplate = require(ES_SOURCE + '/model/entity/EntityIdTemplate.js').EntityIdTemplate;
const CompactIdParser = require(ES_SOURCE + '/parser/entity/CompactIdParser.js').CompactIdParser;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const baseSpec = require('../../BaseShared.js').spec;


/**
 * Spec
 */
describe(EntityIdTemplate.className, function()
{
    baseSpec(EntityIdTemplate, 'model.entity/EntityIdTemplate', function(parameters)
    {
        parameters.unshift(global.fixtures.entityIdParser);
        return parameters;
    });


    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic();
    });


    describe('#id', function()
    {
        it('should return an empty string when no id given', function()
        {
            const testee = new EntityIdTemplate(global.fixtures.entityIdParser);
            expect(testee.id()).to.equal('');
        });

        it('should return a entity id as a string', function()
        {
            const testee = new EntityIdTemplate(global.fixtures.entityIdParser);
            expect(testee.id(global.fixtures.entityImage.id)).to.equal('e-image');
        });

        it('should return a entity id as a string for a global entity', function()
        {
            const testee = new EntityIdTemplate(global.fixtures.entityIdParser);
            expect(testee.id(global.fixtures.entityGlobal.id)).to.equal('global');
        });

        it('should derive the template from the used parser', function()
        {
            const entityIdParser = new CompactIdParser(global.fixtures.sitesRepository, global.fixtures.categoriesRepository,
                {
                    TEMPLATE_ID: '_${entityCategory.shortName.urlify()}-${entityId.name.urlify()}_'
                });
            const testee = new EntityIdTemplate(entityIdParser);
            expect(testee.id(global.fixtures.entityImage.id)).to.equal('_e-image_');
        });
    });


    describe('#path', function()
    {
        it('should return an empty string when no id given', function()
        {
            const testee = new EntityIdTemplate(global.fixtures.entityIdParser);
            expect(testee.path()).to.equal('');
        });

        it('should return a entity path as a string', function()
        {
            const testee = new EntityIdTemplate(global.fixtures.entityIdParser);
            expect(testee.path(global.fixtures.entityImage.id)).to.equal('/base/elements/e-image');
        });

        it('should return a entity path as a string for a global entity', function()
        {
            const testee = new EntityIdTemplate(global.fixtures.entityIdParser);
            expect(testee.path(global.fixtures.entityGlobal.id)).to.equal('/base/global');
        });

        it('should derive the template from the used parser', function()
        {
            const entityIdParser = new CompactIdParser(global.fixtures.sitesRepository, global.fixtures.categoriesRepository,
                {
                    TEMPLATE_ID: '${entityCategory.shortName.urlify()}-${entityId.name.urlify()}'
                });
            const testee = new EntityIdTemplate(entityIdParser);
            expect(testee.path(global.fixtures.entityImage.id)).to.equal('/base/elements/e-image');
        });
    });
});
