'use strict';

/**
 * Requirements
 * @ignore
 */
const testFixture = require('entoj-test-fixture');
const CliLogger = require(ES_SOURCE + '/cli/CliLogger.js').CliLogger;
const EntityCategory = require(ES_SOURCE + '/model/entity/EntityCategory.js').EntityCategory;
const Site = require(ES_SOURCE + '/model/site/Site.js').Site;
const SitesRepository = require(ES_SOURCE + '/model/site/SitesRepository.js').SitesRepository;
const Entity = require(ES_SOURCE + '/model/entity/Entity.js').Entity;
const EntityIdTemplate = require(ES_SOURCE + '/model/entity/EntityIdTemplate.js').EntityIdTemplate;
const EntitiesRepository = require(ES_SOURCE + '/model/entity/EntitiesRepository.js').EntitiesRepository;
const EntityCategoriesRepository = require(ES_SOURCE + '/model/entity/EntityCategoriesRepository.js').EntityCategoriesRepository;
const FilesRepository = require(ES_SOURCE + '/model/file/FilesRepository.js').FilesRepository;
const ViewModelRepository = require(ES_SOURCE + '/model/viewmodel/ViewModelRepository.js').ViewModelRepository;
const PathesConfiguration = require(ES_SOURCE + '/model/configuration/PathesConfiguration.js').PathesConfiguration;
const UrlsConfiguration = require(ES_SOURCE + '/model/configuration/UrlsConfiguration.js').UrlsConfiguration;
const GlobalConfiguration = require(ES_SOURCE + '/model/configuration/GlobalConfiguration.js').GlobalConfiguration;
const BuildConfiguration = require(ES_SOURCE + '/model/configuration/BuildConfiguration.js').BuildConfiguration;
const GlobalRepository = require(ES_SOURCE + '/model/GlobalRepository.js').GlobalRepository;
const CompactIdParser = require(ES_SOURCE + '/parser/entity/CompactIdParser.js').CompactIdParser;
const SystemModuleConfiguration = require(ES_SOURCE + '/configuration/SystemModuleConfiguration.js').SystemModuleConfiguration;
const TranslationsLoader = require(ES_SOURCE + '/model/translation/TranslationsLoader.js').TranslationsLoader;
const TranslationsRepository = require(ES_SOURCE + '/model/translation/TranslationsRepository.js').TranslationsRepository;
const File = require(ES_SOURCE + '/model/file/File.js').File;
const ContentType = require(ES_SOURCE + '/model/ContentType.js').ContentType;
const Context = require(ES_SOURCE + '/application/Context.js').Context;
const glob = require(ES_SOURCE + '/utils/glob.js');
const synchronize = require(ES_SOURCE + '/utils/synchronize.js');
const clone = require('lodash.clone');
const merge = require('lodash.merge');
const path = require('path');


/**
 * Creates a complete static project fixture
 */
