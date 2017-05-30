'use strict';

/**
 * Requirements
 */
const ForNode = require(ES_SOURCE + '/export/ast/ForNode.js').ForNode;
const valueNodeSpec = require('./ValueNodeShared.js').spec;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;


/**
 * Spec
 */
describe(ForNode.className, function()
{
    const fixture =
    {
        serialized:
        {
            type: 'ForNode',
            children: [],
            keyName: undefined,
            valueName: undefined,
            value: undefined
        }
    };

    /**
     * ValueNode Test
     */
    valueNodeSpec(ForNode, 'export.ast/ForNode', fixture);

    /**
     * ForNode Test
     */
    baseSpec.assertProperty(new ForNode(), ['keyName', 'valueName'], 'name', undefined);

    describe('#constructor', function()
    {
        it('should allow to prepopulate keyName and valueName', function()
        {
            const testee = new ForNode({ keyName: 'keyName', valueName: 'valueName' });
            expect(testee.keyName).to.be.equal('keyName');
            expect(testee.valueName).to.be.equal('valueName');
        });
    });
});
