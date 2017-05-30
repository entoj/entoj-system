'use strict';

/**
 * Requirements
 */
const EntityCategoriesLoader = require(ES_SOURCE + '/model/entity/EntityCategoriesLoader.js').EntityCategoriesLoader;
const loaderSpec = require('../LoaderShared.js').spec;
const co = require('co');


/**
 * Spec
 * @todo Add a way to load categories from the fs via entoj.json
 */
describe(EntityCategoriesLoader.className, function()
{
    /**
     * Loader Test
     */
    loaderSpec(EntityCategoriesLoader, 'model.entity/EntityCategoriesLoader');


    /**
     * EntityCategoriesLoader
     */
    describe('#load', function()
    {
        it('should resolve to EntityCategory instances that are configurable via categories', function()
        {
            const testee = new EntityCategoriesLoader(
                [
                    {
                        longName: 'Element'
                    },
                    {
                        longName: 'Common',
                        pluralName: 'Common',
                        isGlobal: true
                    }
                ]);
            const promise = co(function *()
            {
                const items = yield testee.load();
                expect(items.length).to.be.equal(2);
                expect(items.find(item => item.longName === 'Element')).to.be.ok;
                expect(items.find(item => item.longName === 'Common')).to.be.ok;
            });
            return promise;
        });
    });
});
