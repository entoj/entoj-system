'use strict';

/**
 * Requirements
 */
const ElseIfNode = require(ES_SOURCE + '/export/ast/ElseIfNode.js').ElseIfNode;
const Node = require(ES_SOURCE + '/export/ast/Node.js').Node;
const nodeListSpec = require('./NodeListShared.js').spec;


/**
 * Spec
 */
describe(ElseIfNode.className, function()
{
    const fixture =
    {
        serialized:
        {
            type: 'ElseIfNode',
            children: [],
            condition: undefined
        }
    };

    /**
     * NodeList Test
     */
    nodeListSpec(ElseIfNode, 'export.ast/ElseIfNode', fixture);

    /**
     * IfNode Test
     */
    describe('#constructor', function()
    {
        it('should allow to prepopulate condition', function()
        {
            const condition = new Node();
            const testee = new ElseIfNode({ condition: condition });
            expect(testee.condition).to.be.equal(condition);
        });
    });


    describe('#condition', function()
    {
        it('should set parent of assigned node', function()
        {
            const testee = new ElseIfNode();
            const node1 = new Node();
            testee.condition = node1;
            expect(node1.parent).to.be.equal(testee);
        });
    });
});
