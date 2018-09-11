'use strict';

/**
 * Requirements
 */
const EntityExamplesInheriter = require(ES_SOURCE +
    '/model/entity/inheriter/EntityExamplesInheriter.js').EntityExamplesInheriter;
const EntityAspect = require(ES_SOURCE + '/model/entity/EntityAspect.js').EntityAspect;
const DocumentationExample = require(ES_SOURCE + '/model/documentation/DocumentationExample.js')
    .DocumentationExample;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');

/**
 * Spec
 */
describe(EntityExamplesInheriter.className, function() {
    /**
     * Base Test
     */
    baseSpec(EntityExamplesInheriter, 'model.entity.inheriter/EntityExamplesInheriter');

    /**
     * EntityPropertiesInheriter Test
     */
    beforeEach(function() {
        global.fixtures = projectFixture.createStatic();
    });

    describe('#inherit', function() {
        it('should add all examples of the aspect site', function() {
            const docs = [
                new DocumentationExample({ site: global.fixtures.siteBase }),
                new DocumentationExample({ site: global.fixtures.siteExtended })
            ];
            const testee = new EntityExamplesInheriter();
            const entity = global.fixtures.entityImage;
            const aspect = new EntityAspect(global.fixtures.entityImage, global.fixtures.siteBase);
            const sites = [global.fixtures.siteBase];
            entity.documentation.load(docs);
            testee.inherit(sites, entity, aspect);
            expect(aspect.documentation).to.have.length(1);
        });
    });
});
