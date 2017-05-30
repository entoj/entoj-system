/**
 * Requirements
 */
const PackagePlugin = require(ES_SOURCE + '/model/loader/documentation/PackagePlugin.js').PackagePlugin;
const projectFixture = require(ES_FIXTURES + '/project/index.js');
const loaderPluginSpec = require('../LoaderPluginShared.js').spec;


/**
 * Spec
 */
describe(PackagePlugin.className, function()
{
    /**
     * LoaderPlugin Test
     */
    loaderPluginSpec(PackagePlugin, 'model.loader.documentation/PackagePlugin', function(params)
    {
        params.unshift(global.fixtures.pathesConfiguration);
        return params;
    });


    /**
     * PackagePlugin Test
     */
    beforeEach(function()
    {
        global.fixtures = projectFixture.createStatic();
    });


    describe('#execute()', function()
    {
        it('should do nothing if file was not found', function()
        {
            const testee = new PackagePlugin(global.fixtures.pathesConfiguration);
            const promise = testee.execute(global.fixtures.entityCta).then(function()
            {
                expect(global.fixtures.siteBase.properties.size).to.be.equal(0);
            });
            return promise;
        });

        it('should import all properties for a Site', function()
        {
            const testee = new PackagePlugin(global.fixtures.pathesConfiguration);
            const promise = testee.execute(global.fixtures.siteBase).then(function()
            {
                expect(global.fixtures.siteBase.properties.getByPath('state.concept')).to.be.equal('Done');
                expect(global.fixtures.siteBase.properties.getByPath('state.frontend')).to.be.equal('Progress');
                expect(global.fixtures.siteBase.properties.getByPath('state.integration')).to.be.equal('Progress');
            });
            return promise;
        });

        it('should import all properties for a extended Site', function()
        {
            const testee = new PackagePlugin(global.fixtures.pathesConfiguration);
            const promise = testee.execute(global.fixtures.siteExtended).then(function()
            {
                expect(global.fixtures.siteExtended.properties.getByPath('state.concept')).to.be.equal('None');
                expect(global.fixtures.siteExtended.properties.getByPath('state.frontend')).to.be.equal('None');
                expect(global.fixtures.siteExtended.properties.getByPath('state.integration')).to.be.equal('None');
            });
            return promise;
        });

        it('should import all properties for a Entity namespaced by its Site', function()
        {
            const testee = new PackagePlugin(global.fixtures.pathesConfiguration);
            const promise = testee.execute(global.fixtures.entityImage).then(function()
            {
                expect(global.fixtures.entityImage.properties.getByPath('base.state.concept')).to.be.equal('Done');
                expect(global.fixtures.entityImage.properties.getByPath('base.state.frontend')).to.be.equal('Done');
                expect(global.fixtures.entityImage.properties.getByPath('base.state.integration')).to.be.equal('Progress');
            });
            return promise;
        });

        it('should import all properties for a extended Entity', function()
        {
            const testee = new PackagePlugin(global.fixtures.pathesConfiguration);
            global.fixtures.entityImage.usedBy.push(global.fixtures.siteExtended);
            const promise = testee.execute(global.fixtures.entityImage, global.fixtures.siteExtended).then(function()
            {
                expect(global.fixtures.entityImage.properties.getByPath('extended.state.concept')).to.be.equal('Done');
                expect(global.fixtures.entityImage.properties.getByPath('extended.state.frontend')).to.be.equal('None');
                expect(global.fixtures.entityImage.properties.getByPath('extended.state.integration')).to.be.equal('None');
            });
            return promise;
        });
    });
});
