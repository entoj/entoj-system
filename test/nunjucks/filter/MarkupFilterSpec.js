'use strict';

/**
 * Requirements
 */
const MarkupFilter = require(ES_SOURCE + '/nunjucks/filter/MarkupFilter.js').MarkupFilter;
const GlobalConfiguration = require(ES_SOURCE + '/model/configuration/GlobalConfiguration.js')
    .GlobalConfiguration;
const BuildConfiguration = require(ES_SOURCE + '/model/configuration/BuildConfiguration.js')
    .BuildConfiguration;
const SystemModuleConfiguration = require(ES_SOURCE + '/configuration/SystemModuleConfiguration.js')
    .SystemModuleConfiguration;
const filterSpec = require(ES_TEST + '/nunjucks/filter/FilterShared.js').spec;

/**
 * Spec
 */
describe(MarkupFilter.className, function() {
    /**
     * Filter Test
     */
    filterSpec(MarkupFilter, 'nunjucks.filter/MarkupFilter', () => [
        new SystemModuleConfiguration(new GlobalConfiguration(), new BuildConfiguration())
    ]);

    /**
     * MarkupFilter Test
     */

    // Creates a initialized testee
    function createTestee(configuration) {
        return new MarkupFilter(
            new SystemModuleConfiguration(
                new GlobalConfiguration(configuration),
                new BuildConfiguration()
            )
        );
    }

    describe('#filter()', function() {
        it('should return a empty string when no value given', function() {
            const testee = createTestee().filter();
            expect(testee()).to.be.equal('');
            expect(testee('')).to.be.equal('');
        });

        it('should strip tags when type=plain', function() {
            const testee = createTestee().filter();
            expect(testee('<p>Hi</p>', 'plain')).to.be.equal('Hi');
        });

        it('should add tags when type=html or not set', function() {
            const testee = createTestee().filter();
            expect(testee('Hi')).to.be.equal('<p>Hi</p>\n');
            expect(testee('Hi', 'html')).to.be.equal('<p>Hi</p>\n');
        });

        it('should only add tags when give plain text and type=html', function() {
            const testee = createTestee().filter();
            expect(testee('<h1>Hi</h1>')).to.be.equal('<h1>Hi</h1>');
        });
    });
});
