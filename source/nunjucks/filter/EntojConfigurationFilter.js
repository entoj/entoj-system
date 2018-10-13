'use strict';

/**
 * Requirements
 * @ignore
 */
const Filter = require('./Filter.js').Filter;
const ModuleConfigurations = require('../../configuration/ModuleConfigurations.js')
    .ModuleConfigurations;
const assertParameter = require('../../utils/assert.js').assertParameter;

/**
 * Allows to query all entoj module configurations
 *
 * @memberOf nunjucks.filter
 */
class EntojConfigurationFilter extends Filter {
    /**
     * @inheritDoc
     */
    constructor(moduleConfigurations) {
        super();

        // Check params
        assertParameter(
            this,
            'moduleConfigurations',
            moduleConfigurations,
            true,
            ModuleConfigurations
        );

        // Assign options
        this._name = 'entojConfiguration';
        this._moduleConfigurations = moduleConfigurations;
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return { parameters: [ModuleConfigurations] };
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'nunjucks.filter/EntojConfigurationFilter';
    }

    /**
     * @inheritDoc
     */
    get moduleConfigurations() {
        return this._moduleConfigurations;
    }

    /**
     * @inheritDoc
     */
    filter() {
        const scope = this;
        return function(value, moduleName) {
            const mName = moduleName || 'system';
            const moduleConfiguration = scope.moduleConfigurations.get(mName);
            if (!moduleConfiguration) {
                scope.logger.warn(
                    scope.className + ' - could not find module configuration ' + mName
                );
                return scope.applyCallbacks(undefined, arguments);
            }
            if (!moduleConfiguration.has(value)) {
                scope.logger.warn(
                    scope.className +
                        ' - could not read ' +
                        value +
                        ' from module configuration ' +
                        mName
                );
            }

            return scope.applyCallbacks(moduleConfiguration.get(value), arguments);
        };
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.EntojConfigurationFilter = EntojConfigurationFilter;
