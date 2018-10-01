'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const DIContainer = require('../utils/DIContainer.js').DIContainer;
const GlobalConfiguration = require('../model/configuration/GlobalConfiguration.js')
    .GlobalConfiguration;
const PathesConfiguration = require('../model/configuration/PathesConfiguration.js')
    .PathesConfiguration;
const UrlsConfiguration = require('../model/configuration/UrlsConfiguration.js').UrlsConfiguration;
const BuildConfiguration = require('../model/configuration/BuildConfiguration.js')
    .BuildConfiguration;
const EntityCategoriesRepository = require('../model/entity/EntityCategoriesRepository.js')
    .EntityCategoriesRepository;
const EntityCategoriesLoader = require('../model/entity/EntityCategoriesLoader.js')
    .EntityCategoriesLoader;
const EntitiesRepository = require('../model/entity/EntitiesRepository.js').EntitiesRepository;
const EntitiesLoader = require('../model/entity/EntitiesLoader.js').EntitiesLoader;
const IdParser = require('../parser/entity/IdParser.js').IdParser;
const CompactIdParser = require('../parser/entity/CompactIdParser.js').CompactIdParser;
const SitesRepository = require('../model/site/SitesRepository.js').SitesRepository;
const SitesLoader = require('../model/site/SitesLoader.js').SitesLoader;
const FilesRepository = require('../model/file/FilesRepository.js').FilesRepository;
const SettingsRepository = require('../model/setting/SettingsRepository.js').SettingsRepository;
const SystemModuleConfiguration = require('../configuration/SystemModuleConfiguration.js')
    .SystemModuleConfiguration;
const ModelSynchronizer = require('../watch/ModelSynchronizer.js').ModelSynchronizer;
const FileWatcher = require('../watch/FileWatcher.js').FileWatcher;
const Communication = require('./Communication.js').Communication;
const metrics = require('../utils/performance.js').metrics;

/**
 * Context is the backbone of the application.
 * It parses the given configuration and sets up appropriate dependency
 * injection bindings.
 *
 * @memberOf application
 * @extends Base
 */
class Context extends Base {
    /**
     * @param {object} configuration
     */
    constructor(configuration) {
        super();

        // Prepare
        this._di = new DIContainer();
        this._configuration = configuration || {};
        this._parameters = this._configuration.parameters || {};

        // Configure
        this.configure();
        Context._instance = this;
    }

    /**
     * @inheritDoc
     */
    static get instance() {
        if (!Context._instance) {
            throw new Error(Context.className + ': No Context configured');
        }
        return Context._instance;
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'application/Context';
    }

    /**
     * @type {Object}
     */
    get parameters() {
        return this._parameters;
    }

    /**
     * @type {Object}
     */
    get configuration() {
        return this._configuration;
    }

    /**
     * @type {DIContainer}
     */
    get di() {
        return this._di;
    }

    /**
     * Examines the configuration and returns true if it does'nt contain the instanciation ! operator.
     *
     * @protected
     * @param {Object|Function} configuration - The mapping configuration or a target type
     */
    isSimpleMapping(configuration) {
        if (!configuration || typeof configuration === 'function') {
            return true;
        }
        for (const name in configuration) {
            if (name.startsWith('!')) {
                return false;
            }
        }
        return true;
    }

    /**
     * Maps type to use the given type configuration.
     *
     * @protected
     * @param {Function} type - The type to be mapped
     * @param {Boolean} singleton - Should the type be treated as a singelton?
     * @param {Object|Function} configuration - The mapping configuration or a target type
     * @param {Function} configuration.type - The target type
     * @param {Array} configuration.$name - options starting with a $ will get instanciated via createInstances
     * @param {Array} configuration.name - option will get mapped via a named mapping
     */
    mapType(type, singleton, configuration, parameters) {
        if (!configuration) {
            return;
        }

        // Preserve singleton state
        let isSingleton = singleton;
        if (typeof singleton == 'undefined') {
            const typeKey = this.di.getKeyForType(type);
            if (this.di.mappings.has(typeKey)) {
                isSingleton = this.di.mappings.get(typeKey).isSingleton;
            }
        }

        // Map type
        this.di.map(
            type,
            typeof configuration === 'function' ? configuration : configuration.type,
            isSingleton
        );

        // Map options
        if (typeof configuration !== 'function') {
            const params = parameters || {};
            params.type = false;
            params.sourceType = false;
            for (const name in configuration) {
                // Handle instanciation of array deps
                if (name.startsWith('!')) {
                    const items = this.createInstances(configuration[name]);
                    this.di.map(configuration.type.className + '.' + name.substring(1), items);
                }
                // Handle configured instanciations
                else if (typeof params[name] === 'function') {
                    this.di.map(
                        configuration.type.className + '.' + name,
                        params[name](configuration[name])
                    );
                }
                // Handle simple mapping
                else {
                    this.di.map(configuration.type.className + '.' + name, configuration[name]);
                }
            }
        }
    }

