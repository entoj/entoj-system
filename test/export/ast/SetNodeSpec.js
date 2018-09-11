'use strict';

/**
 * Requirements
 */
const SetNode = require(ES_SOURCE + '/export/ast/SetNode.js').SetNode;
const Node = require(ES_SOURCE + '/export/ast/Node.js').Node;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const valueNodeSpec = require('./ValueNodeShared.js').spec;

/**
 * Spec
 */
describe(SetNode.className, function() {
    /**
     * Node Test
     */
    valueNodeSpec(SetNode, 'export.ast/SetNode', {
        serialized: {
            type: 'SetNode',
            value: undefined,
            variable: undefined
        }
    });

    /**
     * SetNode tests
     */
    baseSpec.assertProperty(new SetNode(), ['variable'], new Node(), undefined);

    describe('#constructor', function() {
        it('should allow to prepopulate variable', function() {
            const variable = new Node();
            const testee = new SetNode({ variable: variable });
            expect(testee.variable).to.be.equal(variable);
        });
    });

    describe('#value', function() {
        it('should set parent of assigned node', function() {
            const testee = new SetNode();
            const node1 = new Node();
            testee.variable = node1;
            expect(node1.parent).to.be.equal(testee);
        });
    });
});
