'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const DIContainer = require('../utils/DIContainer.js').DIContainer;
const merge = require('lodash.merge');

/**
 * The application bootstrapper
 *
 * @memberOf application
 * @extends {Base}
 */
class Bootstrap extends Base {
    /**
     * @param {Object} [configuration]
     */
    constructor(bootstrapper, configuration) {
        super();

        // Initialize
        this._configuration = configuration || {};
        this._bootstrapper = bootstrapper;
        this._di = new DIContainer();
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'application/Configuration';
    }

    /**
     * @type {utils.DIContainer}
     */
    get di() {
        return this._di;
    }

    /**
     * @type {Object}
     */
    get configuration() {
        return this._configuration;
    }

    /**
     * Adds the given configuration
     */
    addConfiguration(configuration) {
        this.configuration = merge(this.configuration, configuration);
    }

    /**
     * Creates a usable default configuration
     *
     * @protected
     */
    prepare() {
        // Di
        this.logger.debug('Setup di');
        this.di.mapAsSingleton(DIContainer, this.di);

        // Globals
        this.di.mapAsSingleton(require('../watch/FileWatcher.js').FileWatcher);
        this.di.mapAsSingleton(require('../watch/ModelSynchronizer.js').ModelSynchronizer);
        this.di.mapAsSingleton(require('./Communication.js').Communication);

        // Configs
        this.logger.debug('Setup configurations');
        this.di.mapAsSingleton(require('../model/configuration/index.js').GlobalConfiguration);
        this.di.mapAsSingleton(require('../model/configuration/index.js').PathesConfiguration);
        this.di.mapAsSingleton(require('../model/configuration/index.js').UrlsConfiguration);
        this.di.mapAsSingleton(require('../model/configuration/index.js').BuildConfiguration);
        this.di.mapAsSingleton(require('../configuration/index.js').SystemModuleConfiguration);

        // Repositories
        this.logger.debug('Setup repositories');
        this.di.mapAsSingleton(require('../model/site/SitesRepository.js').SitesRepository);
        this.di.mapAsSingleton(require('../model/entity/index.js').EntityCategoriesRepository);
        this.di.mapAsSingleton(require('../model/entity/index.js').EntitiesRepository);
        this.di.mapAsSingleton(require('../model/file/index.js').FilesRepository);
        this.di.mapAsSingleton(require('../model/setting/index.js').SettingsRepository);

        // Sites
        this.logger.debug('Setup sites');
        this.di.mapAsSingleton(require('../model/index.js').site.SitesLoader);
        this.di.mapParameters(require('../model/index.js').site.SitesLoader, {
            plugins: [
                require('../model/index.js').loader.documentation.PackagePlugin,
                require('../model/index.js').loader.documentation.MarkdownPlugin
            ]
        });

        // Entities
        this.logger.debug('Setup entities');
        this.di.mapAsSingleton(
            require('../parser/entity/IdParser.js').IdParser,
            require('../parser/entity/CompactIdParser.js').CompactIdParser
        );
        this.di.mapAsSingleton(require('../model/entity/index.js').EntityCategoriesLoader);
        this.di.mapAsSingleton(require('../model/entity/index.js').EntitiesLoader);
        this.di.mapParameters(require('../parser/index.js').entity.CompactIdParser, {
            options: {
                useNumbers: false
            }
        });
        this.di.mapParameters(require('../model/index.js').entity.EntitiesLoader, {
            plugins: [
                require('../model/index.js').loader.documentation.PackagePlugin,
                {
                    type: require('../model/index.js').loader.documentation.MarkdownPlugin,
                    arguments: [
                        [
                            'options',
                            {
                                sections: {
                                    DESCRIPTION: 'Abstract',
                                    FUNCTIONAL: 'Functional'
                                }
                            }
                        ]
                    ]
                },
                require('../model/index.js').loader.documentation.JinjaPlugin,
                require('../model/index.js').loader.documentation.ExamplePlugin
            ]
        });

        // ViewModel
        this.di.mapParameters(require('../model/index.js').viewmodel.ViewModelRepository, {
            plugins: [
                require('../model/index.js').viewmodel.plugin.ViewModelImportPlugin,
                require('../model/index.js').viewmodel.plugin.ViewModelLipsumPlugin,
                require('../model/index.js').viewmodel.plugin.ViewModelLipsumHtmlPlugin
            ]
        });

        // ModelSynchronizer
        this.di.mapParameters(require('../watch/index.js').ModelSynchronizer, {
            plugins: [
                require('../watch/index.js').ModelSynchronizerSettingsPlugin,
                require('../watch/index.js').ModelSynchronizerEntitiesPlugin,
                require('../watch/index.js').ModelSynchronizerSitesPlugin
            ]
        });

        // Nunjucks filter & tags
        this.di.mapParameters(require('../nunjucks/index.js').Environment, {
            options: {
                templatePaths: '${path.sites}'
            },
            tags: [require('../nunjucks/index.js').tag.ConfigurationTag],
            filters: [
                require('../nunjucks/index.js').filter.AssetUrlFilter,
                require('../nunjucks/index.js').filter.AttributesFilter,
                require('../nunjucks/index.js').filter.DebugFilter,
                require('../nunjucks/index.js').filter.EmptyFilter,
                require('../nunjucks/index.js').filter.HyphenateFilter,
                require('../nunjucks/index.js').filter.JsonEncodeFilter,
                require('../nunjucks/index.js').filter.LinkUrlFilter,
                require('../nunjucks/index.js').filter.LipsumFilter,
                require('../nunjucks/index.js').filter.LoadFilter,
                require('../nunjucks/index.js').filter.MarkdownFilter,
                require('../nunjucks/index.js').filter.MarkupFilter,
                require('../nunjucks/index.js').filter.MediaQueryFilter,
                require('../nunjucks/index.js').filter.ModuleClassesFilter,
                require('../nunjucks/index.js').filter.NotEmptyFilter,
                require('../nunjucks/index.js').filter.GetFilter,
                require('../nunjucks/index.js').filter.SetFilter,
                require('../nunjucks/index.js').filter.SettingFilter,
                require('../nunjucks/index.js').filter.SvgUrlFilter,
                require('../nunjucks/index.js').filter.SvgViewBoxFilter,
                require('../nunjucks/index.js').filter.UniqueFilter
            ]
        });

        // Linter
        this.di.mapParameters(require('../command/index.js').LintCommand, {
            linters: [require('../linter/index.js').NunjucksFileLinter]
        });

        // Server
        this.di.mapParameters(require('../command/index.js').ServerCommand, {
            routes: [
                {
                    type: require('../server/index.js').route.StaticFileRoute,
                    arguments: [
                        [
                            'options',
                            {
                                basePath: '${path.sites}'
                            }
                        ]
                    ]
                },
                {
                    type: require('../server/index.js').route.EntityTemplateRoute,
                    arguments: [
                        [
                            'options',
                            {
                                basePath: '${path.sites}'
                            }
                        ]
                    ]
                }
            ]
        });
    }

    /**
     * @protected
     */
    finalize() {
        // global configuration
        this.di.mapParameters(require('../model/configuration/index.js').GlobalConfiguration, {
            configuration: this.configuration
        });

        // commands
        this.logger.debug('Setup commands');
        const commandMappings = this.di.getMappingForDerivatives(
            require('../command/Command.js').Command
        );
        if (commandMappings && commandMappings.length) {
            const commands = [];
            for (const commandMapping of commandMappings) {
                commands.push(commandMapping.type);
            }
            this.di.mapParameters(require('../application/Runner.js').Runner, {
                commands: commands
            });
        }
    }

    /**
     * @protected
     */
    modules() {}

    /**
     * Starts the configuration bootstrapping
     */
    start() {
        this.prepare();
        if (typeof bootstrapper == 'function') {
            this._bootstrapper(this);
        }
        this.modules();
        this.finalize();
    }

    /**
     * Registers a module
     *
     * @param {Object} module
     * @param {Object} options
     */
    register(module) {
        if (module && typeof module.register === 'function') {
            module.register(this);
        }
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.Bootstrap = Bootstrap;
