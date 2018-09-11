'use strict';

/**
 * Requirements
 */
const EntitiesRepository = require(ES_SOURCE + '/model/entity/EntitiesRepository.js')
    .EntitiesRepository;
const Entity = require(ES_SOURCE + '/model/entity/Entity.js').Entity;
const EntityAspect = require(ES_SOURCE + '/model/entity/EntityAspect.js').EntityAspect;
const repositorySpec = require('../RepositoryShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const co = require('co');

/**
 * Spec
 */
describe(EntitiesRepository.className, function() {
    repositorySpec(EntitiesRepository, 'model.entity/EntitiesRepository', function(parameters) {
        parameters.unshift(global.fixtures.project.entityIdParser);
        return parameters;
    });

    beforeEach(function() {
        global.fixtures.project = projectFixture.createStatic();
    });

    describe('#getBySite', function() {
        it('should return all entities for a given site', function() {
            const testee = global.fixtures.project.entitiesRepository;
            const promise = co(function*() {
                const entities = yield testee.getBySite(global.fixtures.project.siteBase);
                expect(entities).to.have.length(8);
                expect(entities.find((item) => item.id.name == 'cta')).to.be.ok;
                expect(entities.find((item) => item.id.name == 'teaser')).to.be.ok;
            });
            return promise;
        });

        it('should return all inherited entities for a extended site', function() {
            const testee = global.fixtures.project.entitiesRepository;
            const promise = co(function*() {
                const entities = yield testee.getBySite(global.fixtures.project.siteExtended);
                expect(entities).to.have.length(1);
                expect(entities.find((item) => item.id.name == 'image')).to.be.ok;
            });
            return promise;
        });
    });

    describe('#getByCategory', function() {
        it('should return all entities for a given category', function() {
            const testee = global.fixtures.project.entitiesRepository;
            const promise = co(function*() {
                const entities = yield testee.getByCategory(
                    global.fixtures.project.categoryElement
                );
                expect(entities).to.have.length(3);
                expect(entities.find((item) => item.id.name == 'cta')).to.be.ok;
                expect(entities.find((item) => item.id.name == 'image')).to.be.ok;
                expect(entities.find((item) => item.id.name == 'headline')).to.be.ok;
            });
            return promise;
        });
    });

    describe('#getBySiteAndCategory', function() {
        it('should return all entities for a given category in a given site', function() {
            const testee = global.fixtures.project.entitiesRepository;
            const promise = co(function*() {
                const entities = yield testee.getBySiteAndCategory(
                    global.fixtures.project.siteBase,
                    global.fixtures.project.categoryElement
                );
                expect(entities).to.have.length(3);
                expect(entities.find((item) => item.id.name == 'image')).to.be.ok;
            });
            return promise;
        });

        it('should return all entities for a given category in a given extended site', function() {
            const testee = global.fixtures.project.entitiesRepository;
            const promise = co(function*() {
                const entities = yield testee.getBySiteAndCategory(
                    global.fixtures.project.siteExtended,
                    global.fixtures.project.categoryElement
                );
                expect(entities).to.have.length(1);
                expect(entities.find((item) => item.id.name == 'image')).to.be.ok;
            });
            return promise;
        });
    });

    describe('#getById', function() {
        it('should return a entity when given a full entityId string like "/sites/base/modules/m-teaser"', function() {
            const testee = global.fixtures.project.entitiesRepository;
            const promise = co(function*() {
                const entity = yield testee.getById('/sites/base/modules/m-teaser');
                expect(entity).to.be.instanceof(EntityAspect);
                expect(entity.id.name).to.be.equal('teaser');
            });
            return promise;
        });

        it('should return a entity when given a full extended entityId string like "/sites/extended/elements/e-image"', function() {
            const testee = global.fixtures.project.entitiesRepository;
            const promise = co(function*() {
                const entity = yield testee.getById('/sites/extended/elements/e-image');
                expect(entity).to.be.instanceof(EntityAspect);
                expect(entity.id.name).to.be.equal('image');
            });
            return promise;
        });

        it('should return a entity when given a partial entityId string like "m-teaser"', function() {
            const testee = global.fixtures.project.entitiesRepository;
            const promise = co(function*() {
                const entity = yield testee.getById('m-teaser');
                expect(entity).to.be.instanceof(Entity);
                expect(entity.id.name).to.be.equal('teaser');
            });
            return promise;
        });

        it('should return a entity when given a EntityId', function() {
            const testee = global.fixtures.project.entitiesRepository;
            const promise = co(function*() {
                const entity = yield testee.getById(global.fixtures.project.entityCta.id);
                expect(entity).to.be.instanceof(EntityAspect);
                expect(entity.id.name).to.be.equal(global.fixtures.project.entityCta.id.name);
            });
            return promise;
        });

        it('should allow to specify a specific site', function() {
            const testee = global.fixtures.project.entitiesRepository;
            const promise = co(function*() {
                const entity = yield testee.getById(
                    global.fixtures.project.entityImage.id,
                    global.fixtures.project.siteExtended
                );
                expect(entity).to.be.instanceof(EntityAspect);
                expect(entity.id.site).to.be.equal(global.fixtures.project.siteExtended);
            });
            return promise;
        });
    });

    describe('#remove', function() {
        it('should allow to remove a entity', function() {
            const testee = global.fixtures.project.entitiesRepository;
            const promise = co(function*() {
                const entity = yield testee.getById('/sites/base/modules/m-teaser');
                yield testee.remove(entity);
                const entityAfter = yield testee.getById('/sites/base/modules/m-teaser');
                expect(entity).to.be.instanceof(EntityAspect);
                expect(entityAfter).to.be.not.ok;
            });
            return promise;
        });
    });
});
