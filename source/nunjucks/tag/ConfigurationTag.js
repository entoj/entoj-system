'use strict';

/**
 * Requirements
 * @ignore
 */
const Tag = require('./Tag.js').Tag;
const BaseMap = require('../../base/BaseMap.js').BaseMap;

/**
 * @memberOf nunjucks.tag
 */
class ConfigurationTag extends Tag {
    /**
     */
    constructor() {
        super();

        // Assign options
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
    get name() {
        return ['configuration'];
    }

    /**
     * @inheritDoc
     */
    generate(context, params, caller) {
        if (!params.value || !params.name) {
            return '';
        }
        if (!context.env.globals.__configuration__) {
            context.env.globals.__configuration__ = new BaseMap();
        }
        context.env.globals.__configuration__.setByPath(params.name, params.value);
        return '';
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.ConfigurationTag = ConfigurationTag;
