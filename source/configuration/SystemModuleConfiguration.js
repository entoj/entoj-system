'use strict';

/**
 * Requirements
 * @ignore
 */
const ModuleConfiguration = require('./ModuleConfiguration.js').ModuleConfiguration;
const BuildConfiguration = require('../model/configuration/BuildConfiguration.js')
    .BuildConfiguration;
const GlobalConfiguration = require('../model/configuration/GlobalConfiguration.js')
    .GlobalConfiguration;
const path = require('path');

/**
 * @ignore
 */
const breakpoints = {
    application: {
        minWidth: '1280px'
    },
    desktop: {
        minWidth: '1025px',
        maxWidth: '1279px'
    },
    tablet: {
        minWidth: '1024px',
        maxWidth: '1024px'
    },
    miniTablet: {
        minWidth: '768px',
        maxWidth: '1023px'
    },
    phablet: {
        minWidth: '376px',
        maxWidth: '767px'
    },
    mobile: {
        maxWidth: '375px'
    }
};

/**
 * @ignore
 */
const entityCategories = [
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

/**
 * @memberOf configuration
 */
class SystemModuleConfiguration extends ModuleConfiguration {
    /**
     * @inheritDoc
     */
    constructor(globalConfiguration, buildConfiguration) {
        super(globalConfiguration, buildConfiguration);
        this._name = 'system';
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return {
            parameters: [GlobalConfiguration, BuildConfiguration]
        };
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'configuration/SystemModuleConfiguration';
    }

    /**
     * @inheritDoc
     */
    createMeta() {
        // Cli
        this.addMeta('cliArguments', 'system.cli.arguments', { _: [] });

        // EntityCategories
        this.addMeta('entityCategories', 'system.entity.categories', entityCategories);

        // Pathes
        this.addMeta('pathBase', 'system.path.base', '/path/to/project');
        this.addMeta('pathData', 'system.path.data', '${system.path.base}/data');
        this.addMeta('pathEntoj', 'system.path.entoj', '${system.path.base}');
        this.addMeta('pathCache', 'system.path.cache', '${system.path.base}/cache');
        this.addMeta('pathSites', 'system.path.sites', '${system.path.base}/sites');
        this.addMeta(
            'pathSite',
            'system.path.site',
            '${system.path.sites}/${site.name.toLowerCase().dasherize()}'
        );
        this.addMeta(
            'pathEntityCategory',
            'system.path.entityCategory',
            '${system.path.site}/${entityCategory.pluralName.toLowerCase().dasherize()}'
        );
        this.addMeta(
            'pathEntityId',
            'system.path.entityId',
            '${system.path.entityCategory}/${entityCategory.shortName.toLowerCase()}-${entityId.name.toLowerCase().dasherize()}'
        );

        // Filenames
        this.addMeta(
            'filenameSettings',
            'system.filename.settings',
            '${system.path.site}/settings.json'
        );

        // Urls
        this.addMeta('urlBase', 'system.url.base', '');
        this.addMeta('urlSite', 'system.url.site', '${system.url.base}/${site.name.urlify()}');
        this.addMeta(
            'urlEntityCategory',
            'system.url.entityCategory',
            '${system.url.site}/${entityCategory.pluralName.urlify()}'
        );
        this.addMeta(
            'urlEntityId',
            'system.url.entityId',
            '${system.url.entityCategory}/${entityCategory.shortName.toLowerCase()}-${entityId.name.urlify()}'
        );

        // Routes
        this.addMeta('routeBase', 'system.route.base', '');
        this.addMeta('routeSite', 'system.route.site', '${system.route.base}/:site');
        this.addMeta(
            'routeEntityCategory',
            'system.route.entityCategory',
            '${system.route.site}/:entityCategory'
        );
        this.addMeta(
            'routeEntityId',
            'system.route.entityId',
            '${system.route.entityCategory}/:entityId'
        );

        // Breakpoints
        this.addMeta('breakpoints', 'system.breakpoints', breakpoints);
        this.addMeta('mediaQueries', false, {});

        // Server
        this.addMeta('serverPort', 'system.server.port', 3000);
        this.addMeta('serverHttp2', 'system.server.http2', false);
        this.addMeta(
            'serverSslKey',
            'system.server.sslKey',
            __dirname + '/../server/localhost.key'
        );
        this.addMeta(
            'serverSslCert',
            'system.server.sslCert',
            __dirname + '/../server/localhost.crt'
        );
        this.addMeta('serverAuthentication', 'system.server.authentication', false);
        this.addMeta('serverUsername', 'system.server.username', 'entoj');
        this.addMeta('serverPassword', 'system.server.password', 'entoj');
        this.addMeta('serverBaseUrl', 'system.server.baseUrl', 'http://localhost:3000');
        this.addMeta('serverAllowedStaticExtensions', 'system.server.allowedStaticExtensions', [
            '.css',
            '.png',
            '.jpg',
            '.gif',
            '.svg',
            '.woff',
            '.woff2',
            '.json',
            '.ico',
            '.html'
        ]);

        // Filters
        this.addMeta('filterAssetUrlBaseUrl', 'system.filter.assetUrl.baseUrl', '/');
        this.addMeta('filterSvgUrlBaseUrl', 'system.filter.svgUrl.baseUrl', '/');
        this.addMeta('filterSvgViewBoxBasePath', 'system.filter.svgViewBox.basePath', '/');
        this.addMeta('filterLinkUrlProperties', 'system.filter.linkUrl.properties', ['url']);
        this.addMeta('filterMarkupStyles', 'system.filter.markup.styles', {
            plain: 'plain',
            html: 'html'
        });
    }

    /**
     * @inheritDoc
     */
    changedMeta() {
        super.changedMeta();

        // Update mediaQueries
        const breakpoints = this.meta.get('breakpoints').value;
        const mediaQueries = {};
        for (const breakpointName in breakpoints) {
            const breakpoint = breakpoints[breakpointName];
            if (breakpoint.maxWidth) {
                mediaQueries[breakpointName + 'AndBelow'] =
                    '(max-width: ' + breakpoint.maxWidth + ')';
            }
            if (breakpoint.minWidth) {
                mediaQueries[breakpointName + 'AndAbove'] =
                    '(min-width: ' + breakpoint.minWidth + ')';
            }
            mediaQueries[breakpointName] = '';
            if (breakpoint.minWidth) {
                mediaQueries[breakpointName] += '(min-width: ' + breakpoint.minWidth + ')';
            }
            if (breakpoint.maxWidth) {
                mediaQueries[breakpointName] +=
                    (mediaQueries[breakpointName].length ? ' and ' : '') +
                    '(max-width: ' +
                    breakpoint.maxWidth +
                    ')';
            }
        }
        this.updateMeta('mediaQueries', mediaQueries);
    }

    /**
     * @inheritDoc
     */
    finalizeConfiguration() {
        super.finalizeConfiguration();

        // Pathes
        this.configuration.set('pathBase', path.resolve(this.configuration.get('pathBase')));
        this.configuration.set('pathData', path.resolve(this.configuration.get('pathData')));
        this.configuration.set('pathEntoj', path.resolve(this.configuration.get('pathEntoj')));
        this.configuration.set('pathCache', path.resolve(this.configuration.get('pathCache')));
        this.configuration.set('pathSites', path.resolve(this.configuration.get('pathSites')));

        // Server
        this.configuration.set(
            'serverBaseUrl',
            'http' +
                (this.configuration.get('serverHttp2') ? 's' : '') +
                '://localhost:' +
                this.configuration.get('serverPort')
        );
    }

    /**
     * The parsed arguments to the shell entry point.
     *
     * @type {Object}
     */
    get cliArguments() {
        return this.configuration.get('cliArguments');
    }

    /**
     * A list of all entity category configurations.
     *
     * The configurations are used to create EntityCategory objects from them.
     * So you may use all defined fields of EntityCategory.
     *
     * @see {model.entity.EntityCategory}
     * @type {Array}
     */
    get entityCategories() {
        return this.configuration.get('entityCategories');
    }

    /**
     * A map of all named breakpoints
     *
     * You can specify the minWidth and maxWidth for each breakpoint.
     *
     * @type {Object}
     */
    get breakpoints() {
        return this.configuration.get('breakpoints');
    }

    /**
     * A map containing the derived media queries from breakpoints.
     *
     * Thse media queries are generated automatically.
     *
     * @type {Object}
     */
    get mediaQueries() {
        return this.configuration.get('mediaQueries');
    }

    /**
     * The base or root path of a entoj project
     *
     * @type {String}
     */
    get pathBase() {
        return this.configuration.get('pathBase');
    }

    /**
     * The path where entoj-confuguration.js lives
     *
     * @type {String}
     */
    get pathEntoj() {
        return this.configuration.get('pathEntoj');
    }

    /**
     * The path to a cache or temp directory
     *
     * @type {String}
     */
    get pathCache() {
        return this.configuration.get('pathCache');
    }

    /**
     * The path to a persistent data directory used to store project related data.
     *
     * @type {String}
     */
    get pathData() {
        return this.configuration.get('pathData');
    }

    /**
     * The path to the base directory for sites
     *
     * @type {String}
     */
    get pathSites() {
        return this.configuration.get('pathSites');
    }

    /**
     * The path to a specific site.
     *
     * @type {String}
     */
    get pathSite() {
        return this.configuration.get('pathSite');
    }

    /**
     * The path to a specific entity categery in a specific site.
     *
     * @type {String}
     */
    get pathEntityCategory() {
        return this.configuration.get('pathEntityCategory');
    }

    /**
     * The path to a specific entity in a specific site.
     *
     * @type {String}
     */
    get pathEntityId() {
        return this.configuration.get('pathEntityId');
    }

    /**
     * The path to the settings file for a site.
     *
     * You should to use the ${system.path.site} variable if you happen to have more than one site.
     *
     * @type {String}
     */
    get filenameSettings() {
        return this.configuration.get('filenameSettings');
    }

    /**
     * The base url path
     *
     * @type {String}
     */
    get urlBase() {
        return this.configuration.get('urlBase');
    }

    /**
     * The url for a site
     *
     * @type {String}
     */
    get urlSite() {
        return this.configuration.get('urlSite');
    }

    /**
     * The url for a entity category (which lives inside a site)
     *
     * @type {String}
     */
    get urlEntityCategory() {
        return this.configuration.get('urlEntityCategory');
    }

    /**
     * The url for a entity (which lives inside a entity category)
     *
     * @type {String}
     */
    get urlEntityId() {
        return this.configuration.get('urlEntityId');
    }

    /**
     * @type {String}
     */
    get routeBase() {
        return this.configuration.get('routeBase');
    }

    /**
     * @type {String}
     */
    get routeSite() {
        return this.configuration.get('routeSite');
    }

    /**
     * @type {String}
     */
    get routeEntityCategory() {
        return this.configuration.get('routeEntityCategory');
    }

    /**
     * @type {String}
     */
    get routeEntityId() {
        return this.configuration.get('routeEntityId');
    }

    /**
     * @type {String}
     */
    get serverPort() {
        return this.configuration.get('serverPort');
    }

    /**
     * @type {String}
     */
    get serverHttp2() {
        return this.configuration.get('serverHttp2');
    }

    /**
     * @type {String}
     */
    get serverSslKey() {
        return this.configuration.get('serverSslKey');
    }

    /**
     * @type {String}
     */
    get serverSslCert() {
        return this.configuration.get('serverSslCert');
    }

    /**
     * @type {String}
     */
    get serverAuthentication() {
        return this.configuration.get('serverAuthentication');
    }

    /**
     * @type {String}
     */
    get serverUsername() {
        return this.configuration.get('serverUsername');
    }

    /**
     * @type {String}
     */
    get serverPassword() {
        return this.configuration.get('serverPassword');
    }

    /**
     * @type {String}
     */
    get serverBaseUrl() {
        return this.configuration.get('serverBaseUrl');
    }

    /**
     * @type {String}
     */
    get serverAllowedStaticExtensions() {
        return this.configuration.get('serverAllowedStaticExtensions');
    }

    /**
     * @type {String}
     */
    get filterAssetUrlBaseUrl() {
        return this.configuration.get('filterAssetUrlBaseUrl');
    }

    /**
     * @type {String}
     */
    get filterSvgUrlBaseUrl() {
        return this.configuration.get('filterSvgUrlBaseUrl');
    }

    /**
     * @type {String}
     */
    get filterSvgViewBoxBasePath() {
        return this.configuration.get('filterSvgViewBoxBasePath');
    }

    /**
     * @type {Array}
     */
    get filterLinkUrlProperties() {
        return this.configuration.get('filterLinkUrlProperties');
    }

    /**
     * @type {Array}
     */
    get filterMarkupStyles() {
        return this.configuration.get('filterMarkupStyles');
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.SystemModuleConfiguration = SystemModuleConfiguration;
