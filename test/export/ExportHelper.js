'use strict';

/**
 * Requirements
 * @ignore
 */
const Configuration = require(ES_SOURCE + '/export/Configuration.js').Configuration;
const JinjaParser = require(ES_SOURCE + '/export/parser/JinjaParser.js').JinjaParser;
const Renderer = require(ES_SOURCE + '/export/Renderer.js').Renderer;
const Transformer = require(ES_SOURCE + '/export/Transformer.js').Transformer;
const co = require('co');
const fs = require('fs');
const path = require('path');


// Returns preconfigured test utils
function configure(options)
{
    // Prepare options
    const opts = options || {};
    const configurationClass = opts.configurationClass
        ? opts.configurationClass
        : Configuration;
    const rendererClass = opts.rendererClass
        ? opts.renderer
        : Renderer;
    const transformerClass = opts.transformerClass
        ? opts.transformerClass
        : Transformer;
    const parserClass = opts.parserClass
        ? opts.parserClass
        : JinjaParser;
    const basePath = opts.basePath
        ? opts.basePath
        : ES_FIXTURES + '/export';

    // Create a export configuration
    function createConfiguration(entityPath, macroName, settings, parser, renderer, transformer)
    {
        const promise = co(function*()
        {
            const entity = yield global.fixtures.globalRepository.resolve(entityPath);
            if (!entity)
            {
                throw new Error('Could not find entity ' + entityPath);
            }
            const macro = yield global.fixtures.globalRepository.resolveMacro(entity.entity.site, macroName);
            let config;
            if (opts.configurationCreator)
            {
                config = opts.configurationCreator(entity.entity,
                    macro,
                    settings || {},
                    parser || new parserClass(),
                    renderer || new rendererClass(),
                    transformer || new transformerClass(),
                    global.fixtures.globalRepository,
                    global.fixtures.buildConfiguration);
            }
            else
            {
                config = new configurationClass(entity.entity,
                    macro,
                    settings || {},
                    parser || new parserClass(),
                    renderer || new rendererClass(),
                    transformer || new transformerClass(),
                    global.fixtures.globalRepository,
                    global.fixtures.buildConfiguration);
            }
            return config;
        });
        return promise;
    }


    // Loads a fixture from file
    function loadFixture(filename, type)
    {
        const promise = co(function *()
        {
            const source = fs.readFileSync(path.join(basePath, filename), { encoding: 'utf8' }).replace(/\r/g, '');
            let result = source;
            if (type === 'json')
            {
                result = JSON.parse(result);
            }
            if (type === 'ast')
            {
                const parser = new JinjaParser();
                result = yield parser.parseString(source);
            }
            return result;
        });
        return promise;
    }


    // Tests a node against a fixture
    function testNodeFixture(name, node)
    {
        const promise = co(function *()
        {
            const testee = JSON.parse(JSON.stringify(node.serialize()));
            const expected = yield loadFixture('/' + name + '.expected.json', 'json');
            try
            {
                expect(testee).to.be.deep.equal(expected);
            }
            catch(e)
            {
                /* eslint no-console: "off" */
                console.log('Testee:');
                console.log(JSON.stringify(testee, null, 4));
                console.log('Parsed:');
                console.log(JSON.stringify(expected, null, 4));
                throw e;
            }
        });
        return promise;
    }


    // Runs a simple testfixture
    function testRendererFixture(name, renderer)
    {
        const promise = co(function*()
        {
            const ast = yield loadFixture('/' + name + '.input.j2', 'ast');
            const expected = yield loadFixture('/' + name + '.expected.html');
            const configuration = yield createConfiguration('base/elements/e-cta', 'e_cta', undefined, undefined, renderer);
            let result = '';
            try
            {
                result = yield renderer.render(ast, configuration);
                expect(result.trim()).to.be.deep.equal(expected.trim());
            }
            catch(e)
            {
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
    exports.testNodeFixture = testNodeFixture;
    exports.testRendererFixture = testRendererFixture;
    return exports;
}


/**
 * Exports
 */
module.exports = (options) => configure(options);
