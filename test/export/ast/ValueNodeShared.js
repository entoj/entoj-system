'use strict';

/**
 * Requirements
 * @ignore
 */
const Node = require(ES_SOURCE + '/export/ast/Node.js').Node;
const nodeSpec = require(ES_TEST + '/export/ast/NodeShared.js').spec;

/**
 * Shared ValueNode spec
 */
function spec(type, className, fixture, prepareParameters) {
    /**
     * Node Test
     */
    const nodeName = className.split('/').pop();
    const defaultFixture = {
        serialized: {
            type: nodeName,
            value: undefined
        }
    };
    nodeSpec(type, className, fixture || defaultFixture, prepareParameters);

    /**
     * ValueNode tests
     */
    describe('#constructor', function() {
        it('should allow to prepopulate value', function() {
            const value = new Node();
            const testee = new type({ value: value });
            expect(testee.value).to.be.equal(value);
        });
    });

    describe('#value', function() {
        it('should set parent of assigned node', function() {
            const testee = new type();
            const node1 = new Node();
            testee.value = node1;
            expect(node1.parent).to.be.equal(testee);
        });
    });
}

/**
 * Exports
 */
module.exports.spec = spec;
