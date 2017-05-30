'use strict';

/**
 * Requirements
 */
const IfNode = require(ES_SOURCE + '/export/ast/IfNode.js').IfNode;
const Node = require(ES_SOURCE + '/export/ast/Node.js').Node;
const nodeListSpec = require('./NodeListShared.js').spec;
//const baseSpec = require(ES_TEST + '/BaseShared.js').spec;


/**
 * Spec
 */
describe(IfNode.className, function()
{
    const fixture =
    {
        serialized:
        {
            type: 'IfNode',
            children: [],
            elseChildren: [],
            condition: undefined
        }
    };

    /**
     * NodeList Test
     */
    nodeListSpec(IfNode, 'export.ast/IfNode', fixture);

    /**
     * IfNode Test
     */
    describe('#constructor', function()
    {
        it('should allow to prepopulate condition and elseChildren', function()
        {
            const condition = new Node();
            const elseChildren = [new Node()];
            const testee = new IfNode({ condition: condition, elseChildren: elseChildren });
            expect(testee.condition).to.be.equal(condition);
            expect(testee.elseChildren).to.have.length(1);
            expect(testee.elseChildren).to.contain(elseChildren[0]);
        });
    });


    describe('#condition', function()
    {
        it('should set parent of assigned node', function()
        {
            const testee = new IfNode();
            const node1 = new Node();
            testee.condition = node1;
            expect(node1.parent).to.be.equal(testee);
        });
    });


    describe('#elseChildren', function()
    {
        it('should set parent of all added nodes', function()
        {
            const testee = new IfNode();
            const node1 = new Node();
            const node2 = new Node();
            testee.elseChildren.push(node1, node2);
            expect(node1.parent).to.be.equal(testee);
            expect(node2.parent).to.be.equal(testee);
        });
    });
});
