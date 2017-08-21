'use strict';

const tr = require('transliteration').transliterate;


/**
 * Makes a valid ascii only url
 *
 * @memberOf utils
 */
function urlify(value, whitespace)
{
    return tr(value).toLowerCase().replace(/\s/g, whitespace || '-');
}


/**
 * Replaces any path seperator to /
 *
 * @memberof utils
 */
function normalizePathSeparators(path)
{
    return path.replace(/\\|\//g, '/');
}


/**
 * Removes a leading slash
 *
 * @memberof utils
 */
function trimLeadingSlash(path)
{
    let result = normalizePathSeparators(path);
    if (result.substr(0, 1) === '/')
    {
        result = result.substr(1);
    }
    return result;
}


/**
 * Removes a trailing slash
 *
 * @memberof utils
 */
function trimTrailingSlash(path)
{
    let result = normalizePathSeparators(path);
    if (result.substr(result.length - 1, 1) === '/')
    {
        result = result.substr(0, result.length - 1);
    }
    return result;
}


/**
 * Ensures a trailing slash
 *
 * @memberof utils
 */
function ensureTrailingSlash(path)
{
    let result = normalizePathSeparators(path);
    if (result.substr(result.length - 1, 1) !== '/')
    {
        result+= '/';
    }
    return result;
}


/**
 * Makes the given string a valid url
 *
 * @memberof utils
 */
function normalize(path)
{
    let result = path || '';
    result = result.replace(/\\|\//g, '/');
    if (!result.startsWith('/'))
    {
        result = '/' + result;
    }
    if (result.endsWith('/'))
    {
        result = result.substr(0, result.length - 1);
    }
    return result;
}


/**
 * Removes the first part of a path
 *
 * @memberof utils
 */
function shift(path)
{
    const parts = normalize(path).split('/');
    if (parts.length > 0 && parts[0] === '')
    {
        parts.shift();
    }
    parts.shift();
    return normalize(parts.join('/'));
}


/**
 * Adds all given strings to a full url
 *
 * @memberof utils
 */
function concat(root, ...urls)
{
    let result = normalize(root);
    for (const u of urls)
    {
        const url = trimTrailingSlash(trimLeadingSlash(normalizePathSeparators(u)));
        if (url.length)
        {
            result+= '/' + url;
        }
    }
    return normalize(result);
}


/**
 * Exports
 * @ignore
 */
module.exports.concat = concat;
module.exports.shift = shift;
module.exports.trimLeadingSlash = trimLeadingSlash;
module.exports.trimTrailingSlash = trimTrailingSlash;
module.exports.ensureTrailingSlash = ensureTrailingSlash;
module.exports.normalizePathSeparators = normalizePathSeparators;
module.exports.normalize = normalize;
module.exports.urlify = urlify;
