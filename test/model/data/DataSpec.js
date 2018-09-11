'use strict';

/**
 * Requirements
 */
const Data = require(ES_SOURCE + '/model/data/Data.js').Data;
const valueObjectSpec = require('../ValueObjectShared.js').spec;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;

/**
 * Spec
 */
describe(Data.className, function() {
    /**
     * ValueObject Test
     */
    valueObjectSpec(Data, 'model.data/Data');

    /**
     * Data Test
     */
    baseSpec.assertProperty(Data, ['SITE', 'ANY']);

    describe('#constructor()', function() {
        it('should allow to configure data and site', function() {
            const testee = new Data({ data: 'data', site: { name: 'Base' } });
            expect(testee.data).to.equal('data');
            expect(testee.site.name).to.equal('Base');
        });
    });

    describe('#dehydrate', function() {
        it('should allow to update data and site', function() {
            const data = new Data({ data: 'augmented', site: { name: 'Base' } });
            const testee = new Data({ data: 'data', site: { name: 'Extended' } });
            testee.dehydrate(data);
            expect(testee.data).to.be.equal(data.data);
            expect(testee.site.name).to.equal(data.site.name);
        });
    });
});
