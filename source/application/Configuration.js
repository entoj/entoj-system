'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;

/**
 * Merges two object
 *
 * @param {*} target
 * @param {*} source
 */
function merge(target, source) {
    if (Array.isArray(target)) {
        if (Array.isArray(source)) {
            target.push(...source);
        } else {
            target.push(source);
        }
    } else {
        for (const key in source) {
            if (typeof target[key] === 'function') {
                //nop
            } else if (typeof target[key] === 'undefined') {
                target[key] = source[key];
            } else {
                if (Array.isArray(target[key])) {
                    target[key].push(...source[key]);
                } else if (
                    typeof source[key] === 'string' ||
                    typeof source[key] === 'number' ||
                    typeof source[key] === 'boolean'
                ) {
                    target[key] = source[key];
                } else {
                    merge(target[key], source[key]);
                }
            }
        }
    }
}

/**
 * Adds values to a configuration
 *
 * @param {*} data
 * @param {*} key
 * @param {*} type
 * @param {*} values
 */
function add(data, key, type, sourceType, values) {
    // Get args
    if (typeof type !== 'function') {
        values = type;
        type = false;
        sourceType = false;
    } else if (typeof sourceType !== 'function') {
        values = sourceType;
        sourceType = type;
    }

    // Make sure key is there
    if (typeof data[key] === 'undefined') {
        data[key] = [];
    }

    // Get config
    let config = type
        ? data[key].find((i) => {
              return (
                  i &&
                  (i.type === type ||
                      (i.type.className && type.className && i.type.className === type.className))
              );
          })
        : data[key];
    if (!config) {
        config = {
            type: type,
            sourceType: sourceType
        };
        data[key].push(config);
    }

    // Merge
    merge(config, values);

    return true;
}

/**
 * The application configuration object
 *
 * @memberOf application
 * @extends {Base}
 */
class Configuration extends Base {
    /**
     * @param {Object} [options]
     * @param {Object} [localConfiguration]
     */
    constructor(options, localConfiguration) {
        super();

        // Initialize
        this._options = options || {};
        this._local = localConfiguration || {};
        this._mappings = [];
        this._commands = [];
        this._build = {
            default: 'development',
            environments: {}
        };

        // Add functions
        this.mappings.add = (type, sourceType, values) =>
            add(this, 'mappings', type, sourceType, values);
        this.commands.add = (type, sourceType, values) =>
            add(this, 'commands', type, sourceType, values);
        this.build.add = (values) => Object.assign(this._build, values);
        this.build.environments.add = (values) => Object.assign(this._build.environments, values);

        // Setup
        this.setup();
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'application/Configuration';
    }

