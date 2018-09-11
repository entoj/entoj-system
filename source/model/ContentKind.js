'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;

/**
 * @class
 * @memberOf model
 * @extends {Base}
 */
class ContentKind extends Base {
    /**
     * @inheritDoc
     */
    static get className() {
        return 'model/ContentKind';
    }

    /**
     * Unknown kind
     */
    static get UNKNOWN() {
        return '*';
    }

    /**
     * CSS
     */
    static get CSS() {
        return 'css';
    }

    /**
     * JS
     */
    static get JS() {
        return 'js';
    }

    /**
     * Macro
     */
    static get MACRO() {
        return 'macro';
    }

    /**
     * Example
     */
    static get EXAMPLE() {
        return 'example';
    }

    /**
     * Styleguide
     */
    static get STYLEGUIDE() {
        return 'styleguide';
    }

    /**
     * Datamodel
     */
    static get DATAMODEL() {
        return 'datamodel';
    }

    /**
     * Text
     */
    static get TEXT() {
        return 'text';
    }
}

/**
 * Public
 * @ignore
 */
module.exports.ContentKind = ContentKind;
