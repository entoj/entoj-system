
/**
 * @namespace task
 */
module.exports =
{
    Task: require('./Task.js').Task,
    TransformingTask: require('./TransformingTask.js').TransformingTask,
    DecorateTask: require('./DecorateTask.js').DecorateTask,
    EnvironmentTask: require('./EnvironmentTask.js').EnvironmentTask,
    ReadFilesTask: require('./ReadFilesTask.js').ReadFilesTask,
    RemoveFilesTask: require('./RemoveFilesTask.js').RemoveFilesTask,
    RenameFilesTask: require('./RenameFilesTask.js').RenameFilesTask,
    TemplateTask: require('./TemplateTask.js').TemplateTask,
    WriteFilesTask: require('./WriteFilesTask.js').WriteFilesTask,
    ZipFilesTask: require('./ZipFilesTask.js').ZipFilesTask
};
