require('./configuration.js');
module.exports =
{
    BaseShared: require('./BaseShared.js').spec,
    fixture:
    {
        project: require('./__fixtures__/project/index.js')
    },
    export:
    {
        ConfigurationShared: require('./export/ConfigurationShared.js').spec,
        ParserShared: require('./export/ParserShared.js').spec,
        NodeRendererShared: require('./export/renderer/NodeRendererShared.js').spec,
        RendererShared: require('./export/RendererShared.js').spec
    },
    linter:
    {
        LinterShared: require('./linter/LinterShared.js').spec,
        FileLinterShared: require('./linter/FileLinterShared.js').spec
    },
    parser:
    {
        ParserShared: require('./parser/ParserShared.js').spec,
        FileParserShared: require('./parser/FileParserShared.js').spec
    },
    task:
    {
        TaskShared: require('./task/TaskShared.js').spec,
        TransformingTaskShared: require('./task/TransformingTaskShared.js').spec
    }
};
