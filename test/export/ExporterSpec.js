'use strict';

/**
 * Requirements
 */
const Exporter = require(ES_SOURCE + '/export/Exporter.js').Exporter;
const Parser = require(ES_SOURCE + '/export/Parser.js').Parser;
const Renderer = require(ES_SOURCE + '/export/Renderer.js').Renderer;
const Transformer = require(ES_SOURCE + '/export/Transformer.js').Transformer;
const exporterSpec = require('./ExporterShared.js').spec;

/**
 * Spec
 */
describe(Exporter.className, function() {
    /**
     * Exporter Test
     */
    exporterSpec(Exporter, 'export/Exporter', () => {
        const result = [
            global.fixtures.globalRepository,
            global.fixtures.buildConfiguration,
            new Parser(),
            new Renderer(),
            new Transformer()
        ];
        return result;
    });
});
