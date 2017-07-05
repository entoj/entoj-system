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
        : ES_FIXTURES + '/export/transformer/';


    // Create a export configuration
    function createConfiguration(entityPath, macroName, settings, parser, renderer, transformer)
    {
        const promise = co(function*()
        {
            const entity = (yield global.fixtures.globalRepository.resolve(entityPath)).entity;
            const macro = yield global.fixtures.globalRepository.resolveMacro(entity.site, macroName);
            const config = new configurationClass(entity,
                macro,
                settings || {},
                parser || new parserClass(),
                renderer || new rendererClass(),
                transformer || new transformerClass(),
                global.fixtures.globalRepository,
                global.fixtures.buildConfiguration);
            return config;
        });
        return promise;
    }


    // Loads a fixture from file
    function loadFixture(filename, type)
    {
        const promise = co(function *()
        {
            const source = fs.readFileSync(path.join(ES_FIXTURES, filename), { encoding: 'utf8' }).replace(/\r/g, '');
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
            const expected = yield loadFixture('/export/transformer/' + name + '.expected.json', 'json');
            try
            {
                expect(testee).to.be.deep.equal(expected);
            }
            catch(e)
            {
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
    function testRenderFixture(name, renderer)
    {
        const promise = co(function*()
        {
            const rootPath = basePath || (ES_FIXTURES + '/export/renderer/');
            if (fs.existsSync(rootPath + name + '.input.j2'))
            {
                const ast = yield loadFixture('/export/renderer/' + name + '.input.j2', 'ast');
                const expected = yield loadFixture('/export/renderer/' + name + '.expected.html');
                const configuration = yield createConfiguration('/base/elements/e-cta', 'e_cta');
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
                    console.log(JSON.stringify(node.serialize(), null, 4));
                    throw e;
                }
            }
        });
        return promise;
    }


    const exports = {};
    exports.createConfiguration = createConfiguration;
    exports.loadFixture = loadFixture;
    exports.testNodeFixture = testNodeFixture;
    exports.testRenderFixture = testRenderFixture;
    return exports;
}


/**
 * Exports
 */
module.exports = configure;
