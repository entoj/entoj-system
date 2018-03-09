'use strict';

/**
 * Requirements
 */
const ModelSynchronizerEntitiesPlugin = require(ES_SOURCE + '/watch/ModelSynchronizerEntitiesPlugin.js').ModelSynchronizerEntitiesPlugin;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const co = require('co');
const sinon = require('sinon');


/**
 * Spec
 */
describe(ModelSynchronizerEntitiesPlugin.className, function()
{
    /**
     * Base Test
     */
    baseSpec(ModelSynchronizerEntitiesPlugin, 'watch/ModelSynchronizerEntitiesPlugin', function(parameters)
    {
        parameters.unshift(global.fixtures.cliLogger, global.fixtures.entitiesRepository);
        return parameters;
    });


    /**
     * ModelSynchronizerEntitiesPlugin Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic();
    });


    const createTestee = function()
    {
        return new ModelSynchronizerEntitiesPlugin(global.fixtures.cliLogger, global.fixtures.entitiesRepository);
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
                    entity:
                    {
                        add:
                        [
                            '/base/modules/m-test'
                        ],
                        remove:
                        [
                            '/base/elements/e-cta'
                        ]
                    }
                };
                const entitiesInvalidate = sinon.spy(global.fixtures.entitiesRepository, 'invalidate');
                yield testee.execute(input);
                expect(entitiesInvalidate.calledOnce).to.be.ok;
                expect(entitiesInvalidate.calledWith(input.entity)).to.be.ok;
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
                    entity:
                    {
                        add:
                        [
                            '/base/modules/m-test'
                        ],
                        remove:
                        [
                            '/base/elements/e-cta'
                        ]
                    }
                };
                const result = yield testee.execute(input);
                expect(result).to.be.ok;
                expect(result).to.have.property('entity');
            });
            return promise;
        });
    });
});
