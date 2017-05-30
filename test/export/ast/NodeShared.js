'use strict';

/**
 * Requirements
 * @ignore
 */
const NodeList = require(ES_SOURCE + '/export/ast/NodeList.js').NodeList;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;


/**
 * Shared Node spec
 */
function spec(type, className, fixture, prepareParameters)
{
    /**
     * Base Test
     */
    baseSpec(type, className, prepareParameters);


    /**
     * Node Test
     */
    const nodeName = className.split('/').pop();
    const createTestee = function()
    {
        let parameters = Array.from(arguments);
        if (prepareParameters)
        {
            parameters = prepareParameters(parameters);
        }
        return new type(...parameters);
    };


    describe('#next', function()
    {
        it('should return false last node', function()
        {
            const testee = createTestee();
            expect(testee.next).to.be.not.ok;
        });

        it('should return the next node', function()
        {
            const parent = new NodeList();
            const testee = createTestee();
            const next = createTestee();
            parent.children.push(testee, next);
            expect(testee.next).to.be.equal(next);
        });
    });


    describe('#previous', function()
    {
        it('should return false last node', function()
        {
            const testee = createTestee();
            expect(testee.previous).to.be.not.ok;
        });

        it('should return the previous node', function()
        {
            const parent = new NodeList();
            const testee = createTestee();
            const previous = createTestee();
            parent.children.push(previous, testee);
            expect(testee.previous).to.be.equal(previous);
        });
    });


    describe('#is', function()
    {
        it('should return true when no query was provided', function()
        {
            const testee = createTestee();
            expect(testee.is()).to.be.ok;
        });

        it('should allow to match by type', function()
        {
            const testee = createTestee();
            expect(testee.is(nodeName)).to.be.ok;
            expect(testee.is('Foo')).to.be.not.ok;
        });

        it('should allow to match by multiple types', function()
        {
            const testee = createTestee();
            expect(testee.is(['Foo', nodeName])).to.be.ok;
            expect(testee.is(['Foo', 'Bar'])).to.be.not.ok;
        });

        it('should allow to match by properties', function()
        {
            const testee = createTestee();
            testee.foo = 'bar';
            expect(testee.is(undefined, { foo: 'bar' })).to.be.ok;
            expect(testee.is(undefined, { foo: ['bar', 'foo'] })).to.be.ok;
            expect(testee.is(undefined, { bar: 'foo' })).to.be.not.ok;
            expect(testee.is(undefined, { bar: ['foo', 'baz'] })).to.be.not.ok;
        });
    });


    describe('#isChildOf', function()
    {
        it('should return false when node has no parent', function()
        {
            const testee = createTestee();
            expect(testee.isChildOf()).to.be.not.ok;
        });

        it('should return true when no query was provided', function()
        {
            const testee = createTestee();
            testee.parent = createTestee();
            expect(testee.isChildOf()).to.be.ok;
        });

        it('should allow to match by type', function()
        {
            const testee = createTestee();
            testee.parent = createTestee();
            expect(testee.isChildOf(nodeName)).to.be.ok;
            expect(testee.isChildOf('Foo')).to.be.not.ok;
        });

        it('should allow to match by property', function()
        {
            const testee = createTestee();
            testee.parent = createTestee();
            testee.parent.foo = 'bar';
            expect(testee.isChildOf(undefined, { foo: 'bar' })).to.be.ok;
            expect(testee.isChildOf(undefined, { foo: 'baz' })).to.be.not.ok;
        });

        it('should traverse up to the root node', function()
        {
            const testee = createTestee();
            testee.parent = createTestee();
            testee.parent.parent = createTestee();
            testee.parent.parent.type = 'root';
            expect(testee.isChildOf('root')).to.be.ok;
        });
    });


    describe('#find', function()
    {
        it('should return false when node does not match', function()
        {
            const testee = createTestee();
            expect(testee.find('Foo')).to.be.not.ok;
        });

        it('should return the node when it matches', function()
        {
            const testee = createTestee();
            expect(testee.find(nodeName)).to.be.equal(testee);
        });
    });


    describe('#filter', function()
    {
        it('should return a empty array when node does not match', function()
        {
            const testee = createTestee();
            expect(testee.filter('Foo')).to.be.deep.equal([]);
        });

        it('should return a array containg the node when it matches', function()
        {
            const testee = createTestee();
            expect(testee.filter(nodeName)).to.be.deep.equal([testee]);
        });
    });


    describe('#clone', function()
    {
        it('should create a new instance', function()
        {
            const testee = createTestee();
            expect(testee.clone()).to.be.not.equal(testee);
            expect(testee.clone()).to.be.instanceof(type);
        });

        it('should return a new Node that contains the same dataFields', function()
        {
            const testee = createTestee();
            testee.name = 'Igor';
            testee.dataFields.push('name');
            expect(testee.clone().serialize()).to.be.deep.equal(testee.serialize());
        });

        it('should clone nested nodes & arrays', function()
        {
            const testee = createTestee();
            testee.name = 'Igor';
            testee.dataFields.push('name');
            testee.node = createTestee();
            testee.node.name = 'Anton';
            testee.node.dataFields.push('name');
            testee.dataFields.push('node');
            testee.nodes = [createTestee()];
            testee.nodes[0].name = 'Kaputnik';
            testee.nodes[0].dataFields.push('name');
            testee.dataFields.push('nodes');
            expect(testee.clone().serialize()).to.be.deep.equal(testee.serialize());
        });
    });


    describe('#serialize', function()
    {
        it('should return a object containing all fields specified in dataFields', function()
        {
            const testee = createTestee();
            expect(testee.serialize()).to.be.deep.equal(fixture.serialized);
        });
    });
}

/**
 * Exports
 */
module.exports.spec = spec;
