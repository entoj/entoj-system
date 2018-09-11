'use strict';

/**
 * Requirements
 * @ignore
 */
const baseSpec = require('../BaseShared.js').spec;

/**
 * Shared ValueObject spec
 */
function spec(type, className, prepareParameters) {
    /**
     * Base Test
     */
    baseSpec(type, className, prepareParameters);

    /**
     * ValueObject Test
     */
    const createTestee = function() {
        let parameters = Array.from(arguments);
        if (prepareParameters) {
            parameters = prepareParameters(parameters);
        }
        return new type(...parameters);
    };

    describe('#hydrate', function() {
        it('should return a object containing all configured fields', function() {
            const testee = createTestee();
            expect(Object.keys(testee.hydrate())).to.be.deep.equal(Object.keys(testee.fields));
        });
    });

    describe('#isEqualTo', function() {
        it('should return true for same instances', function() {
            const testee = createTestee();
            expect(testee.isEqualTo(testee)).to.be.ok;
        });
    });
}

/**
 * Exports
 */
module.exports.spec = spec;
