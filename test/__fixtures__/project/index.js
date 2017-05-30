'use strict';

/**
 * Requirements
 * @ignore
 */
const testFixture = require('entoj-test-fixture');
const EntityCategory = require(ES_SOURCE + '/model/entity/EntityCategory.js').EntityCategory;
const Site = require(ES_SOURCE + '/model/site/Site.js').Site;
const SitesRepository = require(ES_SOURCE + '/model/site/SitesRepository.js').SitesRepository;
const Entity = require(ES_SOURCE + '/model/entity/Entity.js').Entity;
const EntityIdTemplate = require(ES_SOURCE + '/model/entity/EntityIdTemplate.js').EntityIdTemplate;
const EntitiesRepository = require(ES_SOURCE + '/model/entity/EntitiesRepository.js').EntitiesRepository;
const EntityCategoriesRepository = require(ES_SOURCE + '/model/entity/EntityCategoriesRepository.js').EntityCategoriesRepository;
const PathesConfiguration = require(ES_SOURCE + '/model/configuration/PathesConfiguration.js').PathesConfiguration;
const GlobalConfiguration = require(ES_SOURCE + '/model/configuration/GlobalConfiguration.js').GlobalConfiguration;
const BuildConfiguration = require(ES_SOURCE + '/model/configuration/BuildConfiguration.js').BuildConfiguration;
const GlobalRepository = require(ES_SOURCE + '/model/GlobalRepository.js').GlobalRepository;
const CompactIdParser = require(ES_SOURCE + '/parser/entity/CompactIdParser.js').CompactIdParser;
const File = require(ES_SOURCE + '/model/file/File.js').File;
const ContentType = require(ES_SOURCE + '/model/ContentType.js').ContentType;
const Context = require(ES_SOURCE + '/application/Context.js').Context;
const glob = require(ES_SOURCE + '/utils/glob.js');
const synchronize = require(ES_SOURCE + '/utils/synchronize.js');
const clone = require('lodash.clone');
const merge = require('lodash.merge');


/**
 * Creates a complete static project fixture
 */
function createStatic(skipEntities)
{
    const result = {};

    result.globalConfiguration = new GlobalConfiguration();
    result.buildConfiguration = new BuildConfiguration();
    result.pathesConfiguration = new PathesConfiguration(
        {
            root: testFixture.pathToSites,
            dataTemplate: testFixture.pathToData,
            sitesTemplate: '${root}',
            siteTemplate: '${sites}/${site.name.toLowerCase()}',
            entityCategoryTemplate: '${sites}/${site.name.toLowerCase()}/${entityCategory.pluralName.toLowerCase()}',
            entityIdTemplate: '${sites}/${site.name.toLowerCase()}/${entityCategory.pluralName.toLowerCase()}/${entityCategory.shortName}-${entityId.name}',
            entityIdGlobalTemplate: '${sites}/${site.name.toLowerCase()}/${entityCategory.pluralName.toLowerCase()}'
        });

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

    result.createEntity = function(idPath)
    {
        const entityId = synchronize.execute(result.entityIdParser, 'parse', [idPath]);
        const entity = new Entity({ id: entityId.entityId });
        result.entitiesRepository.add(entity);
        return entity;
    };

    if (!skipEntities)
    {
        const addFiles = function(entity, site, globs, contentType, contentKind)
        {
            const basePath = synchronize.execute(result.pathesConfiguration, 'resolveEntityIdForSite', [entity.id, site]);
            const globPathes = globs.map((item) => basePath + '/' + item);
            const files = synchronize.execute(undefined, glob, globPathes);
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
            addFiles(entity, result.siteBase, ['*.j2'], ContentType.JINJA);
            addFiles(entity, result.siteBase, ['*.md'], ContentType.MARKDOWN);
            addFiles(entity, result.siteBase, ['js/*.js'], ContentType.JS);
            addFiles(entity, result.siteBase, ['models/*.json'], ContentType.JSON);
            addFiles(entity, result.siteExtended, ['*.j2'], ContentType.JINJA);
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
            require(ES_SOURCE + '/model/loader/documentation').JinjaPlugin
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

    // create global instances
    result.sitesRepository = result.context.di.create(SitesRepository);
    result.entitiesRepository = result.context.di.create(EntitiesRepository);
    result.globalRepository = result.context.di.create(GlobalRepository);
    result.buildConfiguration = result.context.di.create(BuildConfiguration);

    // create shortcuts
    result.siteBase = synchronize.execute(result.sitesRepository, 'findBy', ['name', 'Base']);
    result.siteExtended = synchronize.execute(result.sitesRepository, 'findBy', ['name', 'Extended']);

    return result;
}


/**
 * Exports
 */
module.exports.createStatic = createStatic;
module.exports.createDynamic = createDynamic;
