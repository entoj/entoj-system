'use strict';

/**
 * Requirements
 */
const ParameterNode = require(ES_SOURCE + '/export/ast/ParameterNode.js').ParameterNode;
const valueNodeSpec = require('./ValueNodeShared.js').spec;


/**
 * Spec
 */
describe(ParameterNode.className, function()
{
    /**
     * ValueNode Test
     */
    valueNodeSpec(ParameterNode, 'export.ast/ParameterNode',
        {
            serialized:
            {
                type: 'ParameterNode',
                name: undefined,
                value: undefined
            }
        });


    /**
     * ParameterNode Test
     */
    describe('#constructor', function()
    {
        it('should allow to prepopulate name', function()
        {
            const testee = new ParameterNode({ name: 'name' });
            expect(testee.name).to.be.equal('name');
        });
    });
});
