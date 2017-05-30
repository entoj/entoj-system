'use strict';

/**
 * Requirements
 */
const parserSpec = require(ES_TEST + '/parser/ParserShared.js').spec;
const JinjaParser = require(ES_SOURCE + '/parser/documentation/JinjaParser.js').JinjaParser;
const DocumentationCallable = require(ES_SOURCE + '/model/documentation/DocumentationCallable.js').DocumentationCallable;


/**
 * Spec
 */
describe(JinjaParser.className, function()
{
    /**
     * Parser Test
     */
    parserSpec(JinjaParser, 'parser.documentation/JinjaParser');


    /**
     * JinjaParser Test
     */
    describe('#parse()', function()
    {
        it('should parse macros without a valid docblock', function()
        {
            const testee = new JinjaParser();
            const docblock = '{% macro one(name=\'unnamed\', id = 5) %}{% endmacro %}';

            const promise = testee.parse(docblock).then(function(documentation)
            {
                expect(documentation).to.have.length(1);
                const macro = documentation.find(doc => doc.name == 'one');
                expect(macro.parameters).to.have.length(2);
                expect(macro.parameters.find(param => param.name == 'name')).to.be.ok;
                expect(macro.parameters.find(param => param.name == 'name').defaultValue).to.be.equal('\'unnamed\'');
                expect(macro.parameters.find(param => param.name == 'id')).to.be.ok;
                expect(macro.parameters.find(param => param.name == 'id').defaultValue).to.be.equal('5');
            });
            return promise;
        });

        it('should parse macros with a valid docblock', function()
        {
            const testee = new JinjaParser();
            const docblock = `
            {##
                @param {string} name
                @param {number} id
             #}
            {% macro one(name, id) %}{% endmacro %}`;

            const promise = testee.parse(docblock).then(function(documentation)
            {
                expect(documentation).to.have.length(1);
                const macro = documentation.find(doc => doc.name == 'one');
                expect(macro.parameters).to.have.length(2);
                expect(macro.parameters.find(param => param.name == 'name')).to.be.ok;
                expect(macro.parameters.find(param => param.name == 'name').type).to.contain('String');
                expect(macro.parameters.find(param => param.name == 'id')).to.be.ok;
                expect(macro.parameters.find(param => param.name == 'id').type).to.contain('Number');
            });
            return promise;
        });

        it('should parse macros with mixed identation', function()
        {
            const testee = new JinjaParser();
            const docblock = `
            {##
                @param {string} name
                @param {number} id
             #}
                {% macro one(name, id) %}{% endmacro %}
                    {##
                        @param {string} name
                     #}
        {% macro two(name) %}{% endmacro %}
                `;

            const promise = testee.parse(docblock).then(function(documentation)
            {
                expect(documentation).to.have.length(2);
                expect(documentation.find(doc => doc.name == 'one')).to.be.ok;
                expect(documentation.find(doc => doc.name == 'two')).to.be.ok;
            });
            return promise;
        });

        it('should enhance infos from docblock with macro infos', function()
        {
            const testee = new JinjaParser();
            const docblock = `
            {##
                @param {string} name
                @param {number} id
             #}
            {% macro one(name, id = 1, class = 'one') %}{% endmacro %}`;

            const promise = testee.parse(docblock).then(function(documentation)
            {
                expect(documentation).to.have.length(1);
                const macro = documentation.find(doc => doc.name == 'one');
                expect(macro.parameters).to.have.length(3);
                expect(macro.parameters.find(param => param.name == 'name')).to.be.ok;
                expect(macro.parameters.find(param => param.name == 'name').type).to.contain('String');
                expect(macro.parameters.find(param => param.name == 'id')).to.be.ok;
                expect(macro.parameters.find(param => param.name == 'id').type).to.contain('Number');
                expect(macro.parameters.find(param => param.name == 'id').defaultValue).to.be.equal('1');
                expect(macro.parameters.find(param => param.name == 'class')).to.be.ok;
                expect(macro.parameters.find(param => param.name == 'class').type).to.contain('*');
                expect(macro.parameters.find(param => param.name == 'class').defaultValue).to.be.equal('\'one\'');
            });
            return promise;
        });

        it('should allow to document maps/objects', function()
        {
            const testee = new JinjaParser();
            const docblock = `
            {##
                @param {String} model.href
                @param {String} model.title
            #}
            {% macro e001_link(model) %}
            {%  endmacro %}
            `;

            const promise = testee.parse(docblock).then(function(documentation)
            {
                expect(documentation).to.have.length(1);
                const macro = documentation.find(doc => doc.name == 'e001_link');
                expect(macro.parameters).to.have.length(1);
            });
            return promise;
        });

        it('should always parse macros as callables', function()
        {
            const testee = new JinjaParser();
            const docblock = `
            {##
                Description
             #}
            {% macro one(name, id) %}{% endmacro %}`;

            const promise = testee.parse(docblock).then(function(documentation)
            {
                expect(documentation).to.have.length(1);
                expect(documentation.find(doc => doc.name == 'one')).to.be.instanceof(DocumentationCallable);
            });
            return promise;
        });

        it('should allow markdown in the docblock', function()
        {
            const testee = new JinjaParser();
            const docblock = `
            {##
                # Headline
                * List 1
                  * List 1.1
                * List 2
             #}
            {% macro one(name, id) %}{% endmacro %}`;
            const expected =
`# Headline
* List 1
  * List 1.1
* List 2`;

            const promise = testee.parse(docblock).then(function(documentation)
            {
                expect(documentation).to.have.length(1);
                const macro = documentation.find(doc => doc.name == 'one');
                expect(macro.description).to.be.equal(expected);
            });
            return promise;
        });


        it('should allow comment within macro', function()
        {
            const testee = new JinjaParser();
            const docblock = `
            {##
                @param {String} href - Link url
            #}
            {% macro e001_link(type, href, title, target, data, class) %}
                {# Render #}
                <a  href="{{ href }}"></a>
            {%  endmacro %}
            `;

            const promise = testee.parse(docblock).then(function(documentation)
            {
                expect(documentation).to.have.length(1);
            });
            return promise;
        });
    });


    describe('performance', function()
    {
        it('should parse a macro within 20ms', function()
        {
            const testee = new JinjaParser();
            const docblock = `

            {##
                Add sanity checks for dumb queries like

                @param {String} name
                @param {String} mode
            #}
            {% macro one(name, id = 1, mode = 'one', ignore=false) %}{% endmacro %}
            `;

            this.timeout(20);
            const promise = testee.parse(docblock).then(function(documentation)
            {
                expect(documentation).to.have.length(1);
            });
            return promise;
        });
    });


    describe('bugs', function()
    {
        it('should not get stuck when comment is in wrong place', function()
        {
            const testee = new JinjaParser();
            const docblock = `
            {##
                Add sanity checks for dumb queries like

                @param {String} name
                @param {String} mode
            #}
            {% include 'some/thing' %}
            {% macro one(name, id = 1, mode = 'one', ignore=false) %}{% endmacro %}
            `;

            const promise = testee.parse(docblock).then(function(documentation)
            {
                expect(documentation).to.have.length(1);
            });
            return promise;
        });
    });
});
