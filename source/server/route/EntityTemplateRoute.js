'use strict';

/**
 * Requirements
 * @ignore
 */
const Route = require('./Route.js').Route;
const CliLogger = require('../../cli/CliLogger.js').CliLogger;
const UrlsConfiguration = require('../../model/configuration/UrlsConfiguration.js').UrlsConfiguration;
const Environment = require('../../nunjucks/Environment.js').Environment;
const assertParameter = require('../../utils/assert.js').assertParameter;
const co = require('co');
const fs = require('fs-extra');


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
    constructor(cliLogger, urlsConfiguration, nunjucks, options)
    {
        super(cliLogger);

        // Check params
        assertParameter(this, 'urlsConfiguration', urlsConfiguration, true, UrlsConfiguration);
        assertParameter(this, 'nunjucks', nunjucks, true, Environment);

        // Assign options
        const opts = options || {};
        this._basePath = opts.basePath || '';
        this._urlsConfiguration = urlsConfiguration;
        this._nunjucks = nunjucks;
    }


    /**
     * @inheritDocs
     */
    static get injections()
    {
        return { 'parameters': [CliLogger, 'server.route/EntityTemplateRoute.options'] };
    }


    /**
     * @inheritDocs
     */
    static get className()
    {
        return 'server.route/EntityTemplateRoute';
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
            const data = yield scope.urlsConfiguration.matchEntityFile(request.path);
            if (!data || !data.file)
            {
                next();
                return;
            }

            // Render template
            const tpl = yield fs.readFile(data.file.filename, { encoding: 'utf8' });
            const work = scope.cliLogger.work('Serving url <' + request.url + '> using template <' + data.file.filename + '>');
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
        })
        .catch(function(error)
        {
            /* istanbul ignore next */
            scope.logger.error('handleEntityTemplate', error);
            /* istanbul ignore next */
            scope.cliLogger.error(scope.className + '::handleTemplate', error.stack);
        });
        return promise;
    }


    /**
     * @inheritDocs
     */
    register(express)
    {
        super.register(express);
        express.all('/:site/*', this.handleEntityTemplate.bind(this));
    }
}


/**
 * Exports
 * @ignore
 */
module.exports.EntityTemplateRoute = EntityTemplateRoute;
