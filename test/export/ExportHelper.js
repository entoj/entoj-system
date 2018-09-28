'use strict';

/**
 * Requirements
 * @ignore
 */
const Configuration = require(ES_SOURCE + '/export/Configuration.js').Configuration;
const JinjaParser = require(ES_SOURCE + '/export/parser/JinjaParser.js').JinjaParser;
const Renderer = require(ES_SOURCE + '/export/Renderer.js').Renderer;
const Transformer = require(ES_SOURCE + '/export/Transformer.js').Transformer;
const ErrorHandler = require(ES_SOURCE + '/error/ErrorHandler.js').ErrorHandler;
const co = require('co');
const fs = require('fs');
const path = require('path');

// Returns preconfigured test utils
function configure(options) {
    // Prepare options
    const opts = options || {};
    const configurationClass = opts.configurationClass ? opts.configurationClass : Configuration;
    const rendererClass = opts.rendererClass ? opts.renderer : Renderer;
    const transformerClass = opts.transformerClass ? opts.transformerClass : Transformer;
    const parserClass = opts.parserClass ? opts.parserClass : JinjaParser;
    const fixtureInputPath = opts.fixtureInputPath
        ? opts.fixtureInputPath
        : opts.basePath || ES_FIXTURES + '/export';
    const fixtureExpectedPath = opts.fixtureExpectedPath
        ? opts.fixtureExpectedPath
        : opts.basePath || ES_FIXTURES + '/export';
    const resultExtension = opts.resultExtension ? opts.resultExtension : '.html';

    // Create a export configuration
    function createConfiguration(entityPath, macroName, settings, parser, renderer, transformer) {
        const promise = co(function*() {
            const entity = yield global.fixtures.globalRepository.resolve(entityPath);
            if (!entity) {
                throw new Error('Could not find entity ' + entityPath);
            }
            const macro = yield global.fixtures.globalRepository.resolveMacro(
                entity.entity.site,
                macroName
            );
            let config;
            if (opts.configurationCreator) {
                config = opts.configurationCreator(
                    entity.entity,
                    macro,
                    settings || {},
                    parser || new parserClass(),
                    renderer || new rendererClass(),
                    transformer || new transformerClass(),
                    global.fixtures.globalRepository,
                    global.fixtures.buildConfiguration
                );
            } else {
                config = new configurationClass(
                    entity.entity,
                    macro,
                    settings || {},
                    parser || new parserClass(),
                    renderer || new rendererClass(),
                    transformer || new transformerClass(),
                    global.fixtures.globalRepository,
                    global.fixtures.buildConfiguration
                );
            }
            return config;
        }).catch(ErrorHandler.handler());
        return promise;
    }

    // Loads a fixture from file
    function loadFixture(filename, type) {
        const promise = co(function*() {
            const source = fs.readFileSync(filename, { encoding: 'utf8' }).replace(/\r/g, '');
            let result = source;
            if (type === 'json') {
                result = JSON.parse(result);
            }
            if (type === 'ast') {
                const parser = new JinjaParser();
                result = yield parser.parseString(source);
            }
            return result;
        }).catch(ErrorHandler.handler());
        return promise;
    }

    function loadInputFixture(filename, type) {
        return loadFixture(path.join(fixtureInputPath, filename), type);
    }

    function loadExpectedFixture(filename, type) {
        return loadFixture(path.join(fixtureExpectedPath, filename), type);
    }

    // Tests a node against a fixture
    function testNodeFixture(name, node) {
        const promise = co(function*() {
            const testee = JSON.parse(JSON.stringify(node.serialize()));
            const expected = yield loadFixture(
                path.join(fixtureExpectedPath, '/' + name + '.expected.json'),
                'json'
            );
            try {
                expect(testee).to.be.deep.equal(expected);
            } catch (e) {
                /* eslint no-console: "off" */
                console.log('Testee:');
                console.log(JSON.stringify(testee, null, 4));
                console.log('Expected:');
                console.log(JSON.stringify(expected, null, 4));
                throw e;
            }
        });
        return promise;
    }

    // Runs a simple testfixture
    function testRendererFixture(name, renderer, settings) {
        const promise = co(function*() {
            const ast = yield loadFixture(
                path.join(fixtureInputPath, '/' + name + '.input.j2'),
                'ast'
            );
            const expected = yield loadFixture(
                path.join(fixtureExpectedPath, '/' + name + '.expected' + resultExtension)
            );
            const configuration = yield createConfiguration(
                'base/elements/e-cta',
                'e_cta',
                settings,
                undefined,
                renderer
            );
            let result = '';
            try {
                result = yield renderer.render(ast, configuration);
                expect(result.trim()).to.be.deep.equal(expected.trim());
            } catch (e) {
                /* eslint no-console: "off" */
                console.log('Testee:');
                console.log(result);
                console.log('Parsed:');
                console.log(JSON.stringify(ast.serialize(), null, 4));
                throw e;
            }
        });
        return promise;
    }

    const exports = {};
    exports.opts = opts;
    exports.createConfiguration = createConfiguration;
    exports.loadFixture = loadFixture;
    exports.loadInputFixture = loadInputFixture;
    exports.loadExpectedFixture = loadExpectedFixture;
    exports.testNodeFixture = testNodeFixture;
    exports.testRendererFixture = testRendererFixture;
    return exports;
}

/**
 * Exports
 */
module.exports = (options) => configure(options);
