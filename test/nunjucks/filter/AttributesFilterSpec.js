'use strict';

/**
 * Requirements
 */
const AttributesFilter = require(ES_SOURCE + '/nunjucks/filter/AttributesFilter.js')
    .AttributesFilter;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;

/**
 * Spec
 */
describe(AttributesFilter.className, function() {
    /**
     * Filter Test
     */
    filterSpec(AttributesFilter, 'nunjucks.filter/AttributesFilter');

    /**
     * AttributesFilter Test
     */
    describe('#filter()', function() {
        it('should return a empty string if no map given', function() {
            const testee = new AttributesFilter().filter();
            expect(testee()).to.be.equal('');
            expect(testee(1)).to.be.equal('');
            expect(testee(true)).to.be.equal('');
            expect(testee('boo.svg')).to.be.equal('');
        });

        it('should return a string of html attributes', function() {
            const testee = new AttributesFilter().filter();
            expect(testee({ id: 1, href: '#1' })).to.be.equal('id="1" href="#1" ');
        });

        it('should allow to prefix all attributes', function() {
            const testee = new AttributesFilter().filter();
            expect(testee({ id: 1, href: '#1' }, 'data')).to.be.equal(
                'data-id="1" data-href="#1" '
            );
        });

        it('should convert camel case of keys to kebab case', function() {
            const testee = new AttributesFilter().filter();
            expect(testee({ megaAttr: 1 })).to.be.equal('mega-attr="1" ');
        });
    });
});
