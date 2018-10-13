'use strict';

/**
 * Requirements
 * @ignore
 */
const Tag = require('./Tag.js').Tag;
const ModuleConfigurations = require('../../configuration/ModuleConfigurations.js')
    .ModuleConfigurations;

/**
 * Updates module configurations from a template.
 *
 * @memberOf nunjucks.tag
 */
class EntojConfigurationTag extends Tag {
    /**
     */
    constructor(moduleConfigurations) {
        super();

        // Assign options
        this._moduleConfigurations = moduleConfigurations;
        this._hasBody = false;
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'nunjucks.tag/EntojConfigurationTag';
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
    get name() {
        return ['entojConfiguration'];
    }

    /**
     * @type {configurations.ModuleConfigurations}
     */
    get moduleConfigurations() {
        return this._moduleConfigurations;
    }

    /**
     * @inheritDoc
     */
    generate(context, params, caller) {
        if (!params.value || !params.key) {
            return '';
        }
        const moduleName = params.moduleName || 'system';
        const moduleConfiguration = this.moduleConfigurations.get(moduleName);
        if (!moduleConfiguration) {
            this.logger.warn(
                this.className + ' - could not find module configuration ' + moduleName
            );
            return '';
        }
        if (!moduleConfiguration.set(params.key, params.value)) {
            this.logger.warn(
                this.className +
                    ' - could not update ' +
                    params.key +
                    ' on module configuration ' +
                    moduleName
            );
        }
        return '';
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.EntojConfigurationTag = EntojConfigurationTag;
