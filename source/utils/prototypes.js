'use strict';

const urlify = require('./urls.js').urlify;
const reduce = Function.bind.call(Function.call, Array.prototype.reduce);
const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
const concat = Function.bind.call(Function.call, Array.prototype.concat);
const keys = Reflect.ownKeys;

/**
 * A simple number formating
 * @memberof utils
 */
Number.prototype.format = function(digits, decimals) {
    const options = { minimumIntegerDigits: digits };
    if (decimals > 0) {
        options.minimumFractionDigits = decimals;
        options.maximumFractionDigits = decimals;
    }
    return this.toLocaleString('en-EN', options);
};

/**
 * Applies urlify to the string
 * @memberof utils
 */
String.prototype.urlify = function(whitespace) {
    return urlify(this, whitespace);
};

/**
 * Replaces whitespace and dashes with lodashes
 *
 * @memberof utils
 */
String.prototype.lodasherize = function() {
    return this.replace(/\s|-/g, '_');
};

/**
 * Replaces whitespace and lodashes with dashes
 * @memberof utils
 */
String.prototype.dasherize = function() {
    return this.replace(/\s|_/g, '-');
};

/**
 * Polyfills
 */
/* istanbul ignore next */
if (!Object.values) {
    Object.values = function values(O) {
        return reduce(
            keys(O),
            (v, k) => concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []),
            []
        );
    };
}

/* istanbul ignore next */
if (!Object.entries) {
    Object.entries = function entries(O) {
        return reduce(
            keys(O),
            (e, k) => concat(e, typeof k === 'string' && isEnumerable(O, k) ? [[k, O[k]]] : []),
            []
        );
    };
}