    /**
     * Creates a usable default configuration
     */
    setup() {
        // Sites
        this.mappings.add(require('../model/index.js').site.SitesLoader, {
            '!plugins': [
                require('../model/index.js').loader.documentation.PackagePlugin,
                require('../model/index.js').loader.documentation.MarkdownPlugin
            ]
        });

        // Entities
        this.mappings.add(require('../parser/index.js').entity.CompactIdParser, {
            options: {
                useNumbers: false
            }
        });
        this.mappings.add(require('../model/index.js').entity.EntitiesLoader, {
            '!plugins': [
                require('../model/index.js').loader.documentation.PackagePlugin,
                {
                    type: require('../model/index.js').loader.documentation.MarkdownPlugin,
                    options: {
                        sections: {
                            DESCRIPTION: 'Abstract',
                            FUNCTIONAL: 'Functional'
                        }
                    }
                },
                require('../model/index.js').loader.documentation.JinjaPlugin,
                require('../model/index.js').loader.documentation.ExamplePlugin
            ]
        });

        // ViewModel
        this.mappings.add(require('../model/index.js').viewmodel.ViewModelRepository, {
            '!plugins': [
                require('../model/index.js').viewmodel.plugin.ViewModelImportPlugin,
                require('../model/index.js').viewmodel.plugin.ViewModelLipsumPlugin,
                require('../model/index.js').viewmodel.plugin.ViewModelLipsumHtmlPlugin
            ]
        });

        // ModelSynchronizer
        this.mappings.add(require('../watch/index.js').ModelSynchronizer, {
            '!plugins': [
                require('../watch/index.js').ModelSynchronizerSettingsPlugin,
                require('../watch/index.js').ModelSynchronizerEntitiesPlugin,
                require('../watch/index.js').ModelSynchronizerSitesPlugin
            ]
        });

        // Nunjucks filter & tags
        this.mappings.add(require('../nunjucks/index.js').Environment, {
            options: {
                templatePaths: '${path.sites}'
            },
            '!tags': [
                {
                    type: require('../nunjucks/index.js').tag.ConfigurationTag
                }
            ],
            '!filters': this.clean([
                {
                    type: require('../nunjucks/index.js').filter.AssetUrlFilter
                },
                {
                    type: require('../nunjucks/index.js').filter.AttributesFilter
                },
                {
                    type: require('../nunjucks/index.js').filter.DebugFilter
                },
                {
                    type: require('../nunjucks/index.js').filter.EmptyFilter
                },
                {
                    type: require('../nunjucks/index.js').filter.HyphenateFilter
                },
                {
                    type: require('../nunjucks/index.js').filter.JsonEncodeFilter
                },
                {
                    type: require('../nunjucks/index.js').filter.LinkUrlFilter
                },
                {
                    type: require('../nunjucks/index.js').filter.LipsumFilter
                },
                {
                    type: require('../nunjucks/index.js').filter.LoadFilter
                },
                {
                    type: require('../nunjucks/index.js').filter.MarkdownFilter
                },
                {
                    type: require('../nunjucks/index.js').filter.MarkupFilter
                },
                {
                    type: require('../nunjucks/index.js').filter.MediaQueryFilter
                },
                {
                    type: require('../nunjucks/index.js').filter.ModuleClassesFilter
                },
                {
                    type: require('../nunjucks/index.js').filter.NotEmptyFilter
                },
                {
                    type: require('../nunjucks/index.js').filter.GetFilter
                },
                {
                    type: require('../nunjucks/index.js').filter.SetFilter
                },
                {
                    type: require('../nunjucks/index.js').filter.SettingFilter
                },
                {
                    type: require('../nunjucks/index.js').filter.SvgUrlFilter
                },
                {
                    type: require('../nunjucks/index.js').filter.SvgViewBoxFilter
                },
                {
                    type: require('../nunjucks/index.js').filter.UniqueFilter
                }
            ])
        });

        // Linter
        this.commands.add(require('../command/index.js').LintCommand, {
            '!linters': [
                {
                    type: require('../linter/index.js').NunjucksFileLinter
                }
            ]
        });

        // Server
        this.commands.add(require('../command/index.js').ServerCommand, {
            routes: [
                {
                    type: require('../server/index.js').route.StaticFileRoute,
                    options: {
                        basePath: '${path.sites}'
                    }
                },
                {
                    type: require('../server/index.js').route.EntityTemplateRoute,
                    options: {
                        basePath: '${path.sites}'
                    }
                }
            ]
        });
    }

    /**
     * @type {Object}
     */
    get options() {
        return this._options;
    }

    /**
     * @type {Object}
     */
    get local() {
        return this._local;
    }

    /**
     * @type {Object}
     */
    get mappings() {
        return this._mappings;
    }

    /**
     * @type {Object}
     */
    get commands() {
        return this._commands;
    }

    /**
     * @type {Object}
     */
    get build() {
        return this._build;
    }

    /**
     * Cleans configuration from undefined values
     *
     * @param {*} data
     */
    clean(data) {
        if (typeof data === 'object') {
            for (const key in data) {
                if (typeof data[key] === 'undefined') {
                    this.logger.debug('removing config ' + key);
                    delete data[key];
                }
            }
        }
        if (Array.isArray(data)) {
            for (const item of data) {
                this.clean(item);
            }
        }
        return data;
    }

    /**
     * Registers a plugin configuration
     *
     * @param {Object} module
     * @param {Object} options
     */
    register(module, options) {
        if (module && typeof module.register === 'function') {
            module.register(this, options);
        } else {
            this.logger.warn('Error registering module', module);
        }
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.Configuration = Configuration;
