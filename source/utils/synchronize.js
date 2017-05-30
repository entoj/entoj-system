'use strict';

/**
 * Requirements
 * @ignore
 */
const deasync = require('deasync');
const Base = require('../Base.js').Base;


/**
 * @memberOf utils
 * @param {Object} scope
 * @param {String} method
 * @param {Array} parameters
 * @returns {*}
 */
function execute(scope, method, parameters)
{
    let result = false;
    let done = false;
    let promise;
    if (scope)
    {
        promise = scope[method].apply(scope, parameters);
    }
    else
    {
        promise = method.apply(scope, parameters);
    }
    promise.then(function(data)
    {
        result = data;
        done = true;
    });
    deasync.loopWhile(() => !done);
    return result;
}


/**
 * Traps all method calls and sychronizes promise resolving
 *
 * @memberOf utils
 * @param  {*} target
 * @return {*}
 */
function synchronize(target)
{
    const handler =
    {
        get: function(receiver, name)
        {
            if (typeof target[name] === 'function')
            {
                return function()
                {
                    const raw = target[name].apply(target, arguments);
                    if (raw instanceof Promise)
                    {
                        let done = false;
                        let result;
                        raw.then(function(data)
                        {
                            result = data;
                            done = true;
                        });
                        deasync.loopWhile(() => !done);
                        if (result instanceof Base)
                        {
                            return synchronize(result);
                        }
                        return result;
                    }
                    else
                    {
                        if (raw instanceof Base)
                        {
                            return synchronize(raw);
                        }
                        return raw;
                    }
                };
            }
            else
            {
                const result = target[name];
                if (result instanceof Base)
                {
                    return synchronize(result);
                }
                return result;
            }
        },

        set: function(receiver, name, value)
        {
            target[name] = value;
            return true;
        }
    };
    const proxy = (typeof Proxy === 'function') ? new Proxy({}, handler) : Proxy.create(handler);
    return proxy;
}



/**
 * Exports
 * @ignore
 */
module.exports.execute = execute;
module.exports.synchronize = synchronize;
