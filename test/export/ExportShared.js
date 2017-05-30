'use strict';

/**
 * Requirements
 * @ignore
 */
const Configuration = require(ES_SOURCE + '/export/Configuration.js').Configuration;
const Parser = require(ES_SOURCE + '/export/parser/JinjaParser.js').JinjaParser;
const Renderer = require(ES_SOURCE + '/export/Renderer.js').Renderer;
const co = require('co');
const fs = require('fs');


// Returns preconfigured test utils
function configure(options)
{
    const configurationType = options
        ? options.configuration || Configuration
        : Configuration;
    const rendererType = options
        ? options.renderer || Renderer
        : Renderer;

    // Create a export configuration
    function createConfiguration(entityId, renderer)
    {
        const promise = co(function*()
        {
            const entity = yield global.fixtures.entitiesRepository.getById(entityId, global.fixtures.siteBase);
            const config = new configurationType(entity,
                undefined,
                {},
                undefined,
                renderer,
                global.fixtures.globalRepository,
                global.fixtures.buildConfiguration);
            return config;
        });
        return promise;
    }

    // Runs a simple testfixture
    function testFixture(name, nodeRenderers, basePath)
    {
        const promise = co(function*()
        {
            const rootPath = basePath || (ES_FIXTURES + '/export/renderer/');
            if (fs.existsSync(rootPath + name + '.input.j2'))
            {
                const input = fs.readFileSync(rootPath + name + '.input.j2', { encoding: 'utf8' }).replace(/\r/g, '');
                const expected = fs.readFileSync(rootPath + name + '.expected.html', { encoding: 'utf8' });
                const testee = new rendererType(nodeRenderers);
                const parser = new Parser(global.fixtures.globalRepository);
                const configuration = yield createConfiguration('e-cta', testee);
                const node = yield parser.parseString(input, configuration);
                let result = '';
                try
                {
                    result = yield testee.render(node, configuration);
                    expect(result.trim()).to.be.deep.equal(expected.trim());
                }
                catch(e)
                {
                    /* eslint no-console: "off" */
                    console.log('Render result:');
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
    exports.testFixture = testFixture;
    return exports;
}


/**
 * Exports
 */
module.exports = configure;
