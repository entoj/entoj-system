'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require(ES_SOURCE + '/Base.js').Base;
const waitForResolved = require(ES_SOURCE + '/utils/synchronize.js').waitForResolved;
const co = require('co');


/**
 * Spec
 */
function spec(type, className, createInstance)
{
    // Creates a fully initialized test subject
    const createTestee = function()
    {
        if (createInstance)
        {
            return createInstance();
        }
        return Promise.resolve(new type());
    };


    /**
     * @param  {Mixed} value
     * @param  {Mixed} defaulValue
     */
    spec.defaultValue = function(value, defaulValue)
    {
        return (typeof value === 'undefined') ? defaulValue : value;
    };


    /**
     * Helper for testing simple getter/setter
     * @param  {Instance} testee
     * @param  {String} name
     * @param  {Mixed} value
     * @param  {Mixed} defaulValue
     */
    spec.assertProperty = function(testee, name, value, defaulValue)
    {
        const instance = waitForResolved(testee);
        const prefix = instance instanceof Base ? '.' : '#';
        const names = Array.isArray(name) ? name : [name];
        for (const propertyName of names)
        {
            describe(prefix + propertyName, function()
            {
                if (typeof value === 'undefined' &&
                    typeof defaulValue === 'undefined')
                {
                    it('should exist', function()
                    {
                        expect(instance[propertyName]).to.be.ok;
                    });
                }

                if (typeof defaulValue === 'function' && defaulValue.className)
                {
                    it('should be of type ' + defaulValue.className, function()
                    {
                        expect(instance[propertyName]).to.be.instanceof(defaulValue);
                    });
                }
                else if (typeof defaulValue !== 'undefined')
                {
                    it('should have a default value', function()
                    {
                        expect(instance[propertyName]).to.be.deep.equal(defaulValue);
                    });
                }

                if (typeof value !== 'undefined')
                {
                    it('should allow to read & write a value', function()
                    {
                        instance[propertyName] = value;
                        expect(instance[propertyName]).to.be.deep.equal(value);
                    });
                }
                else
                {
                    it('should be readonly', function()
                    {
                        expect(() => instance[propertyName] = value).to.throw();
                    });
                }
            });
        }
    };


    describe('.className', function()
    {
        it('should return the namespaced class name', function()
        {
            const testee = type;
            expect(testee.className).to.be.equal(className);
        });
    });


    describe('.injections', function()
    {
        it('should return dependecies', function()
        {
            const testee = type;
            expect(testee.injections).to.be.ok;
        });
    });


    describe('#className', function()
    {
        it('should return the namespaced class name', function()
        {
            const promise = co(function *()
            {
                const testee = yield createTestee();
                expect(testee.className).to.be.equal(className);
            });
            return promise;
        });
    });


    describe('#instanceId', function()
    {
        it('should return a unique instance id', function()
        {
            const promise = co(function *()
            {
                const testee = yield createTestee();
                const other = yield createTestee();
                expect(testee.instanceId).to.be.ok;
                expect(other.instanceId).to.be.ok;
                expect(testee.instanceId).to.be.not.equal(other.instanceId);
            });
            return promise;
        });
    });


    describe('#logger', function()
    {
        it('should return a intel logger instance', function()
        {
            const promise = co(function *()
            {
                const testee = yield createTestee();
                expect(testee.logger).to.be.ok;
            });
            return promise;
        });
    });


    describe('#toString()', function()
    {
        it('should return a string representation that contains the class name', function()
        {
            const promise = co(function *()
            {
                const testee = yield createTestee();
                expect(testee.toString()).to.contain(className);
            });
            return promise;
        });
    });
}


/**
 * Api
 * @ignore
 */
module.exports.spec = spec;
