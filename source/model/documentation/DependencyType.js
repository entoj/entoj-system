'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../../Base.js').Base;

/**
 * @class
 * @memberOf model
 * @extends {Base}
 */
class DependencyType extends Base {
    /**
     * @inheritDocs
     */
    static get className() {
        return 'model.documentation/DependencyType';
    }

    /**
     *
     */
    static get UNKNOWN() {
        return '*';
    }

    /**
     *
     */
    static get MACRO() {
        return 'macro';
    }

    /**
     *
     */
    static get TEMPLATE() {
        return 'template';
    }
}

/**
 * Public
 * @ignore
 */
module.exports.DependencyType = DependencyType;
