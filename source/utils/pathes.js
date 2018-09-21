'use strict';

const parse = require('path').parse;
const PATH_SEPERATOR = require('path').sep;
const WIN32 = process.platform == 'win32';

/**
 * Replaces any path seperator with the platfform specific one
 *
 * @memberof utils
 * @deprecated
 */
function normalizePathSeparators(path) {
    if (!path) {
        return '';
    }
    return path.replace(/\\|\//g, PATH_SEPERATOR);
}

/**
 * Adds all given strings to a full path
 *
 * @memberof utils
 * @deprecated
 */
function concat(root, ...pathes) {
    let result = normalize(root);
    for (const p of pathes) {
        const path = trimTrailingSlash(trimLeadingSlash(normalizePathSeparators(p)));
        if (path.length) {
            result += PATH_SEPERATOR + path;
        }
    }
    return normalize(result);
}

/**
 * Removes strip from path
 *
 * @memberof utils
 * @deprecated
 */
function strip(path, strip) {
    return normalizePathSeparators(path).replace(normalizePathSeparators(strip), '');
}

/**
 * Removes a leading slash
 *
 * @memberof utils
 * @deprecated
 */
function trimLeadingSlash(path) {
    let result = normalizePathSeparators(path);
    if (result.substr(0, 1) === PATH_SEPERATOR) {
        result = result.substr(1);
    }
    return result;
}

/**
 * Removes a trailing slash
 *
 * @memberof utils
 * @deprecated
 */
function trimTrailingSlash(path) {
    let result = normalizePathSeparators(path);
    if (result.substr(result.length - 1, 1) === PATH_SEPERATOR) {
        result = result.substr(0, result.length - 1);
    }
    return result;
}

/**
 * Ensures a leading slash and removes any trailing slashes
 *
 * @memberof utils
 * @deprecated
 */
function normalize(path) {
    // Parse path
    let preparedPath = normalizePathSeparators(path);
    if (WIN32) {
        preparedPath = trimLeadingSlash(preparedPath);
    }
    const parts = parse(preparedPath);

    // Check root
    if (!parts.root) {
        parts.root = WIN32 ? __dirname.substr(0, 3) : '/';
    }

    // Remove drive & leading slash
    if (WIN32) {
        if (parts.root.length < 3) {
            parts.root = __dirname.substr(0, 3);
        }
        parts.path = preparedPath.replace(parts.root, '');
    } else {
        parts.path = trimLeadingSlash(preparedPath);
    }

    // Build path
    let result = parts.root + parts.path;

    // Remove trailing slashes
    if (
        result.endsWith(PATH_SEPERATOR) &&
        ((WIN32 && result.length > 3) || (!WIN32 && result.length > 1))
    ) {
        result = result.slice(0, -1);
    }

    return result;
}

/**
 * Removes the first part of a path
 *
 * @memberof utils
 * @deprecated
 */
function shift(path) {
    const parts = normalize(path).split(PATH_SEPERATOR);

    // Skip unix roots
    if (parts.length > 0 && parts[0] === '') {
        parts.shift();
    }
    // Skip win32 roots
    let drive = false;
    if (parts.length > 0 && parts[0].match(/[a-zA-z]:/)) {
        drive = parts.shift();
    }

    // Remove part
    parts.shift();

    // Add drive
    if (drive) {
        parts.unshift(drive);
        if (parts.length === 1) {
            parts.push('');
        }
    }

    return normalize(parts.join(PATH_SEPERATOR));
}

/**
 * Exports
 * @ignore
 */
module.exports.strip = strip;
module.exports.concat = concat;
module.exports.trimLeadingSlash = trimLeadingSlash;
module.exports.normalizePathSeparators = normalizePathSeparators;
module.exports.normalize = normalize;
module.exports.shift = shift;
