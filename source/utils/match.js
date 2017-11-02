'use strict';

/**
 * Tests if value matches test
 *
 * @param {Mixed} value
 * @param {Mixed} match
 * @param {Function} compare
 * @returns {Boolean}
 */
function matchValue(value, test)
{
    // has isEqualTo() ?
    if (typeof value.isEqualTo == 'function')
    {
        return value.isEqualTo(test);
    }
    // RegExp => match
    else if (typeof value == 'string' && test instanceof RegExp)
    {
        return !!value.match(test);
    }
    // array => indexOf
    else if (Array.isArray(value))
    {
        if (Array.isArray(test))
        {
            return value.indexOf(test[0]) > -1;
        }
        else
        {
            return value.indexOf(test) > -1;
        }
    }
    // Simple compare
    const testValue = (typeof test == 'string') ? test.toLowerCase() : test;
    const valueValue = (typeof value == 'string') ? value.toLowerCase() : value;
    return (valueValue == testValue);
}


/**
 * Returns true if all tests matched
 *
 * @param {Object} object
 * @param {Object} tests
 * @returns {Boolean}
 */
function matchObject(object, tests)
{
    if (!object)
    {
        return false;
    }
    for (const test in tests)
    {
        if (!matchValue(object[test], tests[test]))
        {
            return false;
        }
    }
    return true;
}


/**
 * Exports
 * @ignore
 */
module.exports.matchValue = matchValue;
module.exports.matchObject = matchObject;
