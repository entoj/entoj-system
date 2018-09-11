'use strict';

/**
 * Requirements
 */
const EntityFilesInheriter = require(ES_SOURCE + '/model/entity/inheriter/EntityFilesInheriter.js')
    .EntityFilesInheriter;
const EntityAspect = require(ES_SOURCE + '/model/entity/EntityAspect.js').EntityAspect;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');

/**
 * Spec
 */
describe(EntityFilesInheriter.className, function() {
    /**
     * Base Test
     */
    baseSpec(EntityFilesInheriter, 'model.entity.inheriter/EntityFilesInheriter');

    /**
     * EntityMacrosInheriter Test
     */
    beforeEach(function() {
        global.fixtures = projectFixture.createStatic();
    });

    describe('#inherit', function() {
        it('should add all files of the aspect site', function() {
            const testee = new EntityFilesInheriter();
            const entity = global.fixtures.entityImage;
            const aspect = new EntityAspect(global.fixtures.entityImage, global.fixtures.siteBase);
            const sites = [global.fixtures.siteBase];
            testee.inherit(sites, entity, aspect);
            expect(aspect.files).to.have.length(12);
        });
    });
});
