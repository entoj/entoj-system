'use strict';

/**
 * Requirements
 * @ignore
 */
const Base = require('../Base.js').Base;
const isPlainObject = require('lodash.isplainobject');
const assertClass = require('../utils/assert.js').assertClass;

/**
 * @class
 * @memberOf utils
 * @extends {Base}
 */
class DIContainer extends Base {
    /**
     * @ignore
     */
    constructor() {
        super();
        this._mappings = new Map();
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'utils/DIContainer';
    }

    /**
     * A map containing all mappings
     *
     * @type {Map}
     */
    get mappings() {
        return this._mappings;
    }

    /**
     * Generates a mapping key for the given type
     *
     * @protected
     * @param {string|Class} type
     * @returns {mixed}
     */
    getKeyForType(type) {
        if (!type) {
            throw new TypeError(this.className + ' - Tried to map a falsy type');
        }
        if (typeof type === 'string') {
            return type;
        }
        if (typeof type['className'] !== 'undefined') {
            return type.className;
        }
        return type;
    }

    /**
     * Creates a mapping object
     *
     * @protected
     * @param {string|Class} type
     * @param {*} the value used for type when creating objects
     * @param {bool} isSingleton
     * @returns {void}
     */
    prepareMapping(type, value, isSingleton) {
        if (!type) {
            throw new TypeError(this.className + ' - Tried to map falsy type');
        }
        if (typeof value == 'undefined') {
            throw new TypeError(
                this.className +
                    ' - Tried to map undefined value for ' +
                    (typeof type === 'string' ? type : type.className)
            );
        }

        const mapping = {
            isSingleton: false,
            type: undefined,
            value: undefined
        };

        // name to value
        if (typeof type === 'string') {
            mapping.value = value;
        }
        // type to type
        else if (typeof value === 'function') {
            mapping.type = value;
            mapping.isSingleton = isSingleton || false;
        }
        // type to value
        else {
            mapping.value = value;
            mapping.isSingleton = true;
        }

        return mapping;
    }

    /**
     * Get the mapping information for the given type
     *
     * @protected
     * @param {string|Class} type
     * @returns {mixed}
     */
    getMappingForType(type) {
        if (!type) {
            throw new TypeError(this.className + ' - Tried to get mapping for a falsy type');
        }
        const key = this.getKeyForType(type);
        if (!this.mappings.has(key)) {
            return false;
        }
        return this.mappings.get(key);
    }

    /**
     * Get the mapping information for the given type
     *
     * @protected
     * @param {string|Class} type
     * @returns {mixed}
     */
    getMappingForDerivatives(type) {
        if (!type || typeof type.className == 'undefined') {
            throw new TypeError(
                this.className + ' - Tried to get derivatives mapping for non class type'
            );
        }
        const mappings = [];
        for (const mapping of this.mappings.values()) {
            if (assertClass(mapping.type, type)) {
                mappings.push(mapping);
            }
        }
        return mappings;
    }

    /**
     * Maps type to value.
     *
     * When the mapping already exists the singleton flag is only touched when isSingleton is either true or false.
     *
     * * If type and value are classes this becomes a type to type mapping
     * * If type is a string this becomes a named value mapping
     * * If type is a class and value not this becomes a implicit singleton
     *
     * @param {string|Class} type
     * @param {*} the value used for type when creating objects
     * @param {bool} [isSingleton]
     * @returns {void}
     */
    map(type, value, isSingleton) {
        // Get singleton
        let singleton = isSingleton;
        if (typeof isSingleton == 'undefined') {
            const currentMapping = this.getMappingForType(type);
            singleton = currentMapping ? currentMapping.isSingleton : false;
        }

        // Map
        const typeKey = this.getKeyForType(type);
        const mapping = this.prepareMapping(type, value, singleton);
        this.mappings.set(typeKey, mapping);
    }

    /**
     * Maps type to value as a singleton
     *
     * * If type and value are classes this becomes a type to type mapping
     * * If type is a string this becomes a named value mapping
     * * If type is a class and value not this becomes a implicit singleton
     *
     * @param {string|Class} type
     * @param {*} the value used for type when creating objects
     * @returns {void}
     */
    mapAsSingleton(type, value) {
        this.map(type, value ? value : type, true);
    }

    /**
     * Maps parameters for a type.
     * Parameters will get mapped seperatly as long as they are named dependencies.
     *
     * {
     *   type: Class,
     *   sourceType: Class,
     *   singleton: Boolean,
     *   parameters: [
     *     [name, value]
     *   ]
     * }
     *
     * @param {Object} confguration
     * @param {Boolean} [replace]
     * @returns {void}
     */
    mapParameters(type, parameters, replace) {
        if (!type || typeof type != 'function') {
            throw new TypeError(this.className + ' - Tried to map parameters for a invalid type');
        }
        if (!isPlainObject(parameters) && !Array.isArray(parameters)) {
            return;
        }

        // Check type mapping
        if (!this.getMappingForType(type)) {
            this.map(type, type);
        }

        // Map each parameter
        const params = isPlainObject(parameters) ? Object.entries(parameters) : parameters;
        for (const parameter of params) {
            if (
                !Array.isArray(parameter) ||
                parameter.length != 2 ||
                typeof parameter[0] != 'string'
            ) {
                continue;
            }
            const name = type.className + '.' + parameter[0];
            if (replace == true) {
                this.map(name, parameter[1]);
            } else {
                const currentMapping = this.getMappingForType(name);
                let value = parameter[1];
                if (currentMapping && Array.isArray(currentMapping.value)) {
                    value = currentMapping.value.concat(parameter[1]);
                }
                this.map(name, value);
            }
        }
    }

