'use strict';

/**
 * Requirements
 */
const BlockNode = require(ES_SOURCE + '/export/ast/BlockNode.js').BlockNode;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const nodeSpec = require('./NodeShared.js').spec;

/**
 * Spec
 */
describe(BlockNode.className, function() {
    /**
     * Node Test
     */
    nodeSpec(BlockNode, 'export.ast/BlockNode', {
        serialized: {
            type: 'BlockNode',
            name: undefined,
            children: []
        }
    });

    /**
     * BlockNode tests
     */
    baseSpec.assertProperty(new BlockNode(), ['name'], 'name', undefined);

    describe('#constructor', function() {
        it('should allow to prepopulate name', function() {
            const testee = new BlockNode({ name: 'name' });
            expect(testee.name).to.be.equal('name');
        });
    });
});
