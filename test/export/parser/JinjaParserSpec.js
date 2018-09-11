'use strict';

/**
 * Requirements
 */
const JinjaParser = require(ES_SOURCE + '/export/parser/JinjaParser.js').JinjaParser;
const Node = require(ES_SOURCE + '/export/ast/Node.js').Node;
const MacroNode = require(ES_SOURCE + '/export/ast/MacroNode.js').MacroNode;
const Configuration = require(ES_SOURCE + '/export/Configuration.js').Configuration;
const Tag = require(ES_SOURCE + '/nunjucks/tag/Tag.js').Tag;
const parserSpec = require('../ParserShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const fs = require('fs');
const co = require('co');
const nunjucks = require('nunjucks');

/**
 * Spec
 */
describe(JinjaParser.className, function() {
    /**
     * Base Test
     */
    beforeEach(function() {
        global.fixtures = projectFixture.createStatic({ skipEntities: true });
    });

    parserSpec(JinjaParser, 'export.parser/JinjaParser', function(parameters) {
        return [global.fixtures.globalRepository];
    });

    /**
     * JinjaParser Test
     */
    function createConfiguration(entityId, macroName) {
        const promise = co(function*() {
            const fixture = projectFixture.createDynamic();
            const entity = yield fixture.entitiesRepository.getById(entityId, fixture.siteBase);
            const macro = yield fixture.globalRepository.resolveMacro(fixture.siteBase, macroName);
            const config = new Configuration(
                entity,
                macro,
                {},
                undefined,
                undefined,
                undefined,
                fixture.globalRepository,
                fixture.buildConfiguration
            );
            return config;
        });
        return promise;
    }

    // Runs a simple testfixture
    function testFixture(name) {
        const promise = co(function*() {
            const rootPath = ES_FIXTURES + '/export/parser/JinjaParser/';
            const input = fs
                .readFileSync(rootPath + name + '.input.j2', { encoding: 'utf8' })
                .replace(/\r/g, '');
            const expected = JSON.parse(
                fs.readFileSync(rootPath + name + '.expected.json', { encoding: 'utf8' })
            );
            const testee = new JinjaParser([new Tag()]);
            const node = yield testee.parseString(input);
            try {
                // Removes undefined values
                const result = JSON.parse(JSON.stringify(node.serialize()));
                expect(result).to.be.deep.equal(expected);
            } catch (e) {
                /* eslint no-console: "off" */
                console.log('Nunjucks AST:');
                console.log(JSON.stringify(nunjucks.parser.parse(input, [new Tag()]), null, 4));
                console.log('Parsed:');
                console.log(JSON.stringify(node.serialize(), null, 4));
                throw e;
            }
        });
        return promise;
    }

    describe('#parseString()', function() {
        it('should parse empty templates', function() {
            return testFixture('empty');
        });

        it('should parse embedded variables', function() {
            return testFixture('variables');
        });

        it('should parse variable assigments', function() {
            return testFixture('assigments');
        });

        it('should parse macro and function calls', function()
        {
            return testFixture('calls');
        });

        it('should parse expressions', function() {
            return testFixture('expressions');
        });

        it('should parse conditionals', function() {
            return testFixture('conditionals');
        });

        it('should parse iterations', function() {
            return testFixture('iterations');
        });

        it('should parse filters', function() {
            return testFixture('filter');
        });

        it('should parse macros', function() {
            return testFixture('macros');
        });

        it('should parse complex variables', function() {
            return testFixture('complexvariables');
        });

        it('should parse blocks', function() {
            return testFixture('blocks');
        });

        it('should parse custom tags', function() {
            return testFixture('tags');
        });
    });

    describe('#parseTemplate()', function() {
        it('should resolve to a Node for an existing entity', function() {
            const promise = co(function*() {
                const testee = new JinjaParser(global.fixtures.globalRepository);
                const config = yield createConfiguration('e-cta');
                const template = yield testee.parseTemplate(config.entity, config);
                expect(template).to.be.instanceof(Node);
            });
            return promise;
        });

        it('should resolve to false for an non existing entity', function() {
            const promise = co(function*() {
                const testee = new JinjaParser(global.fixtures.globalRepository);
                const config = yield createConfiguration('e-cto');
                const template = yield testee.parseTemplate(config.entity, config);
                expect(template).to.be.not.ok;
            });
            return promise;
        });
    });

    describe('#parseMacro()', function() {
        it('should resolve to a MacroNode for an existing macro', function() {
            const promise = co(function*() {
                const testee = new JinjaParser(global.fixtures.globalRepository);
                const config = yield createConfiguration('e-cta', 'e_cta');
                const macro = yield testee.parseMacro('e_cta', config);
                expect(macro).to.be.instanceof(MacroNode);
                expect(macro.name).to.be.equal('e_cta');
            });
            return promise;
        });

        it('should resolve to a specific MacroNode for an existing macro', function() {
            const promise = co(function*() {
                const testee = new JinjaParser(global.fixtures.globalRepository);
                const config = yield createConfiguration('m-teaser', 'm_teaser_hero');
                const macro = yield testee.parseMacro('m_teaser_hero', config);
                expect(macro).to.be.instanceof(MacroNode);
                expect(macro.name).to.be.equal('m_teaser_hero');
            });
            return promise;
        });

        it('should resolve to false when no macro was found', function() {
            const promise = co(function*() {
                const testee = new JinjaParser(global.fixtures.globalRepository);
                const config = yield createConfiguration('e-cta', 'e_cta');
                const macro = yield testee.parseMacro('e_cta2', config);
                expect(macro).to.be.not.ok;
            });
            return promise;
        });
    });
});
