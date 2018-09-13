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
 * Defaults
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
     * @param {model.configuration.GlobalConfiguration} globalConfiguration
     * @param {model.configuration.BuildConfiguration} buildConfiguration
     * @param {Object} options
     */
    constructor(globalConfiguration, buildConfiguration, options) {
        super(globalConfiguration, buildConfiguration);

        // Get options
        this._breakpoints = this.getConfiguration('system.breakpoints', breakpoints);
        this._urlBase = this.getConfiguration('system.url.base', '');
        this._urlSite = this.getConfiguration(
            'system.url.site',
            '${urlBase}/${site.name.urlify()}'
        );
        this._routeSite = this.getConfiguration('system.route.site', '${urlBase}/:site');
        this._urlEntityCategory = this.getConfiguration(
            'system.url.entityCategory',
            '${urlSite}/${entityCategory.pluralName.urlify()}'
        );
        this._routeEntityCategory = this.getConfiguration(
            'system.route.entityCategory',
            '${routeSite}/:entityCategory'
        );
        this._urlEntityId = this.getConfiguration(
            'system.url.entity',
            '${urlEntityCategory}/${entityCategory.shortName.toLowerCase()}-${entityId.name.urlify()}'
        );
        this._routeEntityId = this.getConfiguration(
            'system.route.site',
            '${routEntityCategory}/:entity'
        );

        // Derive options
        this._mediaQueries = this.generateMediaQueries(this._breakpoints);
    }

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
     * Generates a list of media queries based on the configured breakpoints
     *
     * @protected
     */
    generateMediaQueries(breakpoints) {
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
        return mediaQueries;
    }

    /**
     * @type {Object}
     */
    get breakpoints() {
        return this._breakpoints;
    }

    /**
     * @type {Object}
     */
    get mediaQueries() {
        return this._mediaQueries;
    }

    /**
     * @type {String}
     */
    get urlBase() {
        return this._urlBase;
    }

    /**
     * @type {String}
     */
    get urlSite() {
        return this._urlSite;
    }

    /**
     * @type {String}
     */
    get urlEntityCategory() {
        return this._urlEntityCategory;
    }

    /**
     * @type {String}
     */
    get urlEntityId() {
        return this._urlEntityId;
    }

    /**
     * @type {String}
     */
    get routeSite() {
        return this._routeSite;
    }

    /**
     * @type {String}
     */
    get routeEntityCategory() {
        return this._routeEntityCategory;
    }

    /**
     * @type {String}
     */
    get routeEntityId() {
        return this._routeEntityId;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.SystemModuleConfiguration = SystemModuleConfiguration;
