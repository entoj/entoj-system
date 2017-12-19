'use strict';

/**
 * Requirements
 * @ignore
 */
const ValueObject = require('./ValueObject.js').ValueObject;
const DocumentationArray = require('./documentation/DocumentationArray.js').DocumentationArray;
const TestArray = require('./test/TestArray.js').TestArray;
const SearchableArray = require('../base/SearchableArray.js').SearchableArray;
const BaseMap = require('../base/BaseMap.js').BaseMap;


/**
 * @class
 * @memberOf model
 * @extends {Base}
 */
class DocumentableValueObject extends ValueObject
{
    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model/DocumentableValueObject';
    }


    /**
     * @inheritDocs
     */
    initialize()
    {
        super.initialize();
        this._properties = new BaseMap();
        this._documentation = new DocumentationArray();
        this._files = new SearchableArray();
        this._tests = new TestArray();
    }


    /**
     * @inheritDocs
     */
    get fields()
    {
        return {
            properties: BaseMap,
            documentation: DocumentationArray,
            files: SearchableArray,
            tests: TestArray
        };
    }


    /**
     * @property {Map}
     */
    get properties()
    {
        return this._properties;
    }


    /**
     * @property {Array}
     */
    get documentation()
    {
        return this._documentation;
    }


    /**
     * @property {Array}
     */
    get files()
    {
        return this._files;
    }


    /**
     * @property {Array}
     */
    get tests()
    {
        return this._tests;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.DocumentableValueObject = DocumentableValueObject;
