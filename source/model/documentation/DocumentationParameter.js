'use strict';

/**
 * Requirements
 * @ignore
 */
const DocumentationVariable = require('./DocumentationVariable.js').DocumentationVariable;

/**
 * @memberOf model.documentation
 */
class DocumentationParameter extends DocumentationVariable
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.documentation/DocumentationParameter';
    }


    /**
     * @inheritDocs
     */
    get fields()
    {
        const fields = super.fields;
        fields.defaultValue = undefined;
        fields.isOptional = false;
        return fields;
    }


    /**
     * @property {String}
     */
    get defaultValue()
    {
        return this._defaultValue;
    }

    set defaultValue(value)
    {
        this._defaultValue = value;
    }


    /**
     * @property {Boolean}
     */
    get isOptional()
    {
        return this._isOptional === true;
    }

    set isOptional(value)
    {
        this._isOptional = value === true;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.DocumentationParameter = DocumentationParameter;
