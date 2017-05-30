'use strict';

/**
 * Requirements
 */
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const DocBlockParser = require(ES_SOURCE + '/parser/documentation/DocBlockParser.js').DocBlockParser;
const DocumentationCode = require(ES_SOURCE + '/model/documentation/DocumentationCode.js').DocumentationCode;
const DocumentationCallable = require(ES_SOURCE + '/model/documentation/DocumentationCallable.js').DocumentationCallable;
const DocumentationParameter = require(ES_SOURCE + '/model/documentation/DocumentationParameter.js').DocumentationParameter;
const DocumentationCompoundParameter = require(ES_SOURCE + '/model/documentation/DocumentationCompoundParameter.js').DocumentationCompoundParameter;
const DocumentationVariable = require(ES_SOURCE + '/model/documentation/DocumentationVariable.js').DocumentationVariable;
const DocumentationExample = require(ES_SOURCE + '/model/documentation/DocumentationExample.js').DocumentationExample;
const DocumentationClass = require(ES_SOURCE + '/model/documentation/DocumentationClass.js').DocumentationClass;
const ContentType = require(ES_SOURCE + '/model/ContentType.js').ContentType;


/**
 * Spec
 */
describe(DocBlockParser.className, function()
{
    /**
     * Base Test
     */
    baseSpec(DocBlockParser, 'parser.documentation/DocBlockParser');

    /**
     * CallParser Test
     */
    describe('#parse()', function()
    {
        it('should resolve to a DocumentationCode by default', function()
        {
            const testee = new DocBlockParser();
            const docblock = `
            {#
            #}`;
            const promise = testee.parse(docblock, { contentType: ContentType.JINJA }).then(function(documentation)
            {
                expect(documentation).to.be.instanceof(DocumentationCode);
            });
            return promise;
        });

        it('should allow to force a result type via the hint option', function()
        {
            const testee = new DocBlockParser();
            const docblock = `
            {#
            #}`;
            const promise = testee.parse(docblock, { contentType: ContentType.JINJA, hint: 'callable' }).then(function(documentation)
            {
                expect(documentation).to.be.instanceof(DocumentationCallable);
            });
            return promise;
        });

        it('should allow markdown', function()
        {
            const testee = new DocBlockParser();
            const docblock = `
            {#
                # Headline
                ## Subheadline
                > Pardon my french

                *This text will be italic*
                **This text will be bold**

                * Item1
                  * Item1.1
                * Item2

                \`\`\`
                x = 0
                x = 2 + 2
                what is x
                \`\`\`
            #}`;
            const promise = testee.parse(docblock, { contentType: ContentType.JINJA }).then(function(documentation)
            {
                expect(documentation.description).to.contain('# Headline');
                expect(documentation.description).to.contain('* Item1');
                expect(documentation.description).to.contain('  * Item1.1');
            });
            return promise;
        });

        it('should parse text, @name, @description, @namespace, @protected, @tags and @group tags per default', function()
        {
            const testee = new DocBlockParser();
            const docblock = `
            {#
                Thats a freeform description
                @name Name
                @description
                Lorem Ipsum
                @namespace test
                @protected
                @tags one, two
                @group common
            #}`;
            const promise = testee.parse(docblock, { contentType: ContentType.JINJA }).then(function(documentation)
            {
                expect(documentation).to.be.instanceof(DocumentationCode);
                expect(documentation.name).to.be.equal('Name');
                expect(documentation.description).to.contain('freeform description');
                expect(documentation.description).to.contain('Lorem Ipsum');
                expect(documentation.namespace).to.be.equal('test');
                expect(documentation.visibility).to.be.equal('protected');
                expect(documentation.tags).to.contain('one');
                expect(documentation.tags).to.contain('two');
                expect(documentation.group).to.be.equal('common');
            });
            return promise;
        });

        it('should have a default visibility of public', function()
        {
            const testee = new DocBlockParser();
            const docblock = `
            {#
            #}`;
            const promise = testee.parse(docblock, { contentType: ContentType.JINJA }).then(function(documentation)
            {
                expect(documentation.visibility).to.be.equal('public');
            });
            return promise;
        });

        it('should ignore any docblock that contains @ignore', function()
        {
            const testee = new DocBlockParser();
            const docblock = `
            {#
                @ignore
            #}`;
            const promise = testee.parse(docblock, { contentType: ContentType.JINJA }).then(function(documentation)
            {
                expect(documentation).to.be.not.ok;
            });
            return promise;
        });

        it('should resolve to a DocumentationCallable when finding a @param', function()
        {
            const testee = new DocBlockParser();
            const docblock = `
            {#
                @param Name
            #}`;
            const promise = testee.parse(docblock, { contentType: ContentType.JINJA }).then(function(documentation)
            {
                expect(documentation).to.be.instanceof(DocumentationCallable);
            });
            return promise;
        });

        it('should resolve to a DocumentationCallable when finding a @function', function()
        {
            const testee = new DocBlockParser();
            const docblock = `
            {#
                @function
            #}`;
            const promise = testee.parse(docblock, { contentType: ContentType.JINJA }).then(function(documentation)
            {
                expect(documentation).to.be.instanceof(DocumentationCallable);
            });
            return promise;
        });

        it('should resolve to a DocumentationCallable when finding a @kind function', function()
        {
            const testee = new DocBlockParser();
            const docblock = `
            /**
             * @kind function
             */`;
            const promise = testee.parse(docblock, { contentType: ContentType.SASS }).then(function(documentation)
            {
                expect(documentation).to.be.instanceof(DocumentationCallable);
            });
            return promise;
        });

        it('should resolve to a DocumentationVariable when finding a @type', function()
        {
            const testee = new DocBlockParser();
            const docblock = `
            /**
             * @type
             */`;
            const promise = testee.parse(docblock, { contentType: ContentType.SASS }).then(function(documentation)
            {
                expect(documentation).to.be.instanceof(DocumentationVariable);
            });
            return promise;
        });

        it('should resolve to a DocumentationVariable when finding a @kind variable', function()
        {
            const testee = new DocBlockParser();
            const docblock = `
            /**
             * @kind variable
             */`;
            const promise = testee.parse(docblock, { contentType: ContentType.SASS }).then(function(documentation)
            {
                expect(documentation).to.be.instanceof(DocumentationVariable);
            });
            return promise;
        });

        it('should resolve to a DocumentationClass when finding a @class', function()
        {
            const testee = new DocBlockParser();
            const docblock = `
            /**
             * @class
             */`;
            const promise = testee.parse(docblock, { contentType: ContentType.JS }).then(function(documentation)
            {
                expect(documentation).to.be.instanceof(DocumentationClass);
            });
            return promise;
        });

        it('should resolve to a DocumentationClass when finding a @kind class', function()
        {
            const testee = new DocBlockParser();
            const docblock = `
            /**
             * @kind class
             */`;
            const promise = testee.parse(docblock, { contentType: ContentType.SASS }).then(function(documentation)
            {
                expect(documentation).to.be.instanceof(DocumentationClass);
            });
            return promise;
        });

        it('should resolve to a DocumentationExample when finding a empty @example', function()
        {
            const testee = new DocBlockParser();
            const docblock = `
            /**
             * @example
             */`;
            const promise = testee.parse(docblock, { contentType: ContentType.JS }).then(function(documentation)
            {
                expect(documentation).to.be.instanceof(DocumentationExample);
            });
            return promise;
        });

        it('should resolve to a DocumentationExample when finding a @kind example', function()
        {
            const testee = new DocBlockParser();
            const docblock = `
            /**
             * @kind example
             */`;
            const promise = testee.parse(docblock, { contentType: ContentType.SASS }).then(function(documentation)
            {
                expect(documentation).to.be.instanceof(DocumentationExample);
            });
            return promise;
        });

        describe('should parse @param tags', function()
        {
            it('should allow a param to have a name', function()
            {
                const testee = new DocBlockParser();
                const docblock = `
                {#
                    @param Name
                #}`;
                const promise = testee.parse(docblock, { contentType: ContentType.JINJA }).then(function(documentation)
                {
                    const param = documentation.parameters.find(param => param.name == 'Name');
                    expect(param).to.be.instanceof(DocumentationParameter);
                });
                return promise;
            });

            it('should assume param to be mandatory', function()
            {
                const testee = new DocBlockParser();
                const docblock = `
                {#
                    @param Name
                #}`;
                const promise = testee.parse(docblock, { contentType: ContentType.JINJA }).then(function(documentation)
                {
                    const param = documentation.parameters.find(param => param.name == 'Name');
                    expect(param.isOptional).to.be.not.ok;
                });
                return promise;
            });

            it('should allow a param to be optional', function()
            {
                const testee = new DocBlockParser();
                const docblock = `
                {#
                    @param [Name]
                #}`;
                const promise = testee.parse(docblock, { contentType: ContentType.JINJA }).then(function(documentation)
                {
                    const param = documentation.parameters.find(param => param.name == 'Name');
                    expect(param.isOptional).to.be.ok;
                });
                return promise;
            });

            it('should allow a optional param to have a default value', function()
            {
                const testee = new DocBlockParser();
                const docblock = `
                {#
                    @param [Name = Peter Parker]
                #}`;
                const promise = testee.parse(docblock, { contentType: ContentType.JINJA }).then(function(documentation)
                {
                    const param = documentation.parameters.find(param => param.name == 'Name');
                    expect(param.defaultValue).to.be.equal('Peter Parker');
                });
                return promise;
            });

            it('should assume * as the default type', function()
            {
                const testee = new DocBlockParser();
                const docblock = `
                {#
                    @param Name
                #}`;
                const promise = testee.parse(docblock, { contentType: ContentType.JINJA }).then(function(documentation)
                {
                    const param = documentation.parameters.find(param => param.name == 'Name');
                    expect(param.type).to.contain('*');
                });
                return promise;
            });

            it('should allow a param to have a type', function()
            {
                const testee = new DocBlockParser();
                const docblock = `
                {#
                    @param {Boolean} Name
                #}`;
                const promise = testee.parse(docblock, { contentType: ContentType.JINJA }).then(function(documentation)
                {
                    const param = documentation.parameters.find(param => param.name == 'Name');
                    expect(param.type).to.have.length(1);
                    expect(param.type).to.contain('Boolean');
                });
                return promise;
            });

            it('should allow multiple types per param', function()
            {
                const testee = new DocBlockParser();
                const docblock = `
                {#
                    @param {Boolean|String} Name
                #}`;
                const promise = testee.parse(docblock, { contentType: ContentType.JINJA }).then(function(documentation)
                {
                    const param = documentation.parameters.find(param => param.name == 'Name');
                    expect(param.type).to.have.length(2);
                    expect(param.type).to.contain('Boolean');
                    expect(param.type).to.contain('String');
                });
                return promise;
            });

            it('should allow a param to have a description', function()
            {
                const testee = new DocBlockParser();
                const docblock = `
                {#
                    @param {Boolean} Name - Description
                #}`;
                const promise = testee.parse(docblock, { contentType: ContentType.JINJA }).then(function(documentation)
                {
                    const param = documentation.parameters.find(param => param.name == 'Name');
                    expect(param.description).to.be.equal('Description');
                });
                return promise;
            });

            it('should allow a param to have a multiline description', function()
            {
                const testee = new DocBlockParser();
                const docblock = `
                {#
                    @param {Boolean} Name - Line 1
                    Line 2
                #}`;
                const promise = testee.parse(docblock, { contentType: ContentType.JINJA }).then(function(documentation)
                {
                    const param = documentation.parameters.find(param => param.name == 'Name');
                    expect(param.description).to.be.equal('Line 1\nLine 2');
                });
                return promise;
            });

            it('should allow to document complex/object params', function()
            {
                const testee = new DocBlockParser();
                const docblock = `
                {#
                    @param {Object} model - Model
                    @param {String} model.name - Name
                    @param {Number} model.age - Age
                #}`;
                const promise = testee.parse(docblock, { contentType: ContentType.JINJA }).then(function(documentation)
                {
                    const param = documentation.parameters.find(param => param.name == 'model');
                    expect(param).to.be.instanceOf(DocumentationCompoundParameter);
                    expect(param.type).to.contain('Object');
                    expect(param.description).to.be.equal('Model');

                    const nameParam = param.children.find(param => param.name == 'name');
                    expect(nameParam).to.be.instanceOf(DocumentationParameter);
                    expect(nameParam.type).to.contain('String');
                    expect(nameParam.description).to.be.equal('Name');

                    const ageParam = param.children.find(param => param.name == 'age');
                    expect(ageParam).to.be.instanceOf(DocumentationParameter);
                    expect(ageParam.type).to.contain('Number');
                    expect(ageParam.description).to.be.equal('Age');
                });
                return promise;
            });


            it('should allow to document enumeration params', function()
            {
                const testee = new DocBlockParser();
                const docblock = `
                {#
                    @param {Enumeration} type - Type Enum
                        one
                        two - Type Two
                #}`;
                const promise = testee.parse(docblock, { contentType: ContentType.JINJA }).then(function(documentation)
                {
                    const param = documentation.parameters.find(param => param.name == 'type');
                    expect(param.type).to.contain('Enumeration');
                    expect(param.description).to.be.equal('Type Enum');
                    expect(param.enumeration).to.have.length(2);
                    expect(param.enumeration[0].name).to.be.equal('one');
                    expect(param.enumeration[0].description).to.be.equal('');
                    expect(param.enumeration[1].name).to.be.equal('two');
                    expect(param.enumeration[1].description).to.be.equal('Type Two');
                });
                return promise;
            });
        });

        it('should parse @type', function()
        {
            const testee = new DocBlockParser();
            const docblock = `
            /**
             * @type {bool|String}
             */`;
            const promise = testee.parse(docblock, { contentType: ContentType.SASS }).then(function(documentation)
                {
                expect(documentation).to.be.instanceof(DocumentationVariable);
                expect(documentation.type).to.contain('Boolean');
                expect(documentation.type).to.contain('String');
            });
            return promise;
        });

        it('should parse a docblock within 20ms', function()
        {
            const testee = new DocBlockParser();
            const docblock = `
            /**
             * Add sanity checks for dumb queries like
             *
             * @param {String} $name
             * @param {String} $mode
             */
            `;

            this.timeout(50);
            const promise = testee.parse(docblock, { contentType: ContentType.SASS }).then(function(documentation)
            {
                expect(documentation).to.be.instanceof(DocumentationCallable);
            });
            return promise;
        });
    });
});
