'use strict';

/**
 * Requirements
 */
const DocumentationArray = require(ES_SOURCE + '/model/documentation/DocumentationArray.js')
    .DocumentationArray;
const DocumentationCallable = require(ES_SOURCE + '/model/documentation/DocumentationCallable.js')
    .DocumentationCallable;
const ContentKind = require(ES_SOURCE + '/model/ContentKind.js').ContentKind;
const baseSpec = require(ES_TEST + '/BaseShared.js').spec;

/**
 * Spec
 */
describe(DocumentationArray.className, function() {
    /**
     * Base Test
     */
    baseSpec(DocumentationArray, 'model.documentation/DocumentationArray');

    /**
     * Linter Test
     */
    beforeEach(function() {
        global.fixtures = {};
        global.fixtures.documentationArray = new DocumentationArray();
        global.fixtures.documentationCallable = new DocumentationCallable();
        global.fixtures.documentationCallable.name = 'Callable';
        global.fixtures.documentationCallable.contentKind = ContentKind.MACRO;
        global.fixtures.documentationArray.push(global.fixtures.documentationCallable);
    });

    describe('#getByType', function() {
        it('should return all docs of given type', function() {
            const testee = global.fixtures.documentationArray;
            const docs = testee.getByType(DocumentationCallable);
            expect(docs).to.have.length(1);
            expect(docs.find((item) => item.name == 'Callable')).to.be.ok;
        });

        it('should return all docs of given type name', function() {
            const testee = global.fixtures.documentationArray;
            const docs = testee.getByType('DocumentationCallable');
            expect(docs).to.have.length(1);
            expect(docs.find((item) => item.name == 'Callable')).to.be.ok;
        });

        it('should return a empty array when no docs were found', function() {
            const testee = global.fixtures.documentationArray;
            const docs = testee.getByType('DocumentationText');
            expect(docs).to.have.length(0);
        });
    });

    describe('#getFirstByType', function() {
        it('should return the first doc of given type', function() {
            const testee = global.fixtures.documentationArray;
            const doc = testee.getFirstByType(DocumentationCallable);
            expect(doc).to.be.ok;
            expect(doc.name).to.be.equal('Callable');
        });

        it('should return undefined when no doc was found', function() {
            const testee = global.fixtures.documentationArray;
            const doc = testee.getFirstByType('DocumentationText');
            expect(doc).to.be.not.ok;
        });
    });

    describe('#getByContentKind', function() {
        it('should return all docs of given ContentKind', function() {
            const testee = global.fixtures.documentationArray;
            const docs = testee.getByContentKind(ContentKind.MACRO);
            expect(docs).to.have.length(1);
            expect(docs.find((item) => item.name == 'Callable')).to.be.ok;
        });

        it('should return all docs of given ContentKind name', function() {
            const testee = global.fixtures.documentationArray;
            const docs = testee.getByContentKind('MACRO');
            expect(docs).to.have.length(1);
            expect(docs.find((item) => item.name == 'Callable')).to.be.ok;
        });

        it('should return a empty array when no docs were found', function() {
            const testee = global.fixtures.documentationArray;
            const docs = testee.getByContentKind(ContentKind.CSS);
            expect(docs).to.have.length(0);
        });
    });

    describe('#getFirstByContentKind', function() {
        it('should return the first doc of given type', function() {
            const testee = global.fixtures.documentationArray;
            const doc = testee.getFirstByContentKind(ContentKind.MACRO);
            expect(doc).to.be.ok;
            expect(doc.name).to.be.equal('Callable');
        });

        it('should return undefined when no doc was found', function() {
            const testee = global.fixtures.documentationArray;
            const doc = testee.getFirstByContentKind(ContentKind.CSS);
            expect(doc).to.be.not.ok;
        });
    });
});
