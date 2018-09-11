/**
 * @namespace watch
 */
module.exports = {
    FileWatcher: require('./FileWatcher.js').FileWatcher,
    ModelSynchronizer: require('./ModelSynchronizer.js').ModelSynchronizer,
    ModelSynchronizerPlugin: require('./ModelSynchronizerPlugin.js').ModelSynchronizerPlugin,
    ModelSynchronizerEntitiesPlugin: require('./ModelSynchronizerEntitiesPlugin.js')
        .ModelSynchronizerEntitiesPlugin,
    ModelSynchronizerSitesPlugin: require('./ModelSynchronizerSitesPlugin.js')
        .ModelSynchronizerSitesPlugin,
    ModelSynchronizerDataPlugin: require('./ModelSynchronizerDataPlugin.js')
        .ModelSynchronizerDataPlugin,
    ModelSynchronizerSettingsPlugin: require('./ModelSynchronizerSettingsPlugin.js')
        .ModelSynchronizerSettingsPlugin
};
