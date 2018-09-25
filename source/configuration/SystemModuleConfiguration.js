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
        this.addConfiguration('urlBase', 'system.url.base', '');
        this.addConfiguration('routeBase', 'system.route.base', '');
        this.addConfiguration('urlSite', 'system.url.site', '${url.base}/${site.name.urlify()}');
        this.addConfiguration('routeSite', 'system.route.site', '${urlBase}/:site');
        this.addConfiguration(
            'urlEntityCategory',
            'system.url.entityCategory',
            '${urlSite}/${entityCategory.pluralName.urlify()}'
        );
        this.addConfiguration(
            'routeEntityCategory',
            'system.route.entityCategory',
            '${routeSite}/:entityCategory'
        );
        this.addConfiguration(
            'urlEntityId',
            'system.url.entityId',
            '${urlEntityCategory}/${entityCategory.shortName.toLowerCase()}-${entityId.name.urlify()}'
        );
        this.addConfiguration(
            'routeEntityId',
            'system.route.entityId',
            '${routeEntityCategory}/:entityId'
        );

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
     * The base url path
     *
     * @type {String}
     */
    get urlBase() {
        return this.configurations.get('urlBase');
    }

    /**
     * The url for a site
     *
     * @type {String}
     */
    get urlSite() {
        return this.configurations.get('urlSite');
    }

    /**
     * The url for a entity category
     *
     * @type {String}
     */
    get urlEntityCategory() {
        return this.configurations.get('urlEntityCategory');
    }

    /**
     * The url for a entity
     *
     * @type {String}
     */
    get urlEntityId() {
        return this.configurations.get('urlEntityId');
    }

    /**
     * @type {String}
     */
    get routeBase() {
        return this.configurations.get('routeBase');
    }

    /**
     * @type {String}
     */
    get routeSite() {
        return this.configurations.get('routeSite');
    }

    /**
     * @type {String}
     */
    get routeEntityCategory() {
        return this.configurations.get('routeEntityCategory');
    }

    /**
     * @type {String}
     */
    get routeEntityId() {
        return this.configurations.get('routeEntityId');
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.SystemModuleConfiguration = SystemModuleConfiguration;
