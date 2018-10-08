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
class ConfigurationTag extends Tag {
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
        return 'nunjucks.tag/ConfigurationTag';
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
        return ['configuration'];
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
        const name = params.name || 'system';
        const moduleConfiguration = this.moduleConfigurations.get(name);
        if (!moduleConfiguration) {
            this.logger.warn(this.className + ' - could not find module configuration ' + name);
            return '';
        }
        try {
            moduleConfiguration[params.key] = params.value;
        } catch (e) {
            this.logger.warn(
                this.className +
                    ' - could not update ' +
                    params.key +
                    ' on module configuration ' +
                    name
            );
        }
        return '';
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.ConfigurationTag = ConfigurationTag;
