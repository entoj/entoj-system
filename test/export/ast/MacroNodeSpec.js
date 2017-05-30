'use strict';

/**
 * Requirements
 */
const MacroNode = require(ES_SOURCE + '/export/ast/MacroNode.js').MacroNode;
const Node = require(ES_SOURCE + '/export/ast/Node.js').Node;
const nodeListSpec = require('./NodeListShared.js').spec;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;


/**
 * Spec
 */
describe(MacroNode.className, function()
{
    /**
     * NodeList Test
     */
    nodeListSpec(MacroNode, 'export.ast/MacroNode',
        {
            serialized:
            {
                type: 'MacroNode',
                name: undefined,
                parameters: [],
                children: []
            }
        });


    /**
     * MacroNode Test
     */
    baseSpec.assertProperty(new MacroNode(), ['name'], 'name', undefined);

    describe('#constructor', function()
    {
        it('should allow to prepopulate name and parameters', function()
        {
            const parameters = [new Node()];
            const testee = new MacroNode({ name: 'name', parameters: parameters });
            expect(testee.name).to.be.equal('name');
            expect(testee.parameters).to.have.length(1);
            expect(testee.parameters).to.contain(parameters[0]);
        });
    });

    describe('#parameters', function()
    {
        it('should set parent of added parameters', function()
        {
            const testee = new MacroNode();
            const parameter = new Node();
            testee.parameters.push(parameter);
            expect(parameter.parent).to.be.equal(testee);
        });
    });
});
