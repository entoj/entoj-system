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
function spec(type, className, prepareParameters, options)
{
    /**
     * Base Test
     */
    baseSpec(type, className, prepareParameters);


    /**
     * Configuration Test
     */
    const opts = options || {};
    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic({ skipEntities: true });
    });


    function createTestee(entity, macro, settings)
    {
        let params = [entity, macro, settings, undefined, undefined, undefined, global.fixtures.globalRepository, global.fixtures.buildConfiguration];
        if (prepareParameters)
        {
            params = prepareParameters(params);
        }
        return new type(...params);
    }
    spec.createTestee = createTestee;


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
    spec.createEntity = createEntity;


    describe('#getMacroConfiguration()', function()
    {
        it('should yield a configuration containing the macro, entity and site of the exported artefact', function()
        {
            const promise = co(function *()
            {
                createEntity('base/elements/e-headline');
                const settings = {};
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


        it('should allow to change configuration via export settings', function()
        {
            const promise = co(function *()
            {
                createEntity('base/elements/e-headline');
                const settings =
                {
                    view: 'local.html'
                };
                const entity = yield global.fixtures.entitiesRepository.getById('e-headline', global.fixtures.siteBase);
                const macro = yield global.fixtures.globalRepository.resolveMacro(global.fixtures.siteBase, 'e_headline');
                const testee = createTestee(entity, macro, settings);
                const config = yield testee.getMacroConfiguration();
                expect(config.view).to.be.equal('local.html');
            });
            return promise;
        });


        it('should allow to change configuration for specific macros via export settings', function()
        {
            const promise = co(function *()
            {
                createEntity('base/elements/e-headline', ['e_headline']);
                const settings =
                {
                    settings:
                    {
                        macros:
                        {
                            e_headline:
                            {
                                view: 'specific.html'
                            }
                        }
                    }
                };
                const entity = yield global.fixtures.entitiesRepository.getById('e-headline', global.fixtures.siteBase);
                const macro = yield global.fixtures.globalRepository.resolveMacro(global.fixtures.siteBase, 'e_headline');
                const testee = createTestee(entity, macro, settings);
                const config = yield testee.getMacroConfiguration();
                expect(config.view).to.be.equal('specific.html');
            });
            return promise;
        });


        it('should allow to change configuration via global export settings', function()
        {
            const promise = co(function *()
            {
                const identifier = opts.identifier || 'default';
                const globalSettings =
                {
                    base:
                    {
                        export:
                        {
                            settings:
                            {
                                [identifier]:
                                {
                                    view: 'global.html'
                                }
                            }
                        }
                    }
                };
                createEntity('base/elements/e-headline', ['e_headline'], globalSettings);
                const settings = {};
                const entity = yield global.fixtures.entitiesRepository.getById('e-headline', global.fixtures.siteBase);
                const macro = yield global.fixtures.globalRepository.resolveMacro(global.fixtures.siteBase, 'e_headline');
                const testee = createTestee(entity, macro, settings);
                const config = yield testee.getMacroConfiguration();
                expect(config.view).to.be.equal('global.html');
            });
            return promise;
        });


        it('should allow to change configuration for a specific macro via global export settings', function()
        {
            const promise = co(function *()
            {
                const identifier = opts.identifier || 'default';
                const globalSettings =
                {
                    base:
                    {
                        export:
                        {
                            settings:
                            {
                                [identifier]:
                                {
                                    macros:
                                    {
                                        '*':
                                        {
                                            view: 'specific.html'
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                createEntity('base/elements/e-headline', ['e_headline'], globalSettings);
                const settings = {};
                const entity = yield global.fixtures.entitiesRepository.getById('e-headline', global.fixtures.siteBase);
                const macro = yield global.fixtures.globalRepository.resolveMacro(global.fixtures.siteBase, 'e_headline');
                const testee = createTestee(entity, macro, settings);
                const config = yield testee.getMacroConfiguration();
                expect(config.view).to.be.equal('specific.html');
            });
            return promise;
        });


        it('should prefer local over global export settings', function()
        {
            const promise = co(function *()
            {
                const identifier = opts.identifier || 'default';
                const globalSettings =
                {
                    base:
                    {
                        export:
                        {
                            settings:
                            {
                                [identifier]:
                                {
                                    view: 'global.html'
                                }
                            }
                        }
                    }
                };
                createEntity('base/elements/e-headline', ['e_headline'], globalSettings);
                const settings =
                {
                    view: 'view.html'
                };
                const entity = yield global.fixtures.entitiesRepository.getById('e-headline', global.fixtures.siteBase);
                const macro = yield global.fixtures.globalRepository.resolveMacro(global.fixtures.siteBase, 'e_headline');
                const testee = createTestee(entity, macro, settings);
                const config = yield testee.getExportConfiguration();
                expect(config.view).to.be.equal('view.html');
            });
            return promise;
        });
    });



    describe('#getExportConfiguration()', function()
    {
        it('should yield a configuration containing the entity and site of the export artefact', function()
        {
            const promise = co(function *()
            {
                createEntity('base/elements/e-headline');
                const settings = {};
                const entity = yield global.fixtures.entitiesRepository.getById('e-headline', global.fixtures.siteBase);
                const testee = createTestee(entity, false, settings);
                const config = yield testee.getExportConfiguration();
                expect(config.entity).to.be.instanceof(EntityAspect);
                expect(config.entity.idString).to.be.equal('e-headline');
                expect(config.site).to.be.instanceof(Site);
                expect(config.site.name).to.be.equal('Base');
            });
            return promise;
        });


        it('should allow to change configuration via export settings', function()
        {
            const promise = co(function *()
            {
                createEntity('base/elements/e-headline');
                const settings =
                {
                    view: 'view.html'
                };
                const entity = yield global.fixtures.entitiesRepository.getById('e-headline', global.fixtures.siteBase);
                const testee = createTestee(entity, false, settings);
                const config = yield testee.getExportConfiguration();
                expect(config.view).to.be.equal('view.html');
            });
            return promise;
        });


        it('should allow to change configuration via global export settings', function()
        {
            const promise = co(function *()
            {
                const identifier = opts.identifier || 'default';
                const globalSettings =
                {
                    base:
                    {
                        export:
                        {
                            settings:
                            {
                                [identifier]:
                                {
                                    view: 'global.html'
                                }
                            }
                        }
                    }
                };
                createEntity('base/elements/e-headline', [], globalSettings);
                const settings = {};
                const entity = yield global.fixtures.entitiesRepository.getById('e-headline', global.fixtures.siteBase);
                const testee = createTestee(entity, false, settings);
                const config = yield testee.getExportConfiguration();
                expect(config.view).to.be.equal('global.html');
            });
            return promise;
        });


        it('should prefer local over global export settings', function()
        {
            const promise = co(function *()
            {
                const identifier = opts.identifier || 'default';
                const globalSettings =
                {
                    base:
                    {
                        export:
                        {
                            settings:
                            {
                                [identifier]:
                                {
                                    view: 'global.html'
                                }
                            }
                        }
                    }
                };
                createEntity('base/elements/e-headline', [], globalSettings);
                const settings =
                {
                    view: 'view.html'
                };
                const entity = yield global.fixtures.entitiesRepository.getById('e-headline', global.fixtures.siteBase);
                const testee = createTestee(entity, false, settings);
                const config = yield testee.getExportConfiguration();
                expect(config.view).to.be.equal('view.html');
            });
            return promise;
        });
    });
}

/**
 * Exports
 */
module.exports.spec = spec;
