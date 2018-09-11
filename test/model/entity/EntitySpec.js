'use strict';

/**
 * Requirements
 */
const Entity = require(ES_SOURCE + '/model/entity/Entity.js').Entity;
const Site = require(ES_SOURCE + '/model/site/Site.js').Site;
const valueObjectSpec = require('../ValueObjectShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const baseSpec = require('../../BaseShared.js').spec;

/**
 * Spec
 */
describe(Entity.className, function() {
    /**
     * ValueObject Test
     */
    valueObjectSpec(Entity, 'model.entity/Entity', function(parameters) {
        parameters.unshift({ id: global.fixtures.entityImage.id });
        return parameters;
    });

    /**
     * Entity Test
     */
    beforeEach(function() {
        global.fixtures = projectFixture.createStatic();
    });

    // Simple properties
    baseSpec.assertProperty(
        new Entity({ id: global.fixtures.entityImage.id }),
        ['site'],
        undefined,
        Site
    );
    baseSpec.assertProperty(
        new Entity({ id: global.fixtures.entityImage.id }),
        ['idString'],
        undefined,
        'e-image'
    );
    baseSpec.assertProperty(
        new Entity({ id: global.fixtures.entityImage.id }),
        ['pathString'],
        undefined,
        '/base/elements/e-image'
    );
    baseSpec.assertProperty(
        new Entity({ id: global.fixtures.entityImage.id }),
        ['isGlobal'],
        undefined,
        false
    );

    describe('#dehydrate', function() {
        it('should allow to update the id', function() {
            const data = new Entity({ id: global.fixtures.entityImage.id });
            const testee = new Entity({ id: global.fixtures.entityCta.id });
            testee.dehydrate(data);
            expect(testee.id).to.be.equal(data.id);
        });
    });

    describe('.sitesChain', function() {
        it('should return the site and all sites it extends', function() {
            const id = global.fixtures.entityCta.id.clone();
            id.site = global.fixtures.siteExtended;
            const testee = new Entity({ id: id });
            expect(testee.sitesChain).to.have.length(2);
            expect(testee.sitesChain[0]).to.be.equal(global.fixtures.siteExtended);
            expect(testee.sitesChain[1]).to.be.equal(global.fixtures.siteBase);
        });
    });
});