    /**
     * Maps a type via a configuration object.
     * Parameters will get mapped seperatly as long as the are named dependencies.
     *
     * {
     *   type: Class,
     *   sourceType: Class,
     *   singleton: Boolean,
     *   parameters: [
     *     [name, value]
     *   ]
     * }
     *
     * @param {Object} confguration
     * @param {Boolean} [replace]
     * @returns {void}
     */
    mapViaConfiguration(configuration, replace) {
        if (!configuration || !isPlainObject(configuration)) {
            throw new TypeError(this.className + ' - Tried to map a invalid configuration');
        }
        if (!configuration.type) {
            throw new TypeError(this.className + ' - Tried to map a configuration without a type');
        }

        // Map
        this.map(
            configuration.sourceType || configuration.type,
            configuration.type,
            configuration.isSingleton
        );

        // Map parameters
        if (typeof configuration.type == 'function') {
            this.mapParameters(configuration.type, configuration.parameters);
        }
    }

    /**
     * Returns a instance of type
     *
     * if type is a class you can override already configured mappings via overrides
     *
     * @param {string|Class} type
     * @param {Map} overrides
     * @returns {*}
     */
    create(type, overrides) {
        // Guard
        if (typeof type == 'undefined') {
            throw new Error(this.className + ' - Tried to create a undefined type');
        }

        // Get key
        const typeKey = this.getKeyForType(type);

        // Get mapping
        let selfMapping;
        if (this.mappings.has(typeKey)) {
            selfMapping = this.mappings.get(typeKey);
            if (selfMapping.isSingleton && typeof selfMapping.value != 'undefined') {
                return selfMapping.value;
            }
        } else {
            selfMapping = {
                isSingleton: false,
                type: type,
                value: type
            };
        }

        // Check if type is a name
        if (typeof type == 'string') {
            return selfMapping.value;
        }

        // Create parameters
        const injections = selfMapping.type.injections || {};
        const parameters = [];
        if (injections.parameters && Array.isArray(injections.parameters)) {
            let parameterIndex = 0;
            for (const parameter of injections.parameters) {
                // get mode
                const mode =
                    injections.modes &&
                    Array.isArray(injections.modes) &&
                    injections.modes[parameterIndex]
                        ? injections.modes[parameterIndex]
                        : 'default';

                // get mapping infos
                let mapping = this.mappings.has(parameter)
                    ? this.mappings.get(parameter)
                    : undefined;

                // override?
                if (overrides && overrides.has(parameter)) {
                    mapping = this.prepareMapping(parameter, overrides.get(parameter));
                }

                // handle missing mapping
                if (!mapping) {
                    mapping = {
                        isSingleton: false,
                        type: typeof parameter === 'function' ? parameter : undefined,
                        value: undefined
                    };
                }

                // create parameter value
                let parameterValue = false;
                // check for named value
                if (typeof parameter === 'string') {
                    parameterValue = mapping.value;
                } else {
                    // mapping available?
                    if (mapping) {
                        // handle singleton creation
                        if (mapping.isSingleton) {
                            if (!mapping.value) {
                                mapping.value = this.create(mapping.type);
                            }
                            parameterValue = mapping.value;
                        }
                        // just create a instance of the mapped type
                        else {
                            parameterValue = this.create(mapping.type);
                        }
                    }
                    // create a unmapped type
                    else {
                        parameterValue = this.create(parameter);
                    }
                }

                // check for mode = instance
                if (mode == 'instance') {
                    if (Array.isArray(parameterValue)) {
                        // array
                        let index = 0;
                        for (const item of parameterValue) {
                            if (isPlainObject(item) && item.type) {
                                // configuration
                                parameterValue[index] = this.create(
                                    item.type,
                                    new Map(item.arguments || [])
                                );
                            } else if (typeof item == 'function') {
                                // constructor
                                parameterValue[index] = this.create(item);
                            }
                            index++;
                        }
                    } else if (typeof parameterValue == 'function') {
                        // constructor
                        parameterValue = this.create(parameterValue);
                    } else if (isPlainObject(parameterValue) && parameterValue.type) {
                        // configuration
                        parameterValue = this.create(
                            parameterValue.type,
                            new Map(parameterValue.arguments || [])
                        );
                    }
                }

                parameters.push(parameterValue);
                parameterIndex++;
            }
        }

        // create instance
        const instance = new selfMapping.type(...parameters);
        /* istanbul ignore next */
        if (!instance) {
            throw new Error(this.className + ' - Could not create instance for ' + type.className);
        }

        // update own mapping
        if (selfMapping.isSingleton) {
            selfMapping.value = instance;
        }

        return instance;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.DIContainer = DIContainer;
module.exports.container = new DIContainer();
