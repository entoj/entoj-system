'use strict';

/**
 * Requirements
 */
const Repository = require(ES_SOURCE + '/model/Repository.js').Repository;
const repositorySpec = require('./RepositoryShared.js').spec;


/**
 * Spec
 */
describe(Repository.className, function()
{
    repositorySpec(Repository, 'model/Repository');
});
