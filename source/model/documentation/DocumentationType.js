'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../../Base.js').Base;


/**
 * @class
 * @memberOf model.documentation
 * @extends {Base}
 */
class DocumentationType extends Base
{
    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'model.documentation/DocumentationType';
    }


    /**
     *
     */
    static get TEXT()
    {
        return 'DocumentationText';
    }


    /**
     *
     */
    static get TEXT_SECTION()
    {
        return 'DocumentationTextSection';
    }


    /**
     *
     */
    static get EXAMPLE()
    {
        return 'DocumentationExample';
    }
}

/**
 * Public
 * @ignore
 */
module.exports.DocumentationType = DocumentationType;
