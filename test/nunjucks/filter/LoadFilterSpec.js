'use strict';

/**
 * Requirements
 */
const LoadFilter = require(ES_SOURCE + '/nunjucks/filter/LoadFilter.js').LoadFilter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const sinon = require('sinon');

/**
 * Spec
 */
describe(LoadFilter.className, function() {
    /**
     * Filter Test
     */
    filterSpec(LoadFilter, 'nunjucks.filter/LoadFilter', function(parameters) {
        return [global.fixtures.viewModelRepository];
    });

    /**
     * LoadFilter Test
     */
    beforeEach(function() {
        global.fixtures = projectFixture.createStatic();
    });

    describe('#filter()', function() {
        it('should passthrough anything that is not a string', function() {
            const testee = new LoadFilter(global.fixtures.viewModelRepository).filter();
            expect(testee()).to.be.not.ok;
            expect(testee({ hi: 'ho' })).to.be.deep.equal({ hi: 'ho' });
        });

        it('should load a json file though ViewModelRepository', function() {
            sinon.spy(global.fixtures.viewModelRepository, 'getByPath');
            const testee = new LoadFilter(global.fixtures.viewModelRepository).filter();
            const result = testee('m-teaser/default');
            expect(global.fixtures.viewModelRepository.getByPath.calledOnce).to.be.ok;
            expect(result).to.be.ok;
            expect(result.link).to.be.equal('https://www.google.com');
        });
    });
});
