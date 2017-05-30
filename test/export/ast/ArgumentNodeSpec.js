'use strict';

/**
 * Requirements
 */
const ArgumentNode = require(ES_SOURCE + '/export/ast/ArgumentNode.js').ArgumentNode;
const valueNodeSpec = require('./ValueNodeShared.js').spec;


/**
 * Spec
 */
describe(ArgumentNode.className, function()
{
    /**
     * ValueNode Test
     */
    valueNodeSpec(ArgumentNode, 'export.ast/ArgumentNode',
        {
            serialized:
            {
                type: 'ArgumentNode',
                name: undefined,
                value: undefined
            }
        });


    /**
     * ArgumentNode Test
     */
    describe('#constructor', function()
    {
        it('should allow to prepopulate name', function()
        {
            const testee = new ArgumentNode({ name: 'name' });
            expect(testee.name).to.be.equal('name');
        });
    });
});