function createStatic(options)
{
    const opts = options || {};
    const result = {};

    result.pathToLibraries = testFixture.pathToLibraries;
    result.globalConfiguration = new GlobalConfiguration(opts.settings);
    result.buildConfiguration = new BuildConfiguration(opts.build);
    result.moduleConfiguration = new SystemModuleConfiguration(result.globalConfiguration, result.buildConfiguration);
    result.pathesConfiguration = new PathesConfiguration(
        merge(
            {
                root: testFixture.pathToSites,
                dataTemplate: testFixture.pathToData,
                sitesTemplate: '${root}',
                siteTemplate: '${sites}/${site.name.toLowerCase()}',
                entityCategoryTemplate: '${sites}/${site.name.toLowerCase()}/${entityCategory.pluralName.toLowerCase()}',
                entityIdTemplate: '${sites}/${site.name.toLowerCase()}/${entityCategory.pluralName.toLowerCase()}/${entityCategory.shortName}-${entityId.name}',
                entityIdGlobalTemplate: '${sites}/${site.name.toLowerCase()}/${entityCategory.pluralName.toLowerCase()}'
            },
            opts.pathesConfiguration
        )
    );

    result.categoryGlobal = new EntityCategory({ longName: 'Global', pluralName: 'Global', shortName: 'l', isGlobal: true });
    result.categoryElement = new EntityCategory({ longName: 'Element' });
    result.categoryModule = new EntityCategory({ longName: 'Module' });
    result.categoryModuleGroup = new EntityCategory({ longName: 'Module-Group', shortName: 'g' });
    result.categoryPage = new EntityCategory({ longName: 'Page' });
    result.categoryTemplate = new EntityCategory({ longName: 'Template' });
    result.categoriesRepository = new EntityCategoriesRepository();
    result.categoriesRepository.add(result.categoryGlobal);
    result.categoriesRepository.add(result.categoryElement);
    result.categoriesRepository.add(result.categoryModule);
    result.categoriesRepository.add(result.categoryModuleGroup);
    result.categoriesRepository.add(result.categoryPage);
    result.categoriesRepository.add(result.categoryTemplate);

    result.siteBase = new Site({ name: 'Base' });
    result.siteExtended = new Site({ name: 'Extended' });
    result.siteExtended.extends = result.siteBase;
    result.sitesRepository = new SitesRepository();
    result.sitesRepository.add(result.siteBase);
    result.sitesRepository.add(result.siteExtended);

    result.entityIdParser = new CompactIdParser(result.sitesRepository, result.categoriesRepository, { useNumbers: false });
    result.entityIdTemplate = new EntityIdTemplate(result.entityIdParser);
    result.entitiesRepository = new EntitiesRepository(result.entityIdParser);

    result.globalRepository = new GlobalRepository(result.sitesRepository, result.categoriesRepository, result.entitiesRepository);
    result.systemConfiguration = new SystemModuleConfiguration(result.globalConfiguration, result.buildConfiguration);
    result.urlsConfiguration = new UrlsConfiguration(result.sitesRepository, result.categoriesRepository, result.entitiesRepository,
        result.entityIdParser, result.pathesConfiguration);
    result.viewModelRepository = new ViewModelRepository(result.entitiesRepository, result.pathesConfiguration);
    result.filesRepository = new FilesRepository(result.entitiesRepository);
    result.translationsRepository = new TranslationsRepository(new TranslationsLoader(result.sitesRepository, result.pathesConfiguration, result.globalConfiguration));
    result.cliLogger = new CliLogger('', { muted: true });

    result.createEntity = function(idPath)
    {
        const entityId = synchronize.execute(result.entityIdParser, 'parse', [idPath]);
        const entity = new Entity({ id: entityId.entityId });
        result.entitiesRepository.add(entity);
        return entity;
    };

    if (opts.skipEntities !== true)
    {
        const addFiles = function(entity, site, globs, contentType, contentKind)
        {
            const basePath = synchronize.execute(result.pathesConfiguration, 'resolveEntityIdForSite', [entity.id, site]);
            const globPathes = globs.map((item) => path.join(basePath, item));
            const files = synchronize.execute(undefined, glob, [globPathes]);
            for (const filename of files)
            {
                const file = new File(
                    {
                        filename: filename,
                        contentType: contentType,
                        contentKind: contentKind,
                        contents: 'DUMMY',
                        site: site
                    });
                entity.files.push(file);
            }
        };

        const createEntityWithFiles = function(idPath)
        {
            const entityId = synchronize.execute(result.entityIdParser, 'parse', [idPath]);
            const entity = new Entity({ id: entityId.entityId });
            addFiles(entity, result.siteBase, ['*.j2', 'examples/*.j2'], ContentType.JINJA);
            addFiles(entity, result.siteBase, ['*.md'], ContentType.MARKDOWN);
            addFiles(entity, result.siteBase, ['js/*.js'], ContentType.JS);
            addFiles(entity, result.siteBase, ['models/*.json'], ContentType.JSON);
            addFiles(entity, result.siteExtended, ['*.j2', 'examples/*.j2'], ContentType.JINJA);
            addFiles(entity, result.siteExtended, ['*.md'], ContentType.MARKDOWN);
            addFiles(entity, result.siteExtended, ['js/*.js'], ContentType.JS);
            addFiles(entity, result.siteExtended, ['models/*.json'], ContentType.JSON);
            return entity;
        };

        result.entityGlobal = createEntityWithFiles('base/global');
        result.entityCta = createEntityWithFiles('base/elements/e-cta');
        result.entityHeadline = createEntityWithFiles('base/elements/e-headline');
        result.entityImage = createEntityWithFiles('base/elements/e-image');
        result.entityImage.usedBy.push(result.siteExtended);
        result.entityTeaser = createEntityWithFiles('base/modules/m-teaser');
        result.entityTeaserlist = createEntityWithFiles('base/module-groups/g-teaserlist');
        result.entityStart = createEntityWithFiles('base/pages/p-start');
        result.entityBare = createEntityWithFiles('base/templates/t-bare');

        result.entitiesRepository.add(result.entityGlobal);
        result.entitiesRepository.add(result.entityCta);
        result.entitiesRepository.add(result.entityHeadline);
        result.entitiesRepository.add(result.entityImage);
        result.entitiesRepository.add(result.entityTeaser);
        result.entitiesRepository.add(result.entityTeaserlist);
        result.entitiesRepository.add(result.entityStart);
        result.entitiesRepository.add(result.entityBare);
    }

    return result;
}


