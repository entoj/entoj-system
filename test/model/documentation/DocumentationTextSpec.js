'use strict';

/**
 * Requirements
 */
const DocumentationText = require(ES_SOURCE + '/model/documentation/DocumentationText.js').DocumentationText;
const DocumentationTextSection = require(ES_SOURCE + '/model/documentation/DocumentationTextSection.js').DocumentationTextSection;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const documentationSpec = require('./DocumentationShared.js').spec;


/**
 * Spec
 */
describe(DocumentationText.className, function()
{
    /**
     * Documentation Test
     */
    documentationSpec(DocumentationText, 'model.documentation/DocumentationText');

    /**
     * DocumentationText Test
     */

    // Simple properties
    baseSpec.assertProperty(new DocumentationText(), ['tokens', 'sections'], ['hey'], []);

    describe('#getByName', function()
    {
        it('should return a section by name', function()
        {
            const testee = new DocumentationText();
            const section = new DocumentationTextSection();
            section.name = 'Functional';
            testee.sections.push(section);
            expect(testee.getByName('Functional')).to.be.equal(section);
        });

        it('should return undefined when section is not found', function()
        {
            const testee = new DocumentationText();
            expect(testee.getByName('Functional')).to.be.not.ok;
        });
    });


    describe('.description', function()
    {
        it('should return the description section', function()
        {
            const testee = new DocumentationText();
            const section = new DocumentationTextSection();
            section.name = DocumentationTextSection.DESCRIPTION;
            testee.sections.push(section);
            expect(testee.description).to.be.equal(section);
        });

        it('should return undefined when section is not found', function()
        {
            const testee = new DocumentationText();
            expect(testee.description).to.be.not.ok;
        });
    });


    describe('.functional', function()
    {
        it('should return the functional section', function()
        {
            const testee = new DocumentationText();
            const section = new DocumentationTextSection();
            section.name = DocumentationTextSection.FUNCTIONAL;
            testee.sections.push(section);
            expect(testee.functional).to.be.equal(section);
        });

        it('should return undefined when section is not found', function()
        {
            const testee = new DocumentationText();
            expect(testee.functional).to.be.not.ok;
        });
    });


    describe('#getTokens', function()
    {
        it('should return all tokens', function()
        {
            const testee = new DocumentationText();
            testee.tokens.push('one');
            testee.tokens.push('two');
            expect(testee.getTokens()).to.be.deep.equal(['one', 'two']);
        });

        it('should allow to skip tokens', function()
        {
            const testee = new DocumentationText();
            testee.tokens.push('one');
            testee.tokens.push('two');
            testee.tokens.push('three');
            expect(testee.getTokens(2)).to.be.deep.equal(['three']);
        });

        it('should return a empty array when no tokens found', function()
        {
            const testee = new DocumentationText();
            testee.tokens.push('one');
            testee.tokens.push('two');
            expect(testee.getTokens(10)).to.be.deep.equal([]);
        });
    });
});
