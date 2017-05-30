'use strict';

/**
 * Requirements
 */
const BaseArray = require(ES_SOURCE + '/base/BaseArray.js').BaseArray;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;


/**
 * Spec
 */
describe(BaseArray.className, function()
{
    /**
     * Base Test
     */
    baseSpec(BaseArray, 'base/BaseArray');


    /**
     * BaseArray Test
     */
    describe('#events', function()
    {
        it('should be a EventEmitter', function()
        {
            const testee = new BaseArray();
            expect(testee.events).to.be.instanceof(require('events').EventEmitter);
        });

        it('should emit a change event on push', function(cb)
        {
            const testee = new BaseArray();
            testee.events.on('change', (e) =>
            {
                cb();
            });
            testee.push('one', 'two');
        });

        it('should emit a change event on pop', function(cb)
        {
            const testee = new BaseArray();
            testee.events.on('change', (e) =>
            {
                cb();
            });
            testee.pop();
        });

        it('should emit a change event on reverse', function(cb)
        {
            const testee = new BaseArray();
            testee.events.on('change', (e) =>
            {
                cb();
            });
            testee.reverse();
        });

        it('should emit a change event on shift', function(cb)
        {
            const testee = new BaseArray();
            testee.events.on('change', (e) =>
            {
                cb();
            });
            testee.shift();
        });

        it('should emit a change event on sort', function(cb)
        {
            const testee = new BaseArray();
            testee.events.on('change', (e) =>
            {
                cb();
            });
            testee.sort();
        });

        it('should emit a change event on splice', function(cb)
        {
            const testee = new BaseArray();
            testee.events.on('change', (e) =>
            {
                cb();
            });
            testee.splice(0);
        });


        it('should emit a change event on slice', function(cb)
        {
            const testee = new BaseArray();
            testee.events.on('change', (e) =>
            {
                cb();
            });
            testee.slice(0, 1);
        });
    });

    describe('#clear()', function()
    {
        it('should remove all existing item', function()
        {
            const testee = new BaseArray();
            testee.push('one', 'two');
            expect(testee).to.have.length(2);
            testee.clear();
            expect(testee).to.have.length(0);
        });
    });

    describe('#remove()', function()
    {
        it('should allow to remove a existing item', function()
        {
            const testee = new BaseArray();
            testee.push('one', 'two');
            expect(testee).to.have.length(2);
            expect(testee.remove('two')).to.be.ok;
            expect(testee).to.have.length(1);
        });

        it('should return false when item was not found', function()
        {
            const testee = new BaseArray();
            testee.push('one', 'two');
            expect(testee.remove('three')).to.be.not.ok;
            expect(testee).to.have.length(2);
        });
    });

    describe('#replace()', function()
    {
        it('should allow to replace a existing item', function()
        {
            const testee = new BaseArray();
            testee.push('one', 'two', 'three');
            expect(testee.replace('two', 'zwei')).to.be.ok;
            expect(testee).to.have.length(3);
            expect(testee[0]).to.be.equal('one');
            expect(testee[1]).to.be.equal('zwei');
            expect(testee[2]).to.be.equal('three');
        });

        it('should return false when reference was not found', function()
        {
            const testee = new BaseArray();
            testee.push('one', 'two');
            expect(testee.replace('three', 'drei')).to.be.not.ok;
            expect(testee).to.have.length(2);
            expect(testee[0]).to.be.equal('one');
            expect(testee[1]).to.be.equal('two');
        });
    });

    describe('#insertBefore()', function()
    {
        it('should insert one element before another element', function()
        {
            const testee = new BaseArray();
            testee.push('one','three');
            expect(testee).to.have.length(2);
            testee.insertBefore(testee[1],'two');
            expect(testee).to.have.length(3);
            expect(testee[1]).to.be.equal('two');
        });

        it('should allow to insert an element at the beginning of the list', function()
        {
            const testee = new BaseArray();
            testee.push('two','three');
            expect(testee).to.have.length(2);
            testee.insertBefore(testee[0],'one');
            expect(testee).to.have.length(3);
            expect(testee[0]).to.be.equal('one');
        });
    });

    describe('#insertAfter()', function()
    {
        it('should insert one element after another element', function()
        {
            const testee = new BaseArray();
            testee.push('one','two');
            expect(testee).to.have.length(2);
            testee.insertAfter(testee[1],'three');
            expect(testee).to.have.length(3);
            expect(testee[2]).to.be.equal('three');
        });

        it('should allow to insert an element at the end of the list', function()
        {
            const testee = new BaseArray();
            testee.push('one','two');
            expect(testee).to.have.length(2);
            testee.insertAfter(testee[1],'three');
            expect(testee).to.have.length(3);
            expect(testee[2]).to.be.equal('three');
        });
    });

    describe('#load', function()
    {
        it('should allow to import a Array', function()
        {
            const testee = new BaseArray();
            const data = ['foo', 'bar'];

            testee.load(data);
            expect(testee).to.include('foo');
            expect(testee).to.include('bar');
        });

        it('should allow to import a Object', function()
        {
            const testee = new BaseArray();
            const data = { one: 'foo', two: 'bar'};

            testee.load(data);
            expect(testee).to.include('foo');
            expect(testee).to.include('bar');
        });

        it('should preserve existing items', function()
        {
            const testee = new BaseArray();
            testee.push('bar');
            const data = ['foo'];

            testee.load(data);
            expect(testee).to.include('foo');
            expect(testee).to.include('bar');
        });

        it('should allow to clear items before loading', function()
        {
            const testee = new BaseArray();
            testee.push('bar');
            const data = ['foo'];

            testee.load(data, true);
            expect(testee).to.include('foo');
            expect(testee).to.not.include('bar');
        });

        it('should do nothing when given non iterable data', function()
        {
            const testee = new BaseArray();

            testee.load(undefined);
            expect(testee.length).to.be.equal(0);
        });
    });
});
