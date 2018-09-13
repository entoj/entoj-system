'use strict';

/**
 * Requirements
 */
const UrlsConfiguration = require(ES_SOURCE + '/model/configuration/UrlsConfiguration.js')
    .UrlsConfiguration;
const GlobalConfiguration = require(ES_SOURCE + '/model/configuration/GlobalConfiguration.js')
    .GlobalConfiguration;
const SystemModuleConfiguration = require(ES_SOURCE + '/configuration/SystemModuleConfiguration.js')
    .SystemModuleConfiguration;
const EntityCategory = require(ES_SOURCE + '/model/entity/EntityCategory.js').EntityCategory;
const EntityId = require(ES_SOURCE + '/model/entity/EntityId.js').EntityId;
const File = require(ES_SOURCE + '/model/file/File.js').File;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;

/**
 * Spec
 */
describe(UrlsConfiguration.className, function() {
    /**
     * Base Tests
     */
    baseSpec(UrlsConfiguration, 'model.configuration/UrlsConfiguration', prepareParameters);

    function prepareParameters(parameters) {
        parameters.unshift(global.fixtures.moduleConfiguration);
        parameters.unshift(global.fixtures.pathesConfiguration);
        parameters.unshift(global.fixtures.entityIdParser);
        parameters.unshift(global.fixtures.entitiesRepository);
        parameters.unshift(global.fixtures.categoriesRepository);
        parameters.unshift(global.fixtures.sitesRepository);
        return parameters;
    }

    /**
     * UrlsConfiguration Tests
     */
    beforeEach(function() {
        global.fixtures = projectFixture.createStatic();
    });

    const createTestee = function(configuration) {
        global.fixtures.globalConfiguration = new GlobalConfiguration(configuration);
        global.fixtures.moduleConfiguration = new SystemModuleConfiguration(
            global.fixtures.globalConfiguration,
            global.fixtures.buildConfiguration
        );
        return new UrlsConfiguration(
            global.fixtures.sitesRepository,
            global.fixtures.categoriesRepository,
            global.fixtures.entitiesRepository,
            global.fixtures.entityIdParser,
            global.fixtures.pathesConfiguration,
            global.fixtures.moduleConfiguration
        );
    };

    describe('#resolveFilename', function() {
        it('should resolve a filename to a url if it exists', function() {
            const urls = {};
            const testee = createTestee(urls);
            const promise = testee
                .resolveFilename(
                    global.fixtures.pathesConfiguration.root + '/base/modules/m-teaser/m-teaser.md'
                )
                .then(function(url) {
                    expect(url).to.be.equal('/base/modules/m-teaser/m-teaser.md');
                });
            return promise;
        });
    });

    describe('#resolveSite', function() {
        it('should require a valid Site', function() {
            const urls = { system: { url: { site: '${urlBase}/${site.name.toLowerCase()}' } } };
            const testee = createTestee(urls);
            expect(function() {
                testee.resolveSite({});
            }).to.throw(TypeError);
        });

        it('should resolve to the configured path', function() {
            const urls = {
                system: { url: { site: '${urlBase}/test/${site.name.toLowerCase()}' } }
            };
            const testee = createTestee(urls);
            const promise = testee.resolveSite(global.fixtures.siteBase).then(function(url) {
                expect(url).to.be.equal('/test/base');
            });
            return promise;
        });
    });

    describe('#matchSite', function() {
        it('should resolve to false when no site matched', function() {
            const routes = {
                system: { route: { site: '${routeBase}/:site' } }
            };
            const testee = createTestee(routes);
            const promise = testee.matchSite('/foo').then(function(match) {
                expect(match.site).to.be.not.ok;
            });
            return promise;
        });

        it('should resolve to the site when matched', function() {
            const routes = {
                system: { route: { site: '${routeBase}/:site' } }
            };
            const testee = createTestee(routes);
            const promise = testee.matchSite('/base').then(function(match) {
                expect(match.site).to.be.equal(global.fixtures.siteBase);
            });
            return promise;
        });

        it('should only match complete pathes', function() {
            const routes = {
                system: { route: { site: '${routeBase}/:site' } }
            };
            const testee = createTestee(routes);
            const promise = testee.matchSite('/base/elements').then(function(match) {
                expect(match.site).to.be.not.ok;
                expect(match.entityCategory).to.be.not.ok;
            });
            return promise;
        });

        it('should allow to match direct site pathes with partial=true', function() {
            const routes = {
                system: { route: { site: '${routeBase}/:site' } }
            };
            const testee = createTestee(routes);
            const promise = testee.matchSite('/base', true).then(function(match) {
                expect(match.site).to.be.equal(global.fixtures.siteBase);
            });
            return promise;
        });

        it('should allow to match partial pathes with partial=true', function() {
            const routes = {
                system: { route: { site: '${routeBase}/:site' } }
            };
            const testee = createTestee(routes);
            const promise = testee
                .matchSite('/base/elements/m001-gallery', true)
                .then(function(match) {
                    expect(match.site).to.be.equal(global.fixtures.siteBase);
                    expect(match.customPath).to.be.equal('/elements/m001-gallery');
                });
            return promise;
        });
    });

    describe('#resolveEntityCategory', function() {
        it('should require a valid Site and EntityCategory', function() {
            const urls = {
                system: {
                    url: { entityCategory: '${urlSite}/${entityCategory.longName.urlify()}' }
                }
            };
            const testee = createTestee(urls);
            expect(function() {
                testee.resolveEntityCategory({});
            }).to.throw(TypeError);
            expect(function() {
                testee.resolveEntityCategory(global.fixtures.siteBase, {});
            }).to.throw(TypeError);
        });

        it('should resolve to the configured path', function() {
            const urls = {
                system: {
                    url: { entityCategory: '${urlSite}/${entityCategory.pluralName.urlify()}' }
                }
            };
            const testee = createTestee(urls);
            const promise = testee
                .resolveEntityCategory(global.fixtures.siteBase, global.fixtures.categoryElement)
                .then(function(url) {
                    expect(url).to.be.equal('/base/elements');
                });
            return promise;
        });
    });

    describe('#matchEntityCategory', function() {
        it('should resolve to false when no category matched', function() {
            const routes = {
                system: { route: { entityCategory: '${routeSite}/:entityCategory' } }
            };
            const testee = createTestee(routes);
            const promise = testee.matchEntityCategory('/foo/bar').then(function(match) {
                expect(match.entityCategory).to.be.not.ok;
            });
            return promise;
        });

        it('should resolve to the category when matched', function() {
            const routes = {
                system: { route: { entityCategory: '${routeSite}/:entityCategory' } }
            };
            const testee = createTestee(routes);
            const promise = testee.matchEntityCategory('/base/module-groups').then(function(match) {
                expect(match.site).to.be.equal(global.fixtures.siteBase);
                expect(match.entityCategory).to.be.equal(global.fixtures.categoryModuleGroup);
            });
            return promise;
        });

        it('should only match complete pathes', function() {
            const routes = {
                system: { route: { entityCategory: '${routeSite}/:entityCategory' } }
            };
            const testee = createTestee(routes);
            const promise = testee.matchEntityCategory('/base/elements/e001').then(function(match) {
                expect(match.site).to.be.not.ok;
                expect(match.entityCategory).to.be.not.ok;
            });
            return promise;
        });

        it('should allow to match partial pathes with partial=true', function() {
            const routes = {
                system: { route: { entityCategory: '${routeSite}/:entityCategory' } }
            };
            const testee = createTestee(routes);
            const promise = testee
                .matchEntityCategory('/base/elements/e001', true)
                .then(function(match) {
                    expect(match.site).to.be.equal(global.fixtures.siteBase);
                    expect(match.entityCategory).to.be.equal(global.fixtures.categoryElement);
                    expect(match.customPath).to.be.equal('/e001');
                });
            return promise;
        });

        it('should match a direct category path with partial=true', function() {
            const routes = {
                system: { route: { entityCategory: '${routeSite}/:entityCategory' } }
            };
            const testee = createTestee(routes);
            const promise = testee
                .matchEntityCategory('/base/module-groups', true)
                .then(function(match) {
                    expect(match.site).to.be.equal(global.fixtures.siteBase);
                    expect(match.entityCategory).to.be.equal(global.fixtures.categoryModuleGroup);
                });
            return promise;
        });
    });

    xdescribe('#resolveEntityId', function() {
        it('should require a valid EntityId', function() {
            const urls = { entityIdTemplate: '${root}/${site.name.toLowerCase()}' };
            const testee = createTestee(urls);
            expect(function() {
                testee.resolveEntityId({});
            }).to.throw(TypeError);
        });

        it('should resolve to the configured path', function() {
            const urls = {
                entityIdTemplate:
                    '${root}/${site.name.toLowerCase()}/${entityCategory.longName}/${entityId.name}'
            };
            const testee = createTestee(urls);
            const promise = testee
                .resolveEntityId(global.fixtures.entityTeaser.id)
                .then(function(url) {
                    expect(url).to.be.equal('/base/Module/teaser');
                });
            return promise;
        });

        it('should resolve a global entity id to the configured category path', function() {
            const urls = {
                entityCategoryTemplate:
                    '${root}/${site.name.toLowerCase()}/${entityCategory.longName.toLowerCase()}'
            };
            const testee = createTestee(urls);
            const promise = testee
                .resolveEntityId(global.fixtures.entityGlobal.id)
                .then(function(url) {
                    expect(url).to.be.equal('/base/global');
                });
            return promise;
        });
    });

    xdescribe('#matchEntityId', function() {
        it('should resolve to false when no entity matched', function() {
            const patterns = { entityIdPattern: '${root}/:site/:entityCategory/:entityId' };
            const testee = createTestee(patterns);
            const promise = testee.matchEntityId('/foo/bar/baz').then(function(match) {
                expect(match.entityId).to.be.not.ok;
            });
            return promise;
        });

        it('should resolve to the entity when matched', function() {
            const patterns = { entityIdPattern: '${root}/:site/:entityCategory/:entityId' };
            const testee = createTestee(patterns);
            const promise = testee.matchEntityId('/base/modules/m-teaser').then(function(match) {
                expect(match.site).to.be.equal(global.fixtures.siteBase);
                expect(match.entityCategory).to.be.instanceof(EntityCategory);
                expect(match.entityCategory).to.be.equal(global.fixtures.categoryModule);
                expect(match.entityId).to.be.instanceof(EntityId);
                expect(match.entityId.name).to.be.equal(global.fixtures.entityTeaser.id.name);
                expect(match.entityId.site).to.be.equal(global.fixtures.entityTeaser.id.site);
                expect(match.entityId.category).to.be.equal(
                    global.fixtures.entityTeaser.id.category
                );
            });
            return promise;
        });

        it('should only match complete pathes', function() {
            const patterns = { entityIdPattern: '${root}/:site/:entityCategory/:entityId' };
            const testee = createTestee(patterns);
            const promise = testee
                .matchEntityId('/base/modules/m001-gallery/readme.md')
                .then(function(match) {
                    expect(match.site).to.be.not.ok;
                    expect(match.entityCategory).to.be.not.ok;
                    expect(match.entityId).to.be.not.ok;
                });
            return promise;
        });

        it('should allow to match partial pathes with partial=true', function() {
            const patterns = { entityIdPattern: '${root}/:site/:entityCategory/:entityId' };
            const testee = createTestee(patterns);
            const promise = testee
                .matchEntityId('/base/modules/m-teaser/readme.md', true)
                .then(function(match) {
                    expect(match.site).to.be.equal(global.fixtures.siteBase);
                    expect(match.entityCategory).to.be.equal(global.fixtures.categoryModule);
                    expect(match.entityId).to.be.instanceof(EntityId);
                    expect(match.customPath).to.be.equal('/readme.md');
                });
            return promise;
        });
    });

    xdescribe('#resolveEntity', function() {
        it('should require a valid Entity', function() {
            const urls = { entityIdTemplate: '${root}/${site.name.toLowerCase()}' };
            const testee = createTestee(urls);
            expect(function() {
                testee.resolveEntity({});
            }).to.throw(TypeError);
        });

        it('should resolve to the configured path', function() {
            const urls = {
                entityIdTemplate:
                    '${root}/${site.name.toLowerCase()}/${entityCategory.longName}/${entityId.name}'
            };
            const testee = createTestee(urls);
            const promise = testee.resolveEntity(global.fixtures.entityTeaser).then(function(url) {
                expect(url).to.be.equal('/base/Module/teaser');
            });
            return promise;
        });

        it('should resolve a global entity id to the configured category path', function() {
            const urls = {
                entityCategoryTemplate:
                    '${root}/${site.name.toLowerCase()}/${entityCategory.longName.toLowerCase()}'
            };
            const testee = createTestee(urls);
            const promise = testee.resolveEntity(global.fixtures.entityGlobal).then(function(url) {
                expect(url).to.be.equal('/base/global');
            });
            return promise;
        });
    });

    xdescribe('#matchEntity', function() {
        it('should resolve to false when no entity matched', function() {
            const patterns = { entityIdPattern: '${root}/:site/:entityCategory/:entityId' };
            const testee = createTestee(patterns);
            const promise = testee.matchEntity('/foo/bar/baz').then(function(match) {
                expect(match.entityId).to.be.not.ok;
            });
            return promise;
        });

        it('should resolve to the entity when matched', function() {
            const patterns = { entityIdPattern: '${root}/:site/:entityCategory/:entityId' };
            const testee = createTestee(patterns);
            const promise = testee.matchEntity('/base/modules/m-teaser').then(function(match) {
                expect(match.site).to.be.equal(global.fixtures.siteBase);
                expect(match.entityCategory).to.be.instanceof(EntityCategory);
                expect(match.entityCategory).to.be.equal(global.fixtures.categoryModule);
                expect(match.entityId).to.be.instanceof(EntityId);
                expect(match.entityId.name).to.be.equal(global.fixtures.entityTeaser.id.name);
                expect(match.entityId.site).to.be.equal(global.fixtures.entityTeaser.id.site);
                expect(match.entityId.category).to.be.equal(
                    global.fixtures.entityTeaser.id.category
                );
            });
            return promise;
        });

        it('should only match complete pathes', function() {
            const patterns = { entityIdPattern: '${root}/:site/:entityCategory/:entityId' };
            const testee = createTestee(patterns);
            const promise = testee
                .matchEntity('/base/modules/m001-gallery/readme.md')
                .then(function(match) {
                    expect(match.site).to.be.not.ok;
                    expect(match.entityCategory).to.be.not.ok;
                    expect(match.entityId).to.be.not.ok;
                });
            return promise;
        });

        it('should allow to match partial pathes with partial=true', function() {
            const patterns = { entityIdPattern: '${root}/:site/:entityCategory/:entityId' };
            const testee = createTestee(patterns);
            const promise = testee
                .matchEntity('/base/modules/m-teaser/readme.md', true)
                .then(function(match) {
                    expect(match.site).to.be.equal(global.fixtures.siteBase);
                    expect(match.entityCategory).to.be.equal(global.fixtures.categoryModule);
                    expect(match.entityId).to.be.instanceof(EntityId);
                    expect(match.customPath).to.be.equal('/readme.md');
                });
            return promise;
        });
    });

    xdescribe('#matchEntityFile', function() {
        it('should resolve to false when no entity matched', function() {
            const patterns = { entityIdPattern: '${root}/:site/:entityCategory/:entityId' };
            const testee = createTestee(patterns);
            const promise = testee.matchEntityFile('/foo/bar/baz').then(function(match) {
                expect(match.entityId).to.be.not.ok;
            });
            return promise;
        });

        it('should resolve to a entity when matched', function() {
            const patterns = { entityIdPattern: '${root}/:site/:entityCategory/:entityId' };
            const testee = createTestee(patterns);
            const promise = testee
                .matchEntityFile('/default/modules/m-teaser')
                .then(function(match) {
                    expect(match.entity).to.be.ok;
                });
            return promise;
        });

        it('should resolve to a file when matched', function() {
            const file = new File({
                filename:
                    global.fixtures.pathesConfiguration.root +
                    '/base/modules/m-teaser/examples/overview.j2'
            });
            file.site = global.fixtures.siteBase;
            global.fixtures.entityTeaser.files.push(file);

            const patterns = { entityIdPattern: '${root}/:site/:entityCategory/:entityId' };
            const testee = createTestee(patterns);
            const promise = testee
                .matchEntityFile('/base/modules/m-teaser/examples/overview.j2')
                .then(function(match) {
                    expect(match.file).to.be.ok;
                    expect(match.file).to.be.equal(file);
                });
            return promise;
        });

        it('should resolve to a file when matched on a extended aspect', function() {
            const file = new File({
                filename:
                    global.fixtures.pathesConfiguration.root +
                    '/base/modules/m-teaser/examples/overview.j2'
            });
            file.site = global.fixtures.siteBase;
            global.fixtures.entityTeaser.files.push(file);

            const patterns = { entityIdPattern: '${root}/:site/:entityCategory/:entityId' };
            const testee = createTestee(patterns);
            const promise = testee
                .matchEntityFile('/extended/modules/m-teaser/examples/overview.j2')
                .then(function(match) {
                    expect(match.file).to.be.ok;
                    expect(match.file).to.be.equal(file);
                });
            return promise;
        });
    });
});
