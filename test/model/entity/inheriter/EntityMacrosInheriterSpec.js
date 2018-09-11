'use strict';

/**
 * Requirements
 */
const EntityMacrosInheriter = require(ES_SOURCE +
    '/model/entity/inheriter/EntityMacrosInheriter.js').EntityMacrosInheriter;
const EntityAspect = require(ES_SOURCE + '/model/entity/EntityAspect.js').EntityAspect;
const DocumentationCallable = require(ES_SOURCE + '/model/documentation/DocumentationCallable.js')
    .DocumentationCallable;
const ContentKind = require(ES_SOURCE + '/model/ContentKind.js').ContentKind;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');

/**
 * Spec
 */
describe(EntityMacrosInheriter.className, function() {
    /**
     * Base Test
     */
    baseSpec(EntityMacrosInheriter, 'model.entity.inheriter/EntityMacrosInheriter');

    /**
     * EntityMacrosInheriter Test
     */
    beforeEach(function() {
        global.fixtures = projectFixture.createStatic();
    });

    describe('#inherit', function() {
        it('should add all examples of the aspect site', function() {
            const docs = [
                new DocumentationCallable({
                    name: 'm1',
                    site: global.fixtures.siteBase,
                    contentKind: ContentKind.MACRO
                }),
                new DocumentationCallable({
                    name: 'm1',
                    site: global.fixtures.siteExtended,
                    contentKind: ContentKind.MACRO
                })
            ];
            const testee = new EntityMacrosInheriter();
            const entity = global.fixtures.entityImage;
            const aspect = new EntityAspect(global.fixtures.entityImage, global.fixtures.siteBase);
            const sites = [global.fixtures.siteBase];
            entity.documentation.load(docs);
            testee.inherit(sites, entity, aspect);
            expect(aspect.documentation).to.have.length(1);
        });
    });
});
