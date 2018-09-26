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
 * @memberOf configuration
 */
class SystemModuleConfiguration extends ModuleConfiguration {
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
        // Pathes
        this.addMeta('path.base', 'system.path.base', __dirname);
        this.addMeta('path.data', 'system.path.data', '${path.base}/data');
        this.addMeta('path.entoj', 'system.path.entoj', '${path.base}');
        this.addMeta('path.cache', 'system.path.cache', '${path.base}/cache');
        this.addMeta('path.sites', 'system.path.sites', '${path.base}/sites');
        this.addMeta('path.site', 'system.path.site', '${path.sites}/${site.name.toLowerCase()}');
        this.addMeta(
            'path.entityCategory',
            'system.path.entityCategory',
            '${path.site}/${entityCategory.pluralName.toLowerCase()}'
        );
        this.addMeta(
            'path.entityId',
            'system.path.entityId',
            '${path.entityCategory}/${entityCategory.shortName.toLowerCase()}-${entityId.name.toLowerCase()}'
        );

        // Urls
        this.addMeta('url.base', 'system.url.base', '');
        this.addMeta('url.site', 'system.url.site', '${url.base}/${site.name.urlify()}');
        this.addMeta(
            'url.entityCategory',
            'system.url.entityCategory',
            '${url.site}/${entityCategory.pluralName.urlify()}'
        );
        this.addMeta(
            'url.entityId',
            'system.url.entityId',
            '${url.entityCategory}/${entityCategory.shortName.toLowerCase()}-${entityId.name.urlify()}'
        );

        // Routes
        this.addMeta('route.base', 'system.route.base', '');
        this.addMeta('route.site', 'system.route.site', '${route.base}/:site');
        this.addMeta(
            'route.entityCategory',
            'system.route.entityCategory',
            '${route.site}/:entityCategory'
        );
        this.addMeta(
            'route.entityId',
            'system.route.entityId',
            '${route.entityCategory}/:entityId'
        );

        // Breakpoints
        this.addMeta('breakpoints', 'system.breakpoints', breakpoints);
        this.addMeta('mediaQueries', false, {});
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
        this.configuration.set('path.base', path.resolve(this.configuration.get('path.base')));
        this.configuration.set('path.data', path.resolve(this.configuration.get('path.data')));
        this.configuration.set('path.entoj', path.resolve(this.configuration.get('path.entoj')));
        this.configuration.set('path.cache', path.resolve(this.configuration.get('path.cache')));
        this.configuration.set('path.sites', path.resolve(this.configuration.get('path.sites')));
    }

    /**
     * A map of all named breakpoints
     *
     * @type {Object}
     */
    get breakpoints() {
        return this.configuration.get('breakpoints');
    }

    /**
     * A map containing the derived media queries from breakpoints
     *
     * @type {Object}
     */
    get mediaQueries() {
        return this.configuration.get('mediaQueries');
    }

    /**
     * @type {String}
     */
    get pathBase() {
        return this.configuration.get('path.base');
    }

    /**
     * @type {String}
     */
    get pathEntoj() {
        return this.configuration.get('path.entoj');
    }

    /**
     * @type {String}
     */
    get pathCache() {
        return this.configuration.get('path.cache');
    }

    /**
     * @type {String}
     */
    get pathData() {
        return this.configuration.get('path.data');
    }

    /**
     * @type {String}
     */
    get pathSites() {
        return this.configuration.get('path.sites');
    }

    /**
     * @type {String}
     */
    get pathSite() {
        return this.configuration.get('path.site');
    }

    /**
     * @type {String}
     */
    get pathEntityCategory() {
        return this.configuration.get('path.entityCategory');
    }

    /**
     * @type {String}
     */
    get pathEntityId() {
        return this.configuration.get('path.entityId');
    }

    /**
     * The base url path
     *
     * @type {String}
     */
    get urlBase() {
        return this.configuration.get('url.base');
    }

    /**
     * The url for a site
     *
     * @type {String}
     */
    get urlSite() {
        return this.configuration.get('url.site');
    }

    /**
     * The url for a entity category
     *
     * @type {String}
     */
    get urlEntityCategory() {
        return this.configuration.get('url.entityCategory');
    }

    /**
     * The url for a entity
     *
     * @type {String}
     */
    get urlEntityId() {
        return this.configuration.get('url.entityId');
    }

    /**
     * @type {String}
     */
    get routeBase() {
        return this.configuration.get('route.base');
    }

    /**
     * @type {String}
     */
    get routeSite() {
        return this.configuration.get('route.site');
    }

    /**
     * @type {String}
     */
    get routeEntityCategory() {
        return this.configuration.get('route.entityCategory');
    }

    /**
     * @type {String}
     */
    get routeEntityId() {
        return this.configuration.get('route.entityId');
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.SystemModuleConfiguration = SystemModuleConfiguration;
