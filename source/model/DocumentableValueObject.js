'use strict';

/**
 * Requirements
 * @ignore
 */
const ValueObject = require('./ValueObject.js').ValueObject;
const DocumentationArray = require('./documentation/DocumentationArray.js').DocumentationArray;
const TestSuiteArray = require('./test/TestSuiteArray.js').TestSuiteArray;
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
     * @inheritDoc
     */
    initialize()
    {
        super.initialize();
        this._properties = new BaseMap();
        this._documentation = new DocumentationArray();
        this._files = new SearchableArray();
        this._testSuites = new TestSuiteArray();
        this._lintResults = new SearchableArray();
    }


    /**
     * @inheritDoc
     */
    get fields()
    {
        return {
            properties: BaseMap,
            documentation: DocumentationArray,
            files: SearchableArray,
            testSuites: TestSuiteArray
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
    get testSuites()
    {
        return this._testSuites;
    }


    /**
     * @property {Array}
     */
    get lintResults()
    {
        return this._lintResults;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.DocumentableValueObject = DocumentableValueObject;
