'use strict';

/**
 * Requirements
 */
const createRandomNumberGenerator = require(ES_SOURCE + '/utils/random.js').createRandomNumberGenerator;


/**
 * Spec
 */
describe('utils/random', function()
{
    describe('#createRandomNumberGenerator', function()
    {
        it('should return a random value generator', function()
        {
            const generator = createRandomNumberGenerator();
            expect(generator()).to.be.not.equal(generator());
        });

        it('should allow to get a static value random generator', function()
        {
            const generator1 = createRandomNumberGenerator(true);
            const generator2 = createRandomNumberGenerator(true);
            expect(generator1()).to.be.equal(generator2());
            const sequence1 = [generator1(), generator1(), generator1()];
            const sequence2 = [generator2(), generator2(), generator2()];
            expect(sequence1).to.be.deep.equal(sequence2);
        });
    });
});
