'use strict';

/**
 * Requirements
 */
const ModelSynchronizerSitesPlugin = require(ES_SOURCE + '/watch/ModelSynchronizerSitesPlugin.js').ModelSynchronizerSitesPlugin;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const co = require('co');
const sinon = require('sinon');


/**
 * Spec
 */
describe(ModelSynchronizerSitesPlugin.className, function()
{
    /**
     * Base Test
     */
    baseSpec(ModelSynchronizerSitesPlugin, 'watch/ModelSynchronizerSitesPlugin', function(parameters)
    {
        parameters.unshift(global.fixtures.cliLogger, global.fixtures.sitesRepository, global.fixtures.entitiesRepository);
        return parameters;
    });


    /**
     * ModelSynchronizerSitesPlugin Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic();
    });


    const createTestee = function()
    {
        return new ModelSynchronizerSitesPlugin(global.fixtures.cliLogger, global.fixtures.sitesRepository, global.fixtures.entitiesRepository);
    };


    describe('#processChanges', function()
    {
        it('should invalidate sites and entities on a site change', function()
        {
            const promise = co(function *()
            {
                const testee = createTestee();
                const input =
                {
                    site:
                    {
                        add:
                        [
                            '/foo',
                            '/baz'
                        ],
                        remove:
                        [
                            '/bar'
                        ]
                    }
                };
                const sitesInvalidate = sinon.spy(global.fixtures.sitesRepository, 'invalidate');
                const entitiesInvalidate = sinon.spy(global.fixtures.entitiesRepository, 'invalidate');
                yield testee.execute(input);
                expect(sitesInvalidate.calledOnce).to.be.ok;
                expect(entitiesInvalidate.calledOnce).to.be.ok;
            });
            return promise;
        });

        it('should return a array of applied invalidations', function()
        {
            const promise = co(function *()
            {
                const testee = createTestee();
                const input =
                {
                    site:
                    {
                        add:
                        [
                            '/foo',
                            '/baz'
                        ],
                        remove:
                        [
                            '/bar'
                        ]
                    }
                };
                const result = yield testee.execute(input);
                expect(result).to.be.ok;
                expect(result).to.have.property('site');
                expect(result).to.have.property('entity');
            });
            return promise;
        });
    });
});
