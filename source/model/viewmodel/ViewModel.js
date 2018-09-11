'use strict';

/**
 * Requirements
 * @ignore
 */
const ValueObject = require('../ValueObject.js').ValueObject;

/**
 * @memberOf model.viewmodel
 * @extends {Base}
 */
class ViewModel extends ValueObject {
    /**
     * @inheritDoc
     */
    static get className() {
        return 'model.viewmodel/ViewModel';
    }

    /**
     * @inheritDocs
     */
    get fields() {
        const fields = super.fields;
        fields.data = false;
        return fields;
    }

    /**
     * @inheritDoc
     */
    get data() {
        return this._data;
    }

    /**
     * @inheritDoc
     */
    set data(value) {
        this._data = value;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.ViewModel = ViewModel;
