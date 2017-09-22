'use strict';

/**
 * Requirements
 * @ignore
 */
const Route = require('./Route.js').Route;
const CliLogger = require('../../cli/CliLogger.js').CliLogger;
const ErrorHandler = require('../../error/ErrorHandler.js').ErrorHandler;
const UrlsConfiguration = require('../../model/configuration/UrlsConfiguration.js').UrlsConfiguration;
const Environment = require('../../nunjucks/Environment.js').Environment;
const PathesConfiguration = require('../../model/configuration/PathesConfiguration.js').PathesConfiguration;
const waitForPromise = require('../../utils/synchronize.js').waitForPromise;
const assertParameter = require('../../utils/assert.js').assertParameter;
const pathes = require('../../utils/pathes.js');
const co = require('co');
const fs = require('co-fs-extra');


/**
 * A route to server any entity related nunjucks files
 *
 * @memberOf server.routes
 */
class EntityTemplateRoute extends Route
{
    /**
     * @param {cli.CliLogger} cliLogger
     * @param {model.configuration.UrlsConfiguration} urlsConfiguration
     * @param {nunjucks.Environment} nunjucks
     */
    constructor(cliLogger, urlsConfiguration, pathesConfiguration, nunjucks, options)
    {
        super(cliLogger.createPrefixed('routes.entityroute'));

        // Check params
        assertParameter(this, 'urlsConfiguration', urlsConfiguration, true, UrlsConfiguration);
        assertParameter(this, 'pathesConfiguration', pathesConfiguration, true, PathesConfiguration);
        assertParameter(this, 'nunjucks', nunjucks, true, Environment);

        // Assign options
        const opts = options || {};
        this._basePath = waitForPromise(pathesConfiguration.resolve(opts.basePath || ''));
        this._pathesConfiguration = pathesConfiguration;
        this._urlsConfiguration = urlsConfiguration;
        this._nunjucks = nunjucks;
    }


    /**
     * @inheritDocs
     */
    static get injections()
    {
        return { 'parameters': [CliLogger, UrlsConfiguration, PathesConfiguration, Environment, 'server.route/EntityTemplateRoute.options'] };
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'server.route/EntityTemplateRoute';
    }


    /**
     * @type {model.configuration.PathesConfiguration}
     */
    get pathesConfiguration()
    {
        return this._pathesConfiguration;
    }


    /**
     * @type {model.configuration.UrlsConfiguration}
     */
    get urlsConfiguration()
    {
        return this._urlsConfiguration;
    }


    /**
     * @type {nunjucks.Environment}
     */
    get nunjucks()
    {
        return this._nunjucks;
    }


    /**
     * @inheritDocs
     */
    handleEntityTemplate(request, response, next)
    {
        const scope = this;
        const promise = co(function *()
        {
            // Check extension
            if (!request.path.endsWith('.j2'))
            {
                next();
                return;
            }

            // Check file hit
            let data = yield scope.urlsConfiguration.matchEntityFile(request.path);
            let filename;
            if (!data || !data.file)
            {
                // Check direct file hit
                filename = pathes.concat(scope.pathesConfiguration.sites, request.path);
                if (!fs.existsSync(filename))
                {
                    next();
                    return;
                }
                data = yield scope.urlsConfiguration.matchEntity(request.path, true);
            }
            else
            {
                filename = data.file.filename;
            }

            // Render template
            const tpl = yield fs.readFile(filename, { encoding: 'utf8' });
            const work = scope.cliLogger.work('Serving url <' + request.url + '> using template <' + filename + '>');
            let html;
            try
            {
                const location =
                {
                    site: data.site,
                    entity: data.entity,
                    customPath: data.customPath
                };
                scope._nunjucks.addGlobal('location', location);
                scope._nunjucks.addGlobal('request', request);
                html = scope.nunjucks.renderString(tpl, data);
            }
            catch (e)
            {
                /* istanbul ignore next */
                scope.logger.error('handleEntityTemplate', e);
                /* istanbul ignore next */
                scope.cliLogger.error(scope.className + '::handleEntityTemplate', e);
                /* istanbul ignore next */
                next();
                return;
            }

            // Send
            response.send(html);
            scope.cliLogger.end(work);
        }).catch(ErrorHandler.handler(scope));
        return promise;
    }


    /**
     * @inheritDocs
     */
    register(express)
    {
        const promise = super.register(express);
        promise.then(() =>
        {
            express.all('/:site/*', this.handleEntityTemplate.bind(this));
        });
        return promise;
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.EntityTemplateRoute = EntityTemplateRoute;
