'use strict';

/**
 * Requirements
 */
const SearchableArray = require(ES_SOURCE + '/base/SearchableArray.js').SearchableArray;
const searchableArraySpec = require(ES_TEST + '/base/SearchableArrayShared.js').spec;

/**
 * Spec
 */
describe(SearchableArray.className, function() {
    /**
     * SearchableArray Test
     */
    searchableArraySpec(SearchableArray, 'base/SearchableArray');
});
