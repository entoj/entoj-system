'use strict';

/**
 * Requirements
 */
const EntityCategoriesLoader = require(ES_SOURCE + '/model/entity/EntityCategoriesLoader.js')
    .EntityCategoriesLoader;
const GlobalConfiguration = require(ES_SOURCE + '/model/configuration/GlobalConfiguration.js')
    .GlobalConfiguration;
const BuildConfiguration = require(ES_SOURCE + '/model/configuration/BuildConfiguration.js')
    .BuildConfiguration;
const SystemModuleConfiguration = require(ES_SOURCE + '/configuration/SystemModuleConfiguration.js')
    .SystemModuleConfiguration;
const loaderSpec = require('../LoaderShared.js').spec;
const co = require('co');

/**
 * Spec
 * @todo Add a way to load categories from the fs via entoj.json
 */
describe(EntityCategoriesLoader.className, function() {
    /**
     * Loader Test
     */
    loaderSpec(EntityCategoriesLoader, 'model.entity/EntityCategoriesLoader', prepareParameters);
    function prepareParameters(parameters) {
        parameters.unshift(
            new SystemModuleConfiguration(new GlobalConfiguration(), new BuildConfiguration())
        );
        return parameters;
    }

    /**
     * EntityCategoriesLoader
     */
    describe('#load', function() {
        it('should resolve to EntityCategory instances that are configurable via categories', function() {
            const testee = new EntityCategoriesLoader(
                new SystemModuleConfiguration(
                    new GlobalConfiguration({
                        system: {
                            entity: {
                                categories: [
                                    {
                                        longName: 'Element'
                                    },
                                    {
                                        longName: 'Common',
                                        pluralName: 'Common'
                                    }
                                ]
                            }
                        }
                    }),
                    new BuildConfiguration()
                )
            );
            const promise = co(function*() {
                const items = yield testee.load();
                expect(items.length).to.be.equal(2);
                expect(items.find((item) => item.longName === 'Element')).to.be.ok;
                expect(items.find((item) => item.longName === 'Common')).to.be.ok;
            });
            return promise;
        });
    });
});