    /**
     * Creates instance of the given type configuration.
     *
     * @protected
     * @returns {Array}
     */
    createInstance(configuration, singleton) {
        if (!configuration) {
            throw new TypeError('Trying to create type with a undefined configuration');
        }
        // Create options
        const options = new Map();
        if (typeof configuration !== 'function') {
            if (!configuration.type) {
                throw new Error('Invalid instance configuration: ' + JSON.stringify(configuration));
            }
            for (const name in configuration) {
                if (name !== 'type') {
                    options.set(configuration.type.className + '.' + name, configuration[name]);
                }
            }
        }

        // Create instance
        const type = typeof configuration === 'function' ? configuration : configuration.type;
        const result = this.di.create(type, options, singleton);

        return result;
    }

    /**
     * Creates an array of instance of the given type configuration.
     *
     * @protected
     * @returns {Array}
     */
    createInstances(configurations, singleton) {
        if (!Array.isArray(configurations)) {
            return [];
        }

        const result = [];
        for (const config of configurations) {
            if (Array.isArray(config)) {
                result.push(this.createInstances(config, singleton));
            } else {
                const instance = this.createInstance(config, singleton);
                result.push(instance);
            }
        }

        return result;
    }

    /**
     * @protected
     * @returns {Promise}
     */
    configureVerbosity() {
        const intel = require('intel');
        const logger = intel.getLogger('entoj');

        if (this.parameters.performance) {
            metrics.enable();
        }

        if (this.parameters.v) {
            logger.setLevel(intel.WARN);
        }
        if (this.parameters.vv) {
            logger.setLevel(intel.INFO);
        }
        if (this.parameters.vvv) {
            logger.setLevel(intel.DEBUG);
        }
        if (this.parameters.vvvv) {
            logger.setLevel(intel.TRACE);
        }
    }

    /**
     * @protected
     * @returns {Promise}
     */
    configureDependencies() {
        // Di
        this.logger.debug('Setup di');
        this.di.map(DIContainer, this.di, true);

        // Globals
        this.di.map('cli/CliLogger.options', {});
        this.di.map(FileWatcher, FileWatcher, true);
        this.di.map(ModelSynchronizer, ModelSynchronizer, true);
        this.di.map(Communication, Communication, true);

        // Configs
        this.logger.debug('Setup configurations');
        this.di.map(Context, this, true);
        this.di.map(
            'model.configuration/GlobalConfiguration.configuration',
            this._configuration || {}
        );
        this.di.map(GlobalConfiguration, GlobalConfiguration, true);
        this.di.map(PathesConfiguration, PathesConfiguration, true);
        this.di.map(UrlsConfiguration, UrlsConfiguration, true);
        this.di.map(
            'model.configuration/BuildConfiguration.options',
            this._configuration.build || {}
        );
        if (this._configuration.parameters && this._configuration.parameters.environment) {
            this.di.map(
                'model.configuration/BuildConfiguration.environment',
                this._configuration.parameters.environment
            );
        }
        this.di.map(BuildConfiguration, BuildConfiguration, true);
        this.di.map(SystemModuleConfiguration, SystemModuleConfiguration, true);

        // Repositories
        this.logger.debug('Setup repositories');
        this.di.map(SitesRepository, SitesRepository, true);
        this.di.map(EntityCategoriesRepository, EntityCategoriesRepository, true);
        this.di.map(EntitiesRepository, EntitiesRepository, true);
        this.di.map(FilesRepository, FilesRepository, true);
        this.di.map(SettingsRepository, SettingsRepository, true);

        // Sites
        this.logger.debug('Setup sites');
        this.di.map(SitesLoader, SitesLoader, true);

        // Entities
        this.logger.debug('Setup entities');
        this.di.map(IdParser, CompactIdParser, true);
        this.di.map(EntityCategoriesLoader, EntityCategoriesLoader, true);
        this.di.map(EntitiesLoader, EntitiesLoader, true);

        // Global simple mappings
        this.logger.debug('Adding simple mappings');
        if (this._configuration.mappings && this._configuration.mappings.length) {
            for (const mapping of this._configuration.mappings) {
                if (this.isSimpleMapping(mapping)) {
                    const type = typeof mapping === 'function' ? mapping : mapping.type;
                    const sourceType = mapping.sourceType || type;
                    if (sourceType) {
                        this.mapType(sourceType, undefined, mapping);
                    }
                }
            }
        }

        // Global mappings
        this.logger.debug('Adding complex mappings');
        if (this._configuration.mappings && this._configuration.mappings.length) {
            for (const mapping of this._configuration.mappings) {
                if (!this.isSimpleMapping(mapping)) {
                    const type = typeof mapping === 'function' ? mapping : mapping.type;
                    const sourceType = mapping.sourceType || type;
                    if (sourceType) {
                        this.mapType(sourceType, undefined, mapping);
                    }
                }
            }
        }

        // Commands
        this.logger.debug('Setup commands');
        if (this._configuration.commands && this._configuration.commands.length) {
            const commands = [];
            for (const command of this._configuration.commands) {
                const commandType = typeof command === 'function' ? command : command.type;
                this.mapType(commandType, false, command);
                commands.push(commandType);
            }
            this.di.map('application/Runner.commands', commands);
        } else {
            this.di.map('application/Runner.commands', []);
        }
    }

    /**
     * @protected
     */
    configure() {
        this.configureVerbosity();
        this.configureDependencies();
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.Context = Context;
