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
class ContentType extends Base {
    /**
     * @inheritDoc
     */
    static get className() {
        return 'model/ContentType';
    }

    /**
     * Any
     */
    static get ANY() {
        return '*';
    }

    /**
     * Sass
     */
    static get SASS() {
        return 'sass';
    }

    /**
     * Js
     */
    static get JS() {
        return 'js';
    }

    /**
     * Json
     */
    static get JSON() {
        return 'json';
    }

    /**
     * Jinja
     */
    static get JINJA() {
        return 'jinja';
    }

    /**
     * Markdown
     */
    static get MARKDOWN() {
        return 'markdown';
    }
}

/**
 * Public
 * @ignore
 */
module.exports.ContentType = ContentType;
