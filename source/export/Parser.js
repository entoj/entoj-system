'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const NodeList = require('./ast/NodeList.js').NodeList;


/**
 * Template Parser
 */
class Parser extends Base
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'export/Parser';
    }


    /**
     * @param {String} source
     * @param {export.Configuration} configuration
     * @return {Promise<export.ast/NodeList>}
     */
    parseString(source, configuration)
    {
        return Promise.resolve(new NodeList());
    }


    /**
     * @param {String} name
     * @param {export.Configuration} configuration
     * @returns {Promise<export.ast/MacroNode>}
     */
    parseMacro(name, configuration)
    {
        return Promise.resolve(new NodeList());
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.Parser = Parser;
