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
class EntityCategoryType extends Base {
    /**
     * @inheritDocs
     */
    static get className() {
        return 'model.entity/EntityCategoryType';
    }

    /**
     * Global categories provide global js & scss
     */
    static get GLOBAL() {
        return 'global';
    }

    /**
     * Pattern (atoms, molecules, organisms...)
     */
    static get PATTERN() {
        return 'pattern';
    }

    /**
     * Page (example pages built soley from patterns)
     */
    static get PAGE() {
        return 'page';
    }

    /**
     * Template provide the page frames
     */
    static get TEMPLATE() {
        return 'template';
    }
}

/**
 * Public
 * @ignore
 */
module.exports.EntityCategoryType = EntityCategoryType;
