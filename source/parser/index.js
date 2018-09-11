/**
 * @namespace parser
 */
module.exports = {
    Parser: require('./Parser.js').Parser,
    FileParser: require('./FileParser.js').FileParser,
    documentation: require('./documentation/index.js'),
    entity: require('./entity/index.js'),
    jinja: require('./jinja/index.js')
};
