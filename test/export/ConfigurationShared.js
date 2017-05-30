'use strict';

/**
 * Requirements
 * @ignore
 */
const Site = require(ES_SOURCE + '/model/site/Site.js').Site;
const EntityAspect = require(ES_SOURCE + '/model/entity/EntityAspect.js').EntityAspect;
const DocumentationCallable = require(ES_SOURCE + '/model/documentation/DocumentationCallable.js').DocumentationCallable;
const ContentType = require(ES_SOURCE + '/model/ContentType.js').ContentType;
const ContentKind = require(ES_SOURCE + '/model/ContentKind.js').ContentKind;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const co = require('co');


/**
 * Shared Renderer spec
 */
function spec(type, className, prepareParameters)
{
    /**
     * Base Test
     */
    baseSpec(type, className, prepareParameters);


    /**
     * Configuration Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic(true);
    });


    function createTestee(entity, macro, settings)
    {
        return new type(entity, macro, settings, undefined, undefined, global.fixtures.globalRepository, global.fixtures.buildConfiguration);
    }

    /**
     * Create a new entity and registers it
     */
    function createEntity(idPath, macros, properties)
    {
        const entity = global.fixtures.createEntity(idPath);
        entity.properties.load(properties || {});
        const macroNames = [];
        if (!macros)
        {
            macroNames.push(entity.idString.replace('-', '_'));
        }
        else
        {
            macroNames.push(...macros);
        }
        for (const macroName of macroNames)
        {
            const macro = new DocumentationCallable(
                {
                    name: macroName,
                    contentType: ContentType.JINJA,
                    contentKind: ContentKind.MACRO,
                    site: global.fixtures.siteBase
                });
            entity.documentation.push(macro);
        }
    }


    describe('#getMacroConfiguration()', function()
    {
        describe('defaults', function()
        {
            it('should yield a configuration containing the macro, entity and site of the main macro', function()
            {
                const promise = co(function *()
                {
                    createEntity('base/elements/e-headline');
                    const settings =
                    {
                        mode: 'inline',
                        view: 'view.jsp'
                    };
                    const entity = yield global.fixtures.entitiesRepository.getById('e-headline', global.fixtures.siteBase);
                    const macro = yield global.fixtures.globalRepository.resolveMacro(global.fixtures.siteBase, 'e_headline');
                    const testee = createTestee(entity, macro, settings);
                    const config = yield testee.getMacroConfiguration();
                    expect(config.macro).to.be.instanceof(DocumentationCallable);
                    expect(config.macro.name).to.be.equal('e_headline');
                    expect(config.entity).to.be.instanceof(EntityAspect);
                    expect(config.entity.idString).to.be.equal('e-headline');
                    expect(config.site).to.be.instanceof(Site);
                    expect(config.site.name).to.be.equal('Base');
                });
                return promise;
            });

            it('should yield a configuration for a specific macro', function()
            {
                const promise = co(function *()
                {
                    createEntity('base/elements/e-headline', ['e_headline', 'e_headline2']);
                    const settings = {};
                    const entity = yield global.fixtures.entitiesRepository.getById('e-headline', global.fixtures.siteBase);
                    const macro = yield global.fixtures.globalRepository.resolveMacro(global.fixtures.siteBase, 'e_headline2');
                    const testee = createTestee(entity, macro, settings);
                    const config = yield testee.getMacroConfiguration();
                    expect(config.macro).to.be.instanceof(DocumentationCallable);
                    expect(config.macro.name).to.be.equal('e_headline2');
                    expect(config.entity).to.be.instanceof(EntityAspect);
                    expect(config.entity.idString).to.be.equal('e-headline');
                    expect(config.site).to.be.instanceof(Site);
                    expect(config.site.name).to.be.equal('Base');
                });
                return promise;
            });
        });


        describe('export settings', function()
        {
            it('should allow to configure the main macro via export settings', function()
            {
                const promise = co(function *()
                {
                    createEntity('base/elements/e-headline', ['e_headline', 'e_headline2']);
                    const settings =
                    {
                        mode: 'inline',
                        view: 'view.jsp'
                    };
                    const entity = yield global.fixtures.entitiesRepository.getById('e-headline', global.fixtures.siteBase);
                    const macro = yield global.fixtures.globalRepository.resolveMacro(global.fixtures.siteBase, 'e_headline');
                    const testee = createTestee(entity, macro, settings);
                    const config = yield testee.getMacroConfiguration();
                    expect(config.mode).to.be.equal('inline');
                    expect(config.view).to.be.equal('view.jsp');
                });
                return promise;
            });

            it('should allow to configure specific macros via export settings', function()
            {
                const promise = co(function *()
                {
                    createEntity('base/elements/e-headline', ['e_headline', 'e_headline2']);
                    const settings =
                    {
                        settings:
                        {
                            macros:
                            {
                                e_headline2:
                                {
                                    mode: 'inline',
                                    view: 'view.html'
                                }
                            }
                        }
                    };
                    const entity = yield global.fixtures.entitiesRepository.getById('e-headline', global.fixtures.siteBase);
                    const macro = yield global.fixtures.globalRepository.resolveMacro(global.fixtures.siteBase, 'e_headline2');
                    const testee = createTestee(entity, macro, settings);
                    const config = yield testee.getMacroConfiguration();
                    expect(config.mode).to.be.equal('inline');
                    expect(config.view).to.be.equal('view.html');
                });
                return promise;
            });
        });


        describe('global settings', function()
        {
            it('should allow to configure the main macro via global settings', function()
            {
                const promise = co(function *()
                {
                    const properties =
                    {
                        base:
                        {
                            export:
                            {
                                settings:
                                {
                                    default:
                                    {
                                        mode: 'inline'
                                    }
                                }
                            }
                        }
                    };
                    createEntity('base/elements/e-headline', ['e_headline', 'e_headline2'], properties);
                    const settings = {};
                    const entity = yield global.fixtures.entitiesRepository.getById('e-headline', global.fixtures.siteBase);
                    const macro = yield global.fixtures.globalRepository.resolveMacro(global.fixtures.siteBase, 'e_headline');
                    const testee = createTestee(entity, macro, settings);
                    const config = yield testee.getMacroConfiguration();
                    expect(config.mode).to.be.equal('inline');
                });
                return promise;
            });

            it('should allow to configure a specific macro via global settings', function()
            {
                const promise = co(function *()
                {
                    const properties =
                    {
                        base:
                        {
                            export:
                            {
                                settings:
                                {
                                    default:
                                    {
                                        macros:
                                        {
                                            '*':
                                            {
                                                mode: 'inline'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    };
                    createEntity('base/elements/e-headline', ['e_headline', 'e_headline2'], properties);
                    const settings = {};
                    const entity = yield global.fixtures.entitiesRepository.getById('e-headline', global.fixtures.siteBase);
                    const macro = yield global.fixtures.globalRepository.resolveMacro(global.fixtures.siteBase, 'e_headline2');
                    const testee = createTestee(entity, macro, settings);
                    const config = yield testee.getMacroConfiguration();
                    expect(config.mode).to.be.equal('inline');
                });
                return promise;
            });
        });
    });
}

/**
 * Exports
 */
module.exports.spec = spec;
