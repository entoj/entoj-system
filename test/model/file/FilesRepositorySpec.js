'use strict';

/**
 * Requirements
 */
const FilesRepository = require(ES_SOURCE + '/model/file/FilesRepository.js').FilesRepository;
const ContentType = require(ES_SOURCE + '/model/ContentType.js').ContentType;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const co = require('co');

/**
 * Spec
 */
describe(FilesRepository.className, function() {
    /**
     * Base Test
     */
    baseSpec(FilesRepository, 'model.file/FilesRepository', function(parameters) {
        parameters.unshift(global.fixtures.entitiesRepository);
        return parameters;
    });

    /**
     * FilesRepository Test
     */
    beforeEach(function() {
        global.fixtures = projectFixture.createStatic();
        global.fixtures.entityTeaser.properties.set('base', { groups: { css: 'core' } });
        global.fixtures.entityTeaserlist.properties.set('base', { groups: { css: 'core' } });
    });

    describe('#getBySite', function() {
        it('should return a promise', function() {
            const testee = new FilesRepository(global.fixtures.entitiesRepository);
            const promise = testee.getBySite();
            expect(promise).to.be.instanceof(Promise);
            return promise;
        });

        it('should resolve to a array', function() {
            const promise = co(function*() {
                const testee = new FilesRepository(global.fixtures.entitiesRepository);
                const files = yield testee.getBySite();
                expect(files).to.be.instanceof(Array);
            });
            return promise;
        });

        it('should resolve to an array containing all files of the given site', function() {
            const promise = co(function*() {
                const testee = new FilesRepository(global.fixtures.entitiesRepository);
                const files = yield testee.getBySite(global.fixtures.siteBase);
                expect(files).to.be.instanceof(Array);
                expect(files.length).to.be.equal(37);
            });
            return promise;
        });

        it('should allow to apply a filter to the found files', function() {
            const promise = co(function*() {
                const testee = new FilesRepository(global.fixtures.entitiesRepository);
                const files = yield testee.getBySite(
                    global.fixtures.siteBase,
                    (file) => file.contentType == ContentType.JINJA
                );
                expect(files).to.be.instanceof(Array);
                expect(files.length).to.be.equal(13);
            });
            return promise;
        });
    });

    describe('#getBySiteGrouped', function() {
        it('should return a promise', function() {
            const testee = new FilesRepository(global.fixtures.entitiesRepository);
            const promise = testee.getBySiteGrouped();
            expect(promise).to.be.instanceof(Promise);
            return promise;
        });

        it('should resolve to a object', function() {
            const promise = co(function*() {
                const testee = new FilesRepository(global.fixtures.entitiesRepository);
                const files = yield testee.getBySiteGrouped();
                expect(files).to.be.ok;
            });
            return promise;
        });

        it('should resolve to an object containing all files of the given site grouped by the given property', function() {
            const promise = co(function*() {
                const testee = new FilesRepository(global.fixtures.entitiesRepository);
                const files = yield testee.getBySiteGrouped(
                    global.fixtures.siteBase,
                    false,
                    'groups.css',
                    'common'
                );
                expect(files.common).to.be.instanceof(Array);
                expect(files.common).to.have.length(27);
                expect(files.core).to.be.instanceof(Array);
                expect(files.core).to.have.length(10);
            });
            return promise;
        });

        it('should allow to apply a filter to the found files', function() {
            const promise = co(function*() {
                const testee = new FilesRepository(global.fixtures.entitiesRepository);
                const files = yield testee.getBySiteGrouped(
                    global.fixtures.siteBase,
                    (file) => file.contentType == ContentType.JINJA,
                    'groups.css',
                    'common'
                );
                expect(files.common).to.be.instanceof(Array);
                expect(files.common).to.have.length(9);
                expect(files.core).to.be.instanceof(Array);
                expect(files.core).to.have.length(4);
            });
            return promise;
        });
    });
});
