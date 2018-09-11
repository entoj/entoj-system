'use strict';

/**
 * Requirements
 * @ignore
 */
const EntitiesTask = require('./EntitiesTask.js').EntitiesTask;
const GlobalRepository = require('../model/GlobalRepository.js').GlobalRepository;
const EntitiesRepository = require('../model/entity/EntitiesRepository.js').EntitiesRepository;
const Exporter = require('../export/Exporter.js').Exporter;
const CliLogger = require('../cli/CliLogger.js').CliLogger;
const ErrorHandler = require('../error/ErrorHandler.js').ErrorHandler;
const assertParameter = require('../utils/assert.js').assertParameter;
const ContentKind = require('../model/ContentKind.js').ContentKind;
const waitForPromise = require('../utils/synchronize.js').waitForPromise;
const VinylFile = require('vinyl');
const co = require('co');

/**
 * @memberOf task
 */
class ExportTask extends EntitiesTask {
    /**
     * @param {cli.CliLogger} cliLogger
     * @param {model.entity.EntitiesRepository} entitiesRepository
     * @param {model.GlobalRepository} globalRepository
     * @param {export.Exporter} exporter
     */
    constructor(cliLogger, entitiesRepository, globalRepository, exporter) {
        super(cliLogger, globalRepository);

        // Check params
        assertParameter(this, 'entitiesRepository', entitiesRepository, true, EntitiesRepository);
        assertParameter(this, 'exporter', exporter, true, Exporter);

        // Assign options
        this._exporter = exporter;
        this._entitiesRepository = entitiesRepository;
    }

    /**
     * @inheritDoc
     */
    static get injections() {
        return { parameters: [CliLogger, EntitiesRepository, GlobalRepository, Exporter] };
    }

    /**
     * @inheritDoc
     */
    static get className() {
        return 'task/ExportTask';
    }

    /**
     * @inheritDoc
     */
    get sectionName() {
        return 'Exporting files';
    }

    /**
     * @type {String}
     */
    get exportName() {
        return 'default';
    }

    /**
     * @type {export.Exporter}
     */
    get exporter() {
        return this._exporter;
    }

    /**
     * @inheritDoc
     */
    get entitiesRepository() {
        return this._entitiesRepository;
    }

    /**
     * @protected
     * @returns {Promise<Array>}
     */
    prepareParameters(buildConfiguration, parameters) {
        const promise = super.prepareParameters(buildConfiguration, parameters).then((params) => {
            params.query = params.query || '*';
            params.exportMinimal = params.exportMinimal || false;
            return params;
        });
        return promise;
    }

    /**
     * @returns {Promise<Array>}
     */
    prepare(buildConfiguration, parameters) {
        const scope = this;
        const promise = co(function*() {
            const section = scope.cliLogger.section('Preparing export');
            const result = yield scope.exporter.createAdditionalFiles('prepare');
            scope.cliLogger.end(section);
            return result;
        }).catch(ErrorHandler.handler(scope));
        return promise;
    }

    /**
     * @returns {Promise<Array>}
     */
    finalize(buildConfiguration, parameters) {
        const scope = this;
        const promise = co(function*() {
            const section = scope.cliLogger.section('Finalizing export');
            const result = yield scope.exporter.createAdditionalFiles('finalize');
            scope.cliLogger.end(section);
            return result;
        }).catch(ErrorHandler.handler(scope));
        return promise;
    }

    /**
     * @returns {Promise<VinylFile>}
     */
    renderEntity(entity, entitySettings, buildConfiguration, parameters) {
        if (!entity) {
            this.logger.warn(this.className + '::renderEntity - No entity given');
            return Promise.resolve(false);
        }

        const scope = this;
        const promise = co(function*() {
            // Prepare
            const settings = entitySettings || {};
            const macroName = settings.macro || false;
            const siteName = entity.site.name;
            const entityName = entity.idString;

            // Export
            let workMessage = 'Exporting <' + entity.pathString + '>';
            if (macroName) {
                workMessage += ' / macro <' + macroName + '>';
            }
            const work = scope.cliLogger.work(workMessage);
            const exported = yield scope.exporter.export(siteName, entityName, macroName, settings);
            scope.cliLogger.end(work);

            // Done
            const file = new VinylFile({
                path: exported.configuration.filename,
                contents: new Buffer(exported.contents)
            });
            return [file];
        }).catch(ErrorHandler.handler(scope));
        return promise;
    }

    /**
     * @returns {Promise<Array<VinylFile>>}
     */
    processEntity(entity, buildConfiguration, parameters) {
        /* istanbul ignore next */
        if (!entity) {
            this.logger.warn(this.className + '::processEntity - No entity given');
            return Promise.resolve(false);
        }

        const scope = this;
        const promise = co(function*() {
            // Render each configured release
            const result = [];
            const settings = entity.properties.getByPath('export.' + scope.exportName, []);
            for (const setting of settings) {
                // Render entity
                const files = yield scope.renderEntity(
                    entity,
                    setting,
                    buildConfiguration,
                    parameters
                );
                if (files) {
                    const filesArray = Array.isArray(files) ? files : [files];
                    result.push(...filesArray);
                }
            }
            return result;
        }).catch(ErrorHandler.handler(scope));
        return promise;
    }

    /**
     * @inheritDoc
     */
    getEntities(query, buildConfiguration, parameters) {
        const scope = this;
        const promise = co(function*() {
            // Get all entities
            const allEntities = yield scope.globalRepository.resolveEntities(query);
            if (!parameters.exportMinimal) {
                return allEntities;
            }

            // Filter entities that define their own macros
            const entityMap = {};
            const findWithContentKindMacro = (entity) => {
                if (!entity) {
                    return false;
                }
                if (!entity.hasOwnContentOfKind(ContentKind.MACRO)) {
                    if (entity.site.extends) {
                        return findWithContentKindMacro(
                            waitForPromise(
                                scope.entitiesRepository.getById(entity.id, entity.site.extends)
                            )
                        );
                    }
                    return false;
                }
                return entity;
            };
            for (const e of allEntities) {
                const entity = findWithContentKindMacro(e);
                if (entity) {
                    entityMap[entity.pathString] = entity;
                }
            }
            return Object.values(entityMap);
        });
        return promise;
    }
}

/**
 * Exports
 * @ignore
 */
module.exports.ExportTask = ExportTask;
