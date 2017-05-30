'use strict';

/**
 * Requirements
 * @ignore
 */
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const sinon = require('sinon');
const co = require('co');


/**
 * Shared LoaderPlugin spec
 */
function spec(type, className, prepareParameters)
{
    /**
     * Base Test
     */
    baseSpec(type, className, prepareParameters);


    /**
     * LoaderPlugin Test
     */
    const createTestee = function()
    {
        let parameters = Array.from(arguments);
        if (prepareParameters)
        {
            parameters = prepareParameters(parameters);
        }
        return new type(...parameters);
    };


    describe('#execute', function()
    {
        it('should execute executeFor for the given Entity', function()
        {
            const fixture = projectFixture.createStatic();
            const item = fixture.entityTeaser;
            const testee = createTestee();
            sinon.spy(testee, 'executeFor');
            const promise = co(function *()
            {
                yield testee.execute(item);
                expect(testee.executeFor.calledOnce).to.be.ok;
            });
            return promise;
        });

        it('should execute executeFor for the given Site', function()
        {
            const fixture = projectFixture.createStatic();
            const item = fixture.siteBase;
            const testee = createTestee();
            sinon.spy(testee, 'executeFor');
            const promise = co(function *()
            {
                yield testee.execute(item);
                expect(testee.executeFor.calledOnce).to.be.ok;
            });
            return promise;
        });

        it('should execute executeFor for each site that uses the item', function()
        {
            const fixture = projectFixture.createStatic();
            const item = fixture.entityTeaser;
            item.usedBy.push(fixture.siteExtended);
            const testee = createTestee();
            sinon.spy(testee, 'executeFor');
            const promise = co(function *()
            {
                yield testee.execute(item);
                expect(testee.executeFor.calledTwice).to.be.ok;
            });
            return promise;
        });
    });
}

/**
 * Exports
 */
module.exports.spec = spec;
