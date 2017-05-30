'use strict';

/**
 * Requirements
 */
const DocumentationTextSection = require(ES_SOURCE + '/model/documentation/DocumentationTextSection.js').DocumentationTextSection;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const documentationSpec = require('./DocumentationShared.js').spec;


/**
 * Spec
 */
describe(DocumentationTextSection.className, function()
{
    /**
     * Documentation Test
     */
    documentationSpec(DocumentationTextSection, 'model.documentation/DocumentationTextSection');

    /**
     * DocumentationText Test
     */
    baseSpec.assertProperty(new DocumentationTextSection(), ['tokens'], ['hey'], []);

    describe('#getTokens', function()
    {
        it('should return all tokens', function()
        {
            const testee = new DocumentationTextSection();
            testee.tokens.push('one');
            testee.tokens.push('two');
            expect(testee.getTokens()).to.be.deep.equal(['one', 'two']);
        });

        it('should allow to skip tokens', function()
        {
            const testee = new DocumentationTextSection();
            testee.tokens.push('one');
            testee.tokens.push('two');
            testee.tokens.push('three');
            expect(testee.getTokens(2)).to.be.deep.equal(['three']);
        });

        it('should return a empty array when no tokens found', function()
        {
            const testee = new DocumentationTextSection();
            testee.tokens.push('one');
            testee.tokens.push('two');
            expect(testee.getTokens(10)).to.be.deep.equal([]);
        });
    });
});
