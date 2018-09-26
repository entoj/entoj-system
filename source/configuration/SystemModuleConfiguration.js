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
 * @memberOf configuration
 */
class SystemModuleConfiguration extends ModuleConfiguration {
    /**
     * @inheritDoc
     */
    static get injections() {
        return {
            parameters: [
                GlobalConfiguration,
                BuildConfiguration,
                'configuration/SystemModuleConfiguration.options'
            ]
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
    createConfigurations() {
        // Pathes
        this.addConfiguration('path.base', 'system.path.base', __dirname);
        this.addConfiguration('path.data', 'system.path.data', '${path.base}/data');
        this.addConfiguration('path.entoj', 'system.path.entoj', '${path.base}');
        this.addConfiguration('path.cache', 'system.path.cache', '${path.base}/cache');
        this.addConfiguration('path.sites', 'system.path.sites', '${path.base}/sites');
        this.addConfiguration(
            'path.site',
            'system.path.site',
            '${path.sites}/${site.name.toLowerCase()}'
        );
        this.addConfiguration(
            'path.entityCategory',
            'system.path.entityCategory',
            '${path.site}/${entityCategory.pluralName.toLowerCase()}'
        );
        this.addConfiguration(
            'path.entityId',
            'system.path.entityId',
            '${path.entityCategory}/${entityCategory.shortName.toLowerCase()}-${entityId.name.toLowerCase()}'
        );

        // Urls
        this.addConfiguration('url.base', 'system.url.base', '');
        this.addConfiguration('url.site', 'system.url.site', '${url.base}/${site.name.urlify()}');
        this.addConfiguration(
            'url.entityCategory',
            'system.url.entityCategory',
            '${url.site}/${entityCategory.pluralName.urlify()}'
        );
        this.addConfiguration(
            'url.entityId',
            'system.url.entityId',
            '${url.entityCategory}/${entityCategory.shortName.toLowerCase()}-${entityId.name.urlify()}'
        );

        // Routes
        this.addConfiguration('route.base', 'system.route.base', '');
        this.addConfiguration('route.site', 'system.route.site', '${route.base}/:site');
        this.addConfiguration(
            'route.entityCategory',
            'system.route.entityCategory',
            '${route.site}/:entityCategory'
        );
        this.addConfiguration(
            'route.entityId',
            'system.route.entityId',
            '${route.entityCategory}/:entityId'
        );

        // Breakpoints
        this.addConfiguration('breakpoints', 'system.breakpoints', breakpoints);
        this.addConfiguration('mediaQueries', false, {});
    }

    /**
     * @inheritDoc
     */
    changedConfigurations() {
        super.changedConfigurations();

        // Update mediaQueries
        const breakpoints = this.rawConfigurations.get('breakpoints').value;
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
        this.updateConfiguration('mediaQueries', mediaQueries);
    }

    /**
     * A map of all named breakpoints
     *
     * @type {Object}
     */
    get breakpoints() {
        return this.configurations.get('breakpoints');
    }

    /**
     * A map containing the derived media queries from breakpoints
     *
     * @type {Object}
     */
    get mediaQueries() {
        return this.configurations.get('mediaQueries');
    }

    /**
     * @type {String}
     */
    get pathBase() {
        return this.configurations.get('path.base');
    }

    /**
     * @type {String}
     */
    get pathSite() {
        return this.configurations.get('path.site');
    }

    /**
     * @type {String}
     */
    get pathEntityCategory() {
        return this.configurations.get('path.entityCategory');
    }

    /**
     * @type {String}
     */
    get pathEntityId() {
        return this.configurations.get('path.entityId');
    }

    /**
     * The base url path
     *
     * @type {String}
     */
    get urlBase() {
        return this.configurations.get('url.base');
    }

    /**
     * The url for a site
     *
     * @type {String}
     */
    get urlSite() {
        return this.configurations.get('url.site');
    }

    /**
     * The url for a entity category
     *
     * @type {String}
     */
    get urlEntityCategory() {
        return this.configurations.get('url.entityCategory');
    }

    /**
     * The url for a entity
     *
     * @type {String}
     */
    get urlEntityId() {
        return this.configurations.get('url.entityId');
    }

    /**
     * @type {String}
     */
    get routeBase() {
        return this.configurations.get('route.base');
    }

    /**
     * @type {String}
     */
    get routeSite() {
        return this.configurations.get('route.site');
    }

    /**
     * @type {String}
     */
    get routeEntityCategory() {
        return this.configurations.get('route.entityCategory');
    }

    /**
     * @type {String}
     */
    get routeEntityId() {
        return this.configurations.get('route.entityId');
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.SystemModuleConfiguration = SystemModuleConfiguration;
