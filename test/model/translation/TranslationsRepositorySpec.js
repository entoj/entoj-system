'use strict';

/**
 * Requirements
 */
const TranslationsRepository = require(ES_SOURCE + '/model/translation/TranslationsRepository.js').TranslationsRepository;
const Translation = require(ES_SOURCE + '/model/translation/Translation.js').Translation;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const repositorySpec = require(ES_TEST + '/model/RepositoryShared.js').spec;
const co = require('co');


/**
 * Spec
 */
describe(TranslationsRepository.className, function()
{
    /**
     * Repository Tests
     */
    repositorySpec(TranslationsRepository, 'model.translation/TranslationsRepository');

    /**
     * TranslationsRepository Test
     */
    const createTestee = function(items)
    {
        const result = new TranslationsRepository();
        result._items = items || [];
        return result;
    };


    describe('#getByNameAndSite', function()
    {
        it('should get a item by name', function()
        {
            const fixture = projectFixture.createStatic();
            const data =
            [
                new Translation(
                    {
                        data:
                        {
                            'name1' : 'value1',
                            'name2' : 'value2'
                        },
                        site: fixture.siteBase
                    })
            ];
            const testee = createTestee(data);
            const promise = co(function *()
            {
                expect(yield testee.getByNameAndSite('name1')).to.be.equal('value1');
                expect(yield testee.getByNameAndSite('name2')).to.be.equal('value2');
            });
            return promise;
        });

        it('should get a item by name and site', function()
        {
            const fixture = projectFixture.createStatic();
            const data =
            [
                new Translation(
                    {
                        data:
                        {
                            'name1' : 'value1',
                            'name2' : 'value2'
                        },
                        site: fixture.siteBase
                    }),
                new Translation(
                    {
                        data:
                        {
                            'name1' : 'value1ex'
                        },
                        site: fixture.siteExtended
                    })
            ];
            const testee = createTestee(data);
            const promise = co(function *()
            {
                expect(yield testee.getByNameAndSite('name1', fixture.siteExtended)).to.be.equal('value1ex');
            });
            return promise;
        });

        it('should traverse the parent sites when name was not found', function()
        {
            const fixture = projectFixture.createStatic();
            const data =
            [
                new Translation(
                    {
                        data:
                        {
                            'name1' : 'value1',
                            'name2' : 'value2'
                        },
                        site: fixture.siteBase
                    }),
                new Translation(
                    {
                        data:
                        {
                            'name1' : 'value1ex'
                        },
                        site: fixture.siteExtended
                    })
            ];
            const testee = createTestee(data);
            const promise = co(function *()
            {
                expect(yield testee.getByNameAndSite('name2', fixture.siteExtended)).to.be.equal('value2');
            });
            return promise;
        });
    });
});
