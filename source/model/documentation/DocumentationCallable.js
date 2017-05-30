'use strict';

/**
 * Requirements
 * @ignore
 */
const DocumentationCode = require('./DocumentationCode.js').DocumentationCode;

/**
 * @memberOf model.documentation
 */
class DocumentationCallable extends DocumentationCode
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.documentation/DocumentationCallable';
    }


    /**
     * @inheritDocs
     */
    get fields()
    {
        const fields = super.fields;
        fields.parameters = [];
        fields.returns = undefined;
        return fields;
    }


    /**
     * @property {Array}
     */
    get parameters()
    {
        return this._parameters;
    }

    set parameters(value)
    {
        this._parameters = value;
    }


    /**
     * @property {String}
     */
    get returns()
    {
        return this._returns;
    }

    set returns(value)
    {
        this._returns = value;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.DocumentationCallable = DocumentationCallable;
