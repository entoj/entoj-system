'use strict';

/**
 * Requirements
 * @ignore
 */
const ValueObject = require('../ValueObject.js').ValueObject;
const DependencyType = require('./DependencyType.js').DependencyType;

/**
 * @memberOf model.documentation
 */
class Dependency extends ValueObject
{
    /**
     * @inheritDocs
     */
    get fields()
    {
        return {
            name: '',
            data: {},
            type: DependencyType.UNKNOWN
        };
    }


    /**
     * @inheritDoc
     */
    static get className()
    {
        return 'model.documentation/Dependency';
    }


    /**
     * The dependency type
     *
     * @see {model.documenation.DependencyType}
     * @property {String}
     */
    get type()
    {
        return this._type;
    }

    set type(value)
    {
        this._type = value;
    }

    /**
     * @property {String}
     */
    get name()
    {
        return this._name;
    }

    set name(value)
    {
        this._name = value;
    }


    /**
     * @property {Object}
     */
    get data()
    {
        return this._data;
    }

    set data(value)
    {
        this._data = value;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.Dependency = Dependency;
