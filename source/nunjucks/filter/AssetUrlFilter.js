'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;
const SystemModuleConfiguration = require('../../configuration/SystemModuleConfiguration.js')
    .SystemModuleConfiguration;
const urls = require('../../utils/urls.js');
const templateString = require('es6-template-strings');
const assertParameter = require('../../utils/assert.js').assertParameter;

/**
 * Generates a asset url.
 *
 * @memberOf nunjucks.filter
 */
class AssetUrlFilter extends Filter {
    /**
     * @inheritDoc
     */
    constructor(moduleConfiguration) {
        super();

        // Check
        assertParameter(
            this,
            'moduleConfiguration',
            moduleConfiguration,
            true,
            SystemModuleConfiguration
        );

        // Assign options
        this._name = ['assetUrl', 'asset'];
        this._moduleConfiguration = moduleConfiguration;
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return { parameters: [SystemModuleConfiguration] };
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'nunjucks.filter/AssetUrlFilter';
    }

    /**
     * @type {configuration.SystemModuleConfiguration}
     */
    get moduleConfiguration() {
        return this._moduleConfiguration;
    }

    /**
     * @inheritDoc
     */
    filter(value) {
        const scope = this;
        return function(value) {
            const globals = scope.getGlobals(this);
            const result = urls.concat(
                templateString(
                    scope.moduleConfiguration.filterAssetUrlBaseUrl,
                    globals.location || {}
                ),
                value
            );
            return scope.applyCallbacks(result, arguments, { asset: value });
        };
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.AssetUrlFilter = AssetUrlFilter;
