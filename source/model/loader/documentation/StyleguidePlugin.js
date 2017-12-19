'use strict';

/**
 * Requirements
 * @ignore
 */
const ParserPlugin = require('./ParserPlugin.js').ParserPlugin;
const PathesConfiguration = require('../../configuration/PathesConfiguration.js').PathesConfiguration;
const FileParser = require('../../../parser/FileParser.js').FileParser;
const ContentType = require('../../ContentType.js').ContentType;
const ContentKind = require('../../ContentKind.js').ContentKind;


/**
 * Reads styleguide files
 */
class StyleguidePlugin extends ParserPlugin
{
    /**
     * @param {configuration.PathesConfiguration} pathesConfiguration
     * @param {object|undefined} options
     */
    constructor(pathesConfiguration, options)
    {
        super(pathesConfiguration);

        // Assign options
        this._parser = new FileParser(
            {
                glob: ['/styleguide/*.j2'],
                fileType: ContentType.JINJA,
                fileKind: ContentKind.STYLEGUIDE
            });
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [PathesConfiguration, 'model.loader.documentation/StyleguidePlugin.options'] };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.loader.documentation/StyleguidePlugin';
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.StyleguidePlugin = StyleguidePlugin;
