'use strict';

/**
 * Requirements
 * @ignore
 */
const Command = require('./Command.js').Command;
const Context = require('../application/Context.js').Context;
const GlobalRepository = require('../model/GlobalRepository.js').GlobalRepository;
const PathesConfiguration = require('../model/configuration/PathesConfiguration.js').PathesConfiguration;
const Communication = require('../application/Communication.js').Communication;
const assertParameter = require('../utils/assert.js').assertParameter;
const ErrorHandler = require('../error/ErrorHandler.js').ErrorHandler;
const chalk = require('chalk');
const co = require('co');


/**
 * @memberOf command
 */
class LintCommand extends Command
{
    /**
     */
    constructor(context, globalRepository, pathesConfiguration, linters, options)
    {
        super(context);

        //Check params
        assertParameter(this, 'globalRepository', globalRepository, true, GlobalRepository);
        assertParameter(this, 'pathesConfiguration', pathesConfiguration, true, PathesConfiguration);

        // Assign options
        this._name = 'lint';
        this._globalRepository = globalRepository;
        this._pathesConfiguration = pathesConfiguration;
        this._linters = linters || [];
        this._options = options || {};
    }


    /**
     * @inheritDoc
     */
    static get injections()
    {
        return { 'parameters': [Context, GlobalRepository, PathesConfiguration, 'command/LintCommand.linters', 'command/LintCommand.options'] };
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'command/LintCommand';
    }


    /**
     * @type {Object}
     */
    get options()
    {
        return this._options;
    }


    /**
     * @type {Array}
     */
    get linters()
    {
        return this._linters;
    }


    /**
     * @type {model.configuration.PathesConfiguration}
     */
    get pathesConfiguration()
    {
        return this._pathesConfiguration;
    }


    /**
     * @type {model.GlobalRepository}
     */
    get globalRepository()
    {
        return this._globalRepository;
    }


    /**
     * @inheritDocs
     */
    get help()
    {
        const help =
        {
            name: this._name,
            description: 'Lints files',
            actions: []
        };
        return help;
    }


    /**
     * @inheritDocs
     * @returns {Promise<Server>}
     */
    lint(action, parameters)
    {
        const scope = this;
        const logger = scope.createLogger('command.lint');
        const promise = co(function *()
        {
            const com = scope.context.di.create(Communication);
            const query = action || '*';
            const section = logger.section('Linting <' + query + '>');
            const sectionResult =
            {
                errorCount: 0,
                warningCount: 0
            };

            // Lint each entity
            const entities = yield scope.globalRepository.resolveEntities(query);
            for (const entity of entities)
            {
                const entityPath = yield scope.pathesConfiguration.resolveEntityForSite(entity.entity, entity.site);
                const result =
                {
                    success: true,
                    errorCount: 0,
                    warningCount: 0,
                    messages: [],
                    files: []
                };
                const work = logger.work();
                const linterResults = [];
                for (const linter of scope.linters)
                {
                    const linterResult = yield linter.lint(entityPath);

                    // Add linter results
                    linterResults.push(
                        {
                            entity: entity.pathString,
                            linter: linter.name,
                            contentKind: linter.contentKind,
                            success: linterResult.success,
                            warningCount: linterResult.warningCount,
                            errorCount: linterResult.errorCount,
                            messages: linterResult.messages
                        });

                    // Prepare for output
                    if (!linterResult.success)
                    {
                        result.success = false;
                    }
                    result.errorCount+= linterResult.errorCount;
                    result.warningCount+= linterResult.warningCount;
                    sectionResult.errorCount+= linterResult.errorCount;
                    sectionResult.warningCount+= linterResult.warningCount;
                    Array.prototype.push.apply(result.messages, linterResult.messages);
                    Array.prototype.push.apply(result.files, linterResult.files);
                }

                // Dispatch lint results
                yield com.send('lint-results', linterResults);

                // Prepare output
                if (result.success)
                {
                    logger.end(work, false, 'Linting <' + entity.id.asString('path') + '>');
                }
                else
                {
                    logger.end(work, true, 'Linting <' + entity.id.asString('path') + '> failed with ' +
                        chalk.yellow(result.errorCount) + ' errors and ' +
                        chalk.yellow(result.warningCount) + ' warnings.');

                    //Show messages
                    const messagesByFile = {};
                    for (const message of result.messages)
                    {
                        messagesByFile[message.filename] = messagesByFile[message.filename] || [];
                        messagesByFile[message.filename].push(message);
                    }
                    for (const file in messagesByFile)
                    {
                        const messages = messagesByFile[file];
                        logger.info('   ' + messages[0].filename.replace(scope._pathesConfiguration.root, '') + '');
                        for (const message of messages)
                        {
                            logger.info(chalk.magenta('     @' + message.line) + ' ' + message.message + chalk.dim(' (' + message.ruleId + ')'));
                        }
                        logger.info();
                    }
                }
            }

            if (sectionResult.errorCount > 0)
            {
                // exit with non-zero for git hooks
                logger.end(section, true);
                if (scope.options.exitCodes !== false)
                {
                    process.exit(1);
                }
            }
            else
            {
                // exit with zero
                logger.end(section, false);
                if (scope.options.exitCodes !== false)
                {
                    process.exit(0);
                }
            }
            return true;
        }).catch(ErrorHandler.handler(scope));
        return promise;
    }


    /**
     * @inheritDocs
     * @returns {Promise<Server>}
     */
    dispatch(action, parameters)
    {
        return this.lint(action, parameters);
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.LintCommand = LintCommand;
