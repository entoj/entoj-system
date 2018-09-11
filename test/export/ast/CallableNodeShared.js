'use strict';

/**
 * Requirements
 * @ignore
 */
const ArgumentNode = require(ES_SOURCE + '/export/ast/ArgumentNode.js').ArgumentNode;
const nodeListSpec = require(ES_TEST + '/export/ast/NodeListShared.js').spec;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;

/**
 * Shared CallableNode spec
 */
function spec(type, className, fixture, prepareParameters) {
    /**
     * NodeList Test
     */
    const nodeName = className.split('/').pop();
    const defaultFixture = {
        serialized: {
            type: nodeName,
            name: undefined,
            arguments: [],
            children: []
        }
    };
    nodeListSpec(type, className, fixture || defaultFixture, prepareParameters);

    /**
     * CallableNode tests
     */
    baseSpec.assertProperty(new type(), ['name'], 'name', undefined);

    describe('#constructor', function() {
        it('should allow to prepopulate name and parameters', function() {
            const argument = new ArgumentNode();
            const testee = new type({ name: 'name', arguments: [argument] });
            expect(testee.name).to.be.equal('name');
            expect(testee.arguments).to.contain(argument);
        });
    });

    describe('#arguments', function() {
        it('should set parent', function() {
            const testee = new type();
            const argument = new ArgumentNode();
            testee.arguments.push(argument);
            expect(argument.parent).to.be.equal(testee);
        });
    });
}

/**
 * Exports
 */
module.exports.spec = spec;
