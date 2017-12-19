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
        ? data[key].find((i) => (i && i.type === type))
        : data[key];
    if (!config)
    {
        config =
        {
            type: type,
            sourceType: type
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
        this._local = this.localConfiguration || {},
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
     * Adds a usable default configuration
     */
    setup()
    {
        // Some helpers
        const siteTemplate = this.options.siteTemplate || '${site.name.urlify()}';
        const entityCategoryTemplate = siteTemplate + (this.options.entityCategoryTemplate || '/${entityCategory.pluralName.urlify()}');
        const entityIdTemplate = entityCategoryTemplate + (this.options.entityIdTemplate || '/${entityCategory.shortName.urlify()}-${entityId.name.urlify()}');

        // Settings
        this.settings.formats =
        {
            date: 'DD.MM.YYYY',
            number: '0.00'
        };

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
            {
                root: this.options.root,
                cacheTemplate: '${root}/entoj/cache',
                sitesTemplate: '${root}/sites',
                siteTemplate: '${sites}/' + siteTemplate,
                entityCategoryTemplate: '${sites}/' + entityCategoryTemplate,
                entityIdTemplate: '${sites}/' + entityIdTemplate
            });

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
        this.mappings.add(require('../model/index.js').entity.EntityCategoriesLoader,
            {
                categories:
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
                ]
            });

        // Entities
        this.mappings.add(require('../parser/index.js').entity.CompactIdParser);
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

        // Translations
        if (this.options.translationsFile)
        {
            this.mappings.add(require('../model/translation/TranslationsLoader.js').TranslationsLoader,
                {
                    filename: this.options.translationsFile
                });
        }

        // Settings
        if (this.options.settingsFile)
        {
            this.mappings.add(require('../model/setting/SettingsLoader.js').SettingsLoader,
                {
                    filename: this.options.settingsFile
                });
        }

        // Nunjucks filter
        this.mappings.add(require('../nunjucks/index.js').Environment,
            {
                options:
                {
                    basePath: this.pathes.root + '/sites'
                },
                '!filters':
                [
                    {
                        type: require('../nunjucks/index.js').filter.AssetUrlFilter,
                        baseUrl: this.options.assetUrl || '/'
                    },
                    require('../nunjucks/index.js').filter.AttributesFilter,
                    require('../nunjucks/index.js').filter.EmptyFilter,
                    require('../nunjucks/index.js').filter.FormatDateFilter,
                    require('../nunjucks/index.js').filter.FormatNumberFilter,
                    require('../nunjucks/index.js').filter.HyphenateFilter,
                    require('../nunjucks/index.js').filter.LinkUrlFilter,
                    require('../nunjucks/index.js').filter.LoadFilter,
                    require('../nunjucks/index.js').filter.MarkdownFilter,
                    require('../nunjucks/index.js').filter.MarkupFilter,
                    require('../nunjucks/index.js').filter.MediaQueryFilter,
                    require('../nunjucks/index.js').filter.ModuleClassesFilter,
                    require('../nunjucks/index.js').filter.NotEmptyFilter,
                    require('../nunjucks/index.js').filter.SetFilter,
                    require('../nunjucks/index.js').filter.SettingFilter,
                    {
                        type: require('../nunjucks/index.js').filter.SvgUrlFilter,
                        baseUrl: this.options.svgUrl || '/'
                    },
                    {
                        type: require('../nunjucks/index.js').filter.SvgViewBoxFilter,
                        basePath: this.options.svgUrl || '/'
                    },
                    require('../nunjucks/index.js').filter.TranslateFilter,
                    require('../nunjucks/index.js').filter.UniqueFilter
                ]
            }
        );

        // Server
        this.commands.add(require('../command/index.js').ServerCommand,
            {
                options:
                {
                    port: this.local.port || 3000,
                    http2: this.local.http2 || false,
                    sslKey: this.local.sslKey || false,
                    sslCert: this.local.sslCert || false,
                    authentication: this.local.authentication || false,
                    credentials: this.local.credentials || { username: 'entoj', password: 'entoj' },
                    routes:
                    [
                        {
                            type: require('../server/index.js').route.StaticFileRoute,
                            options:
                            {
                                basePath: '${sites}'
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
     * Registers a plugin configuration
     *
     * @param {Object} module
     */
    register(module)
    {
        module.register(this);
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.Configuration = Configuration;
