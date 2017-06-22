/**
 * Requirements
 * @ignore
 */
const path = require('path');
require('./configuration.js');

/**
 * Public API
 * @ignore
 */
module.exports =
{
    BaseShared: require('./BaseShared.js').spec,
    fixture:
    {
        files: path.join(__dirname, '/__fixtures__/files'),
        project: require('./__fixtures__/project/index.js')
    },
    command:
    {
        CommandShared: require('./command/CommandShared.js').spec
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
    model:
    {
        loader:
        {
            LoaderPluginShared: require('./model/loader/LoaderPluginShared.js').spec
        }
    },
    nunjucks:
    {
        FilterShared: require('./nunjucks/filter/FilterShared.js').spec
    },
    parser:
    {
        ParserShared: require('./parser/ParserShared.js').spec,
        FileParserShared: require('./parser/FileParserShared.js').spec
    },
    server:
    {
        RouteShared: require('./server/route/RouteShared.js').spec
    },
    task:
    {
        TaskShared: require('./task/TaskShared.js').spec,
        TransformingTaskShared: require('./task/TransformingTaskShared.js').spec
    }
};
