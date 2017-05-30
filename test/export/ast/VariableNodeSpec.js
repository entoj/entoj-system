'use strict';

/**
 * Requirements
 */
const VariableNode = require(ES_SOURCE + '/export/ast/VariableNode.js').VariableNode;
const nodeSpec = require('./NodeShared.js').spec;

/**
 * Spec
 */
describe(VariableNode.className, function()
{
    /**
     * Node Test
     */
    nodeSpec(VariableNode, 'export.ast/VariableNode',
        {
            serialized:
            {
                type: 'VariableNode',
                fields: []
            }
        });


    /**
     * VariableNode tests
     */
    describe('#constructor', function()
    {
        it('should allow to prepopulate fields', function()
        {
            const fields = ['model', 'text'];
            const testee = new VariableNode({ fields: fields });
            expect(testee.fields).to.be.deep.equal(fields);
        });
    });
});
