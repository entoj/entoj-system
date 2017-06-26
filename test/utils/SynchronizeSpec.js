'use strict';

/**
 * Requirements
 */
const synchronize = require(ES_SOURCE + '/utils/synchronize.js').synchronize;
const execute = require(ES_SOURCE + '/utils/synchronize.js').execute;
const waitForPromise = require(ES_SOURCE + '/utils/synchronize.js').waitForPromise;


/**
 * Spec
 */
describe('utils/synchronize', function()
{
    class Testee
    {
        constructor()
        {
            this._property = 'Testee';
        }

        get property()
        {
            return this._property;
        }

        set property(value)
        {
            this._property = value;
        }

        async()
        {
            return Promise.resolve('Async');
        }

        sync()
        {
            return 'Sync';
        }
    }


    describe('#waitForPromise', function()
    {
        it('should return the goven value if not a promise', function()
        {
            const testee = waitForPromise('foo-bar');
            expect(testee).to.be.equal('foo-bar');
        });

        it('should wait for a Promise and return its resolved value', function()
        {
            const testee = waitForPromise(Promise.resolve('foo'));
            expect(testee).to.be.equal('foo');
        });

        it('should wait for a Promise and return undefined if it was rejected', function()
        {
            const testee = waitForPromise(Promise.reject('foo'));
            expect(testee).to.be.undefined;
        });
    });


    describe('#execute', function()
    {
        it('should execute a method and wait for the returned promise', function()
        {
            const testee = new Testee();
            expect(execute(testee, 'async')).to.be.equal('Async');
        });

        it('should execute a method and return result', function()
        {
            const testee = new Testee();
            expect(execute(testee, 'sync')).to.be.equal('Sync');
        });
    });


    describe('#synchronize', function()
    {
        it('should synchronize methods returning a Promise', function()
        {
            const testee = synchronize(new Testee());
            expect(testee.async()).to.be.equal('Async');
        });

        it('should pass through methods returning anything else than a Promise', function()
        {
            const testee = synchronize(new Testee());
            expect(testee.sync()).to.be.equal('Sync');
        });

        it('should pass through property access', function()
        {
            const testee = synchronize(new Testee());
            expect(testee.property).to.be.equal('Testee');
            testee._property = 'Changed';
            expect(testee.property).to.be.equal('Changed');
        });
    });
});