/**
 * Creates a complete dynamic project fixture
 */
function createDynamic(configuration)
{
    // Get fixture config
    let config = clone(testFixture.configuration);

    // Add logger
    config.logger = {};
    config.logger.muted = true;

    // Add sites
    config.sites = {};
    config.sites.loader =
    {
        type: require(ES_SOURCE + '/model/site').SitesLoader,
        plugins:
        [
            require(ES_SOURCE + '/model/loader/documentation').PackagePlugin
        ]
    };

    // Add entities
    config.entities = {};
    config.entities.idParser =
    {
        type: require(ES_SOURCE + '/parser/entity/CompactIdParser.js').CompactIdParser
    };
    config.entities.loader =
    {
        type: require(ES_SOURCE + '/model/entity').EntitiesLoader,
        plugins:
        [
            require(ES_SOURCE + '/model/loader/documentation').PackagePlugin,
            require(ES_SOURCE + '/model/loader/documentation').JinjaPlugin,
            require(ES_SOURCE + '/model/loader/documentation').MarkdownPlugin
        ]
    };

    // Add entityCategories
    config.entityCategories = {};
    config.entityCategories.loader =
    {
        type: require(ES_SOURCE + '/model/entity').EntityCategoriesLoader,
        categories:
        [
            {
                longName: 'Global',
                pluralName: 'Global',
                isGlobal: true,
                shortName: 'o'
            },
            {
                longName: 'Element'
            },
            {
                longName: 'Module'
            },
            {
                shortName: 'g',
                longName: 'Module Group'
            },
            {
                longName: 'Template'
            },
            {
                longName: 'Page'
            }
        ]
    };

    // Add environments
    config.environments =
    {
        development: {}
    };

    // apply custom configuration
    if (typeof configuration == 'function')
    {
        config = configuration(config);
    }
    else
    {
        config = merge(config, configuration);
    }

    // create context
    const result = {};
    result.context = new Context(config);

    // map defaults
    result.context.di.map('cli/CliLogger.options', { muted: config.logger.muted || false });
    result.context.di.map('model.configuration/BuildConfiguration.options', { environments: config.environments });

    // create global instances
    result.pathToLibraries = testFixture.pathToLibraries;
    result.systemConfiguration = result.context.di.create(SystemModuleConfiguration);
    result.pathesConfiguration = result.context.di.create(PathesConfiguration);
    result.sitesRepository = result.context.di.create(SitesRepository);
    result.entitiesRepository = result.context.di.create(EntitiesRepository);
    result.entityCategoriesRepository = result.context.di.create(EntityCategoriesRepository);
    result.viewModelRepository = result.context.di.create(ViewModelRepository);
    result.globalRepository = result.context.di.create(GlobalRepository);
    result.filesRepository = result.context.di.create(FilesRepository);
    result.translationsRepository = result.context.di.create(TranslationsRepository);
    result.buildConfiguration = result.context.di.create(BuildConfiguration);
    result.urlsConfiguration = result.context.di.create(UrlsConfiguration);
    result.globalConfiguration = result.context.di.create(GlobalConfiguration);
    result.cliLogger = result.context.di.create(CliLogger);

    // create shortcuts
    result.siteBase = synchronize.execute(result.sitesRepository, 'findBy', [{ 'name': 'Base' }]);
    result.siteExtended = synchronize.execute(result.sitesRepository, 'findBy', [{ 'name': 'Extended' }]);

    return result;
}


/**
 * Exports
 */
module.exports.createStatic = createStatic;
module.exports.createDynamic = createDynamic;
