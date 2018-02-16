'use strict';

/**
 * Requirements
 * @ignore
 */
const DocumentationCode = require('./DocumentationCode.js').DocumentationCode;
const SearchableArray = require('../../base/SearchableArray.js').SearchableArray;


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
     * @inheritDoc
     */
    initialize()
    {
        super.initialize();
        this._parameters = new SearchableArray();        
        this._dependencies = new SearchableArray();
    }


    /**
     * @inheritDocs
     */
    get fields()
    {
        const fields = super.fields;
        fields.dependencies = SearchableArray;
        fields.parameters = SearchableArray;
        fields.returns = undefined;
        return fields;
    }


    /**
     * @property {Array<model.documentation.Dependency>}
     */
    get dependencies()
    {
        return this._dependencies;
    }

    set dependencies(value)
    {
        this._dependencies = value;
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
