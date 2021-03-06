'use strict';

/**
 * Requirements
 */
const TranslationsRepository = require(ES_SOURCE + '/model/translation/TranslationsRepository.js').TranslationsRepository;
const Translation = require(ES_SOURCE + '/model/translation/Translation.js').Translation;
const dataRepositorySpec = require(ES_TEST + '/model/data/DataRepositoryShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const co = require('co');


/**
 * Spec
 */
describe(TranslationsRepository.className, function()
{
    /**
     * DataRepository Tests
     */
    dataRepositorySpec(TranslationsRepository, 'model.translation/TranslationsRepository');


    /**
     * TranslationsRepository Tests
     */
    describe('#getByNameSiteAndLanguage', function()
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
                        site: fixture.siteBase,
                        language: 'de_DE'
                    })
            ];
            const testee = new TranslationsRepository();
            testee._items = data;
            const promise = co(function *()
            {
                expect(yield testee.getByNameSiteAndLanguage('name1')).to.be.equal('value1');
                expect(yield testee.getByNameSiteAndLanguage('name2')).to.be.equal('value2');
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
                        site: fixture.siteBase,
                        language: 'de_DE'
                    }),
                new Translation(
                    {
                        data:
                        {
                            'name1' : 'value1ex'
                        },
                        site: fixture.siteExtended,
                        language: 'de_DE'
                    })
            ];
            const testee = new TranslationsRepository();
            testee._items = data;
            const promise = co(function *()
            {
                expect(yield testee.getByNameSiteAndLanguage('name1', fixture.siteExtended)).to.be.equal('value1ex');
            });
            return promise;
        });

        it('should get a item by name, site and language', function()
        {
            const fixture = projectFixture.createStatic();
            const data =
            [
                new Translation(
                    {
                        data:
                        {
                            'name1' : 'value1_de',
                            'name2' : 'value2_de'
                        },
                        site: fixture.siteBase,
                        language: 'de_DE'
                    }),
                new Translation(
                    {
                        data:
                        {
                            'name1' : 'value1_en',
                            'name2' : 'value2_en'
                        },
                        site: fixture.siteBase,
                        language: 'en_EN'
                    })
            ];
            const testee = new TranslationsRepository();
            testee._items = data;
            const promise = co(function *()
            {
                expect(yield testee.getByNameSiteAndLanguage('name1', fixture.siteBase, 'en_EN')).to.be.equal('value1_en');
                expect(yield testee.getByNameSiteAndLanguage('name1', fixture.siteBase, 'de_DE')).to.be.equal('value1_de');
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
                            'name1' : 'value1_de',
                            'name2' : 'value2_de'
                        },
                        site: fixture.siteBase,
                        language: 'de_DE'
                    }),
                new Translation(
                    {
                        data:
                        {
                            'name1' : 'value1_en',
                            'name2' : 'value2_en'
                        },
                        site: fixture.siteBase,
                        language: 'en_EN'
                    }),
                new Translation(
                    {
                        data:
                        {
                            'name1' : 'value1_ex_de'
                        },
                        site: fixture.siteExtended,
                        language: 'de_DE'
                    }),
                new Translation(
                    {
                        data:
                        {
                            'name1' : 'value1_ex_en'
                        },
                        site: fixture.siteExtended,
                        language: 'en_EN'
                    })
            ];
            const testee = new TranslationsRepository();
            testee._items = data;
            const promise = co(function *()
            {
                expect(yield testee.getByNameSiteAndLanguage('name1', fixture.siteExtended, 'en_EN')).to.be.equal('value1_ex_en');
                expect(yield testee.getByNameSiteAndLanguage('name2', fixture.siteExtended, 'en_EN')).to.be.equal('value2_en');
            });
            return promise;
        });
    });

    describe('#getByQuerySiteAndLanguage', function()
    {
        it('should get items that start with the given query', function()
        {
            const fixture = projectFixture.createStatic();
            const data =
            [
                new Translation(
                    {
                        data:
                        {
                            'group1.name1' : 'value1.1',
                            'group1.name2' : 'value1.2',
                            'group2.name1' : 'value2.1'
                        },
                        site: fixture.siteBase,
                        language: 'de_DE'
                    })
            ];
            const testee = new TranslationsRepository();
            testee._items = data;
            const promise = co(function *()
            {
                const items = yield testee.getByQuerySiteAndLanguage('group1');
                const keys = Object.keys(items);
                expect(keys).to.have.length(2);
                expect(keys).to.contain('group1.name1');
                expect(keys).to.contain('group1.name2');
                expect(items['group1.name1']).to.be.equal('value1.1');
                expect(items['group1.name2']).to.be.equal('value1.2');
            });
            return promise;
        });

        it('should get items that match a wildcard query', function()
        {
            const fixture = projectFixture.createStatic();
            const data =
            [
                new Translation(
                    {
                        data:
                        {
                            'group1.name1' : 'value1.1',
                            'group1.name2' : 'value1.2',
                            'group2.name1' : 'value2.1'
                        },
                        site: fixture.siteBase,
                        language: 'de_DE'
                    })
            ];
            const testee = new TranslationsRepository();
            testee._items = data;
            const promise = co(function *()
            {
                const items = yield testee.getByQuerySiteAndLanguage('group*.name1');
                const keys = Object.keys(items);
                expect(keys).to.have.length(2);
                expect(keys).to.contain('group1.name1');
                expect(keys).to.contain('group2.name1');
                expect(items['group1.name1']).to.be.equal('value1.1');
                expect(items['group2.name1']).to.be.equal('value2.1');
            });
            return promise;
        });
    });
});
