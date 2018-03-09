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
function merge(target, source)
{
    if (Array.isArray(target))
    {
        if (Array.isArray(source))
        {
            target.push(...source);
        }
        else
        {
            target.push(source);
        }
    }
    else
    {
        for (const key in source)
        {
            if (typeof target[key] === 'function')
            {
                //nop
            }
            else if (typeof target[key] === 'undefined')
            {
                target[key] = source[key];
            }
            else
            {
                if (Array.isArray(target[key]))
                {
                    target[key].push(...source[key]);
                }
                else if (typeof source[key] === 'string' ||
                         typeof source[key] === 'number' ||
                         typeof source[key] === 'boolean')
                {
                    target[key] = source[key];
                }
                else
                {
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
function add(data, key, type, sourceType, values)
{
    // Get args
    if (typeof type !== 'function')
    {
        values = type;
        type = false;
        sourceType = false;
    }
    else if (typeof sourceType !== 'function')
    {
        values = sourceType;
        sourceType = type;
    }

    // Make sure key is there
    if (typeof data[key] === 'undefined')
    {
        data[key] = [];
    }

    // Get config
    let config = type
        ? data[key].find((i) =>
        {
            return (i && ((i.type === type) ||
                            (i.type.className && type.className && i.type.className === type.className)));
        })
        : data[key];
    if (!config)
    {
        config =
        {
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
class Configuration extends Base
{
    /**
     * @param {Object} [options]
     * @param {Object} [localConfiguration]
     */
    constructor(options, localConfiguration)
    {
        super();

        // Initialize
        this._options = options || {};
        this._options.pathes = this._options.pathes || {};
        this._options.filters = this._options.filters || {};
        this._options.models = this._options.models || {};
        this._options.server = this._options.server || {};
        this._local = localConfiguration || {},
        this._settings = {};
        this._urls = {};
        this._pathes = {};
        this._mappings = [];
        this._commands = [];
        this._build =
        {
            default: 'development',
            environments: {}
        };

        // Add functions
        this.mappings.add = (type, sourceType, values) => add(this, 'mappings', type, sourceType, values);
        this.settings.add = (type, sourceType, values) => add(this, 'settings', type, sourceType, values);
        this.commands.add = (type, sourceType, values) => add(this, 'commands', type, sourceType, values);
        this.pathes.add = (values) => Object.assign(this._pathes, values);
        this.urls.add = (values) => Object.assign(this._urls, values);
        this.build.add = (values) => Object.assign(this._build, values);
        this.build.environments.add = (values) => Object.assign(this._build.environments, values);

        // Setup
        this.setup();
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'application/Configuration';
    }


    /**
     * Creates a usable default configuration
     */
    setup()
    {
        // Some helpers
        const siteTemplate = this.options.siteTemplate || '${site.name.urlify()}';
        const entityCategoryTemplate = siteTemplate + '/' + (this.options.entityCategoryTemplate || '${entityCategory.pluralName.urlify()}');
        const entityIdTemplate = entityCategoryTemplate + '/' + (this.options.entityIdTemplate || '${entityCategory.shortName.urlify()}-${entityId.name.urlify()}');

        // Settings
        this.settings.add(
            {
                formats:
                {
                    date: 'DD.MM.YYYY',
                    number: '0.00'
                }
            });
        if (this.options.settings)
        {
            this.settings.add(this.options.settings);
        }

        // Urls
        this.urls.add(
            {
                root: '',
                siteTemplate: '${root}/' + siteTemplate,
                entityCategoryTemplate: '${root}/' + entityCategoryTemplate,
                entityIdTemplate: '${root}/' + entityIdTemplate
            });

        // Pathes
        this.pathes.add(
            this.clean(
                {
                    root: this.options.pathes.root,
                    entojTemplate: this.options.pathes.entoj || '${root}',
                    cacheTemplate: '${entoj}/cache',
                    sitesTemplate: '${root}/sites',
                    siteTemplate: '${sites}/' + siteTemplate,
                    entityCategoryTemplate: '${sites}/' + entityCategoryTemplate,
                    entityIdTemplate: '${sites}/' + entityIdTemplate
                }));

        // Sites
        this.mappings.add(require('../model/index.js').site.SitesLoader,
            {
                '!plugins':
                [
                    require('../model/index.js').loader.documentation.PackagePlugin,
                    require('../model/index.js').loader.documentation.MarkdownPlugin
                ]
            });

        // EntityCategories
        const entityCategories = this.options.entityCategories ||
            [
                {
                    longName: 'Global',
                    pluralName: 'Global',
                    isGlobal: true
                },
                {
                    longName: 'Atom'
                },
                {
                    longName: 'Molecule'
                },
                {
                    longName: 'Organism'
                },
                {
                    longName: 'Template'
                },
                {
                    longName: 'Page'
                }
            ];
        this.mappings.add(require('../model/index.js').entity.EntityCategoriesLoader,
            this.clean(
                {
                    categories: entityCategories
                }));

        // Entities
        this.mappings.add(require('../parser/index.js').entity.CompactIdParser,
            {
                options:
                {
                    useNumbers: this.options.entityIdUseNumbers || false
                }
            });
        this.mappings.add(require('../model/index.js').entity.EntitiesLoader,
            {
                '!plugins':
                [
                    require('../model/index.js').loader.documentation.PackagePlugin,
                    {
                        type: require('../model/index.js').loader.documentation.MarkdownPlugin,
                        options:
                        {
                            sections:
                            {
                                DESCRIPTION: 'Abstract',
                                FUNCTIONAL: 'Functional'
                            }
                        }
                    },
                    require('../model/index.js').loader.documentation.JinjaPlugin,
                    require('../model/index.js').loader.documentation.ExamplePlugin,
                    require('../model/index.js').loader.documentation.StyleguidePlugin
                ]
            });

        // ViewModel
        this.mappings.add(require('../model/index.js').viewmodel.ViewModelRepository,
            {
                '!plugins':
                [
                    require('../model/index.js').viewmodel.plugin.ViewModelImportPlugin,
                    require('../model/index.js').viewmodel.plugin.ViewModelLipsumPlugin,
                    require('../model/index.js').viewmodel.plugin.ViewModelLipsumHtmlPlugin
                ]
            });

        // Translations
        this.mappings.add(require('../model/translation/TranslationsLoader.js').TranslationsLoader,
            this.clean(
                {
                    filename: this.options.models.translationsFile
                }));

        // Settings
        this.mappings.add(require('../model/setting/SettingsLoader.js').SettingsLoader,
            this.clean(
                {
                    filename: this.options.models.settingsFile
                }));

        // ModelSynchronizer
        this.mappings.add(require('../watch/index.js').ModelSynchronizer,
            {
                '!plugins':
                [
                    require('../watch/index.js').ModelSynchronizerTranslationsPlugin,
                    require('../watch/index.js').ModelSynchronizerEntitiesPlugin,
                    require('../watch/index.js').ModelSynchronizerSitesPlugin
                ]
            });

        // Nunjucks filter & tags
        this.mappings.add(require('../nunjucks/index.js').Environment,
            {
                options:
                {
                    templatePaths: this.pathes.root + '/sites'
                },
                '!filters': this.clean(
                    [
                        {
                            type: require('../nunjucks/index.js').filter.AssetUrlFilter,
                            baseUrl: this.options.filters.assetUrl
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
                            type: require('../nunjucks/index.js').filter.FormatDateFilter
                        },
                        {
                            type: require('../nunjucks/index.js').filter.FormatNumberFilter
                        },
                        {
                            type: require('../nunjucks/index.js').filter.HyphenateFilter
                        },
                        {
                            type: require('../nunjucks/index.js').filter.LinkUrlFilter,
                            dataProperties: this.options.filters.linkProperties
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
                            type: require('../nunjucks/index.js').filter.MarkupFilter,
                            styles: this.options.filters.markupStyles
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
                            type: require('../nunjucks/index.js').filter.SetFilter
                        },
                        {
                            type: require('../nunjucks/index.js').filter.SettingFilter
                        },
                        {
                            type: require('../nunjucks/index.js').filter.SvgUrlFilter,
                            baseUrl: this.options.filters.svgUrl || '/'
                        },
                        {
                            type: require('../nunjucks/index.js').filter.SvgViewBoxFilter,
                            basePath: this.options.filters.svgPath || '/'
                        },
                        {
                            type: require('../nunjucks/index.js').filter.TranslateFilter
                        },
                        {
                            type: require('../nunjucks/index.js').filter.UniqueFilter
                        }
                    ])
            }
        );

        // Server
        this.commands.add(require('../command/index.js').ServerCommand,
            {
                options:
                {
                    port: this.options.server.port || this.local.port || 3000,
                    http2: this.options.server.http2 || this.local.http2 || false,
                    sslKey: this.options.server.sslKey || this.local.sslKey || false,
                    sslCert: this.options.server.sslCert || this.local.sslCert || false,
                    authentication: this.local.authentication || false,
                    credentials: this.options.server.credentials || this.local.credentials || { username: 'entoj', password: 'entoj' },
                    routes:
                    [
                        {
                            type: require('../server/index.js').route.StaticFileRoute,
                            options:
                            {
                                basePath: '${sites}',
                                allowedExtensions: this.options.server.staticExtensions
                            }
                        },
                        {
                            type: require('../server/index.js').route.EntityTemplateRoute,
                            options:
                            {
                                basePath: '${sites}'
                            }
                        }
                    ]
                }
            }
        );


        // Config
        this.commands.add(require('../command/index.js').ConfigCommand);
    }


    /**
     * @type {Object}
     */
    get options()
    {
        return this._options;
    }


    /**
     * @type {Object}
     */
    get local()
    {
        return this._local;
    }


    /**
     * @type {Object}
     */
    get settings()
    {
        return this._settings;
    }


    /**
     * @type {Object}
     */
    get urls()
    {
        return this._urls;
    }


    /**
     * @type {Object}
     */
    get pathes()
    {
        return this._pathes;
    }


    /**
     * @type {Object}
     */
    get mappings()
    {
        return this._mappings;
    }


    /**
     * @type {Object}
     */
    get commands()
    {
        return this._commands;
    }


    /**
     * @type {Object}
     */
    get build()
    {
        return this._build;
    }


    /**
     * Cleans configuration from undefined values
     *
     * @param {*} data
     */
    clean(data)
    {
        if (typeof data === 'object')
        {
            for (const key in data)
            {
                if (typeof data[key] === 'undefined')
                {
                    this.logger.debug('removing config ' + key);
                    delete data[key];
                }
            }
        }
        if (Array.isArray(data))
        {
            for (const item of data)
            {
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
    register(module, options)
    {
        if (module && typeof module.register === 'function')
        {
            module.register(this, options);
        }
        else
        {
            this.logger.warn('Error registering module', module);
        }
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.Configuration = Configuration;
