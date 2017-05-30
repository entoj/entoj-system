'use strict';

/**
 * Requirements
 * @ignore
 */
const DocumentationParameter = require('./DocumentationParameter.js').DocumentationParameter;

/**
 * @memberOf model.documentation
 */
class DocumentationCompoundParameter extends DocumentationParameter
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.documentation/DocumentationCompoundParameter';
    }


    /**
     * @inheritDocs
     */
    get fields()
    {
        const fields = super.fields;
        fields.children = [];
        return fields;
    }


    /**
     * @property {String}
     */
    get children()
    {
        return this._children;
    }

    set children(value)
    {
        this._children = value;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.DocumentationCompoundParameter = DocumentationCompoundParameter;
