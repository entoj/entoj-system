'use strict';

/**
 * Requirements
 * @ignore
 */
const Node = require(ES_SOURCE + '/export/ast/Node.js').Node;
const nodeSpec = require(ES_TEST + '/export/ast/NodeShared.js').spec;

/**
 * Shared Node spec
 */
function spec(type, className, fixture, prepareParameters) {
    /**
     * Node Test
     */
    nodeSpec(type, className, fixture, prepareParameters);

    /**
     * NodeList Test
     */
    const createTestee = function() {
        let parameters = Array.from(arguments);
        if (prepareParameters) {
            parameters = prepareParameters(parameters);
        }
        return new type(...parameters);
    };

    describe('#constructor', function() {
        it('should allow to prepopulate children', function() {
            const node1 = new Node();
            const testee = createTestee({ children: [node1] });
            expect(testee.children).to.have.length(1);
            expect(testee.children).to.include.members([node1]);
        });
    });

    describe('#children', function() {
        it('should set parent of all added nodes to itself', function() {
            const testee = createTestee();
            const node1 = new Node();
            const node2 = new Node();
            testee.children.push(node1, node2);
            expect(node1.parent).to.be.equal(testee);
            expect(node2.parent).to.be.equal(testee);
        });
    });

    describe('#find', function() {
        it('should return a matching child node', function() {
            const testee = createTestee();
            testee.children.push(new Node());
            expect(testee.find('Node')).to.be.equal(testee.children[0]);
        });
    });

    describe('#filter', function() {
        it('should return matching child nodes', function() {
            const testee = createTestee();
            const node1 = new Node();
            const node2 = new Node();
            testee.children.push(node1, node2);
            const nodes = testee.filter('Node');
            expect(nodes).to.have.length(2);
            expect(testee.children).to.include.members([node1, node2]);
        });
    });

    describe('#remove', function() {
        it('should remove a existing node', function() {
            const testee = createTestee();
            const node1 = new Node();
            const node2 = new Node();
            testee.children.push(node1, node2);
            testee.remove(node1);
            expect(testee.children).to.have.length(1);
            expect(testee.children).to.not.include.members([node1]);
            expect(testee.children).to.include.members([node2]);
        });

        it('should remove nodes from whole tree', function() {
            const testee = createTestee();
            const node1 = createTestee();
            const node1_1 = new Node();
            const node1_2 = new Node();
            testee.children.push(node1);
            node1.children.push(node1_1, node1_2);
            testee.remove(node1_1);
            expect(node1.children).to.have.length(1);
            expect(node1.children).to.not.include.members([node1_1]);
            expect(node1.children).to.include.members([node1_2]);
        });
    });

    describe('#replace', function() {
        it('should replace a existing node', function() {
            const testee = createTestee();
            const node1 = new Node();
            const node2 = new Node();
            testee.children.push(node1);
            testee.replace(node1, node2);
            expect(testee.children).to.have.length(1);
            expect(testee.children).to.not.include.members([node1]);
            expect(testee.children).to.include.members([node2]);
        });

        it('should replace nodes in the whole tree', function() {
            const testee = createTestee();
            const node1 = createTestee();
            const node1_1 = new Node();
            const node1_2 = new Node();
            testee.children.push(node1);
            node1.children.push(node1_1);
            testee.replace(node1_1, node1_2);
            expect(node1.children).to.have.length(1);
            expect(node1.children).to.not.include.members([node1_1]);
            expect(node1.children).to.include.members([node1_2]);
        });
    });
}

/**
 * Exports
 */
module.exports.spec = spec;
