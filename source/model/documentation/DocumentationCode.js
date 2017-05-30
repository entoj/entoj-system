'use strict';

/**
 * Requirements
 * @ignore
 */
const Documentation = require('./Documentation.js').Documentation;

/**
 * @memberOf model.documentation
 */
class DocumentationCode extends Documentation
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.documentation/DocumentationCode';
    }


    /**
     * @inheritDocs
     */
    get fields()
    {
        const fields = super.fields;
        fields.visibility = 'public';
        fields.namespace = '';
        return fields;
    }


    /**
     * @property {String}
     */
    get namespace()
    {
        return this._namespace;
    }

    set namespace(value)
    {
        this._namespace = value || '';
    }

    /**
     * @property {String}
     */
    get visibility()
    {
        return this._visibility;
    }

    set visibility(value)
    {
        this._visibility = value || '';
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.DocumentationCode = DocumentationCode;
