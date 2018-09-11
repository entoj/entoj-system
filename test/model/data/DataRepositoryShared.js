'use strict';

/**
 * Requirements
 */
const Data = require(ES_SOURCE + '/model/data/Data.js').Data;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const repositorySpec = require(ES_TEST + '/model/RepositoryShared.js').spec;
const co = require('co');

/**
 * Shared DataRepository spec
 */
function spec(type, className, prepareParameters) {
    /**
     * Repository Tests
     */
    repositorySpec(type, className, prepareParameters);

    /**
     * TranslationsRepository Test
     */
    const createTestee = function(items) {
        let parameters = [];
        if (prepareParameters) {
            parameters = prepareParameters(parameters);
        }
        const result = new type(...parameters);
        result._items = items || [];
        return result;
    };

    describe('#getByNameAndSite', function() {
        it('should get a item by name', function() {
            const fixture = projectFixture.createStatic();
            const data = [
                new Data({
                    data: {
                        name1: 'value1',
                        name2: 'value2'
                    },
                    site: fixture.siteBase
                })
            ];
            const testee = createTestee(data);
            const promise = co(function*() {
                expect(yield testee.getByNameAndSite('name1')).to.be.equal('value1');
                expect(yield testee.getByNameAndSite('name2')).to.be.equal('value2');
            });
            return promise;
        });

        it('should get a item by name and site', function() {
            const fixture = projectFixture.createStatic();
            const data = [
                new Data({
                    data: {
                        name1: 'value1',
                        name2: 'value2'
                    },
                    site: fixture.siteBase
                }),
                new Data({
                    data: {
                        name1: 'value1ex'
                    },
                    site: fixture.siteExtended
                })
            ];
            const testee = createTestee(data);
            const promise = co(function*() {
                expect(yield testee.getByNameAndSite('name1', fixture.siteExtended)).to.be.equal(
                    'value1ex'
                );
            });
            return promise;
        });

        it('should traverse the parent sites when name was not found', function() {
            const fixture = projectFixture.createStatic();
            const data = [
                new Data({
                    data: {
                        name1: 'value1',
                        name2: 'value2'
                    },
                    site: fixture.siteBase
                }),
                new Data({
                    data: {
                        name1: 'value1ex'
                    },
                    site: fixture.siteExtended
                })
            ];
            const testee = createTestee(data);
            const promise = co(function*() {
                expect(yield testee.getByNameAndSite('name2', fixture.siteExtended)).to.be.equal(
                    'value2'
                );
            });
            return promise;
        });
    });
}

/**
 * Exports
 */
module.exports = spec;
module.exports.spec = spec;
