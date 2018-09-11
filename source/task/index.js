/**
 * @namespace task
 */
module.exports = {
    DecorateTask: require('./DecorateTask.js').DecorateTask,
    EntitiesTask: require('./EntitiesTask.js').EntitiesTask,
    EnvironmentTask: require('./EnvironmentTask.js').EnvironmentTask,
    ExportTask: require('./ExportTask.js').ExportTask,
    ReadFilesTask: require('./ReadFilesTask.js').ReadFilesTask,
    RemoveFilesTask: require('./RemoveFilesTask.js').RemoveFilesTask,
    RenameFilesTask: require('./RenameFilesTask.js').RenameFilesTask,
    Task: require('./Task.js').Task,
    TemplateTask: require('./TemplateTask.js').TemplateTask,
    TransformingTask: require('./TransformingTask.js').TransformingTask,
    WrappingTask: require('./WrappingTask.js').WrappingTask,
    WriteFilesTask: require('./WriteFilesTask.js').WriteFilesTask,
    ZipFilesTask: require('./ZipFilesTask.js').ZipFilesTask
};
