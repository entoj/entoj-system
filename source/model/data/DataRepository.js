'use strict';

/**
 * Requirements
 * @ignore
 */
const Repository = require('../Repository.js').Repository;
const DataLoader = require('./DataLoader.js').DataLoader;
const co = require('co');

/**
 * @class
 * @memberOf model.data
 * @extends {Base}
 */
class DataRepository extends Repository {
    /**
     * @inheritDoc
     */
    static get injections() {
        return { parameters: [DataLoader] };
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'model.data/DataRepository';
    }

    /**
     * @param {String} name
     * @param {model.site.Site} site
     * @returns {Promise}
     */
    getByNameAndSite(name, site) {
        const scope = this;
        const promise = co(function*() {
            const items = yield scope.getItems();
            const found = items.find((item) => !site || item.site.name === site.name);
            if (found && typeof found.data[name] !== 'undefined') {
                return found.data[name];
            }
            if (site && site.extends) {
                return yield scope.getByNameAndSite(name, site.extends);
            }
            return undefined;
        });
        return promise;
    }

    /**
     * @param {String} name
     * @returns {Promise}
     */
    getByName(name) {
        return this.getByNameAndSite(name);
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.DataRepository = DataRepository;
