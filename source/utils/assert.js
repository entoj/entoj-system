'use strict';

/**
 * Requirements
 * @ignore
 */
const MissingArgumentError = require('../error/MissingArgumentError.js').MissingArgumentError;


/**
 * Checks a parameter for required and type
 *
 * @memberof utils
 * @param {String} name - The name of the parameter
 * @param {Mixed} value - The value of the parameter
 * @param {Boolean} required - Is the parameter required?
 * @param {Class|Array<Class>} type - The expected type(s) of the parameter
 * @returns {void}
 */
function assertParameter(instance, name, value, required, type)
{
    if (!instance)
    {
        throw new TypeError(`Missing instance to assert ${name}`);
    }
    if (required && !value)
    {
        throw new MissingArgumentError(`${instance.className} - Missing parameter ${name}`);
    }
    if (value && type)
    {
        const types = Array.isArray(type) ? type : [type];
        let ok = false;
        for (const t of types)
        {
            if (value instanceof t)
            {
                ok = true;
            }
        }
        if (!ok)
        {
            //console.log(`${instance.className} - ${name} must of of type ${type.className}`);
            throw new TypeError(`${instance.className} - ${name} must be of type ${type.className} but is of type ${value.className}`);
        }
    }
}

module.exports.assertParameter = assertParameter;
