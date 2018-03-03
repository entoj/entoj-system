'use strict';

/**
 * Requirements
 */
const LinterResultArray = require(ES_SOURCE + '/model/linter/LinterResultArray.js').LinterResultArray;
const ContentType = require(ES_SOURCE + '/model/ContentType.js').ContentType;
const ContentKind = require(ES_SOURCE + '/model/ContentKind.js').ContentKind;
const searchableArraySpec = require(ES_TEST + '/base/SearchableArrayShared.js').spec;


/**
 * Spec
 */
describe(LinterResultArray.className, function()
{
    /**
     * SerchableArray Test
     */
    searchableArraySpec(LinterResultArray, 'model.linter/LinterResultArray');


    /**
     * LinterResultArray Test
     */
    describe('#import', function()
    {
        it('should import a single object', function()
        {
            const testee = new LinterResultArray();
            const input =
            {
                linter: 'LinterName',
                success: false,
                contentType: ContentType.ANY,
                contentKind: ContentKind.UNKNOWN,
                warningCount: 1,
                errorCount: 2,
                messages: [ { message: 'Errors' } ]
            };
            testee.import(input);
            expect(testee).to.have.length(1);
            expect(testee[0].linter).to.be.equal(input.linter);
            expect(testee[0].success).to.be.equal(input.success);
            expect(testee[0].contentType).to.be.equal(input.contentType);
            expect(testee[0].contentKind).to.be.equal(input.contentKind);
            expect(testee[0].warningCount).to.be.equal(input.warningCount);
            expect(testee[0].errorCount).to.be.equal(input.errorCount);
            expect(testee[0].messages).to.have.length(1);
        });

        it('should import a array of objects', function()
        {
            const testee = new LinterResultArray();
            const input =
            [
                {
                    linter: 'LinterName1',
                    success: true
                },
                {
                    linter: 'LinterName2',
                    success: false
                }
            ];
            testee.import(input);
            expect(testee).to.have.length(2);
            expect(testee[0].linter).to.be.equal(input[0].linter);
            expect(testee[1].linter).to.be.equal(input[1].linter);
        });

        it('should update existing objects based on zthe linter name', function()
        {
            const testee = new LinterResultArray();
            const input1 =
            {
                linter: 'LinterName',
                success: false,
                contentType: ContentType.ANY,
                contentKind: ContentKind.UNKNOWN,
                warningCount: 1,
                errorCount: 2,
                messages: [ { message: 'Errors' } ]
            };
            const input2 =
            {
                linter: 'LinterName',
                success: true,
                contentType: ContentType.ANY,
                contentKind: ContentKind.UNKNOWN,
                warningCount: 0,
                errorCount: 0,
                messages: []
            };
            testee.import(input1);
            testee.import(input2);
            expect(testee).to.have.length(1);
            expect(testee[0].linter).to.be.equal(input2.linter);
            expect(testee[0].success).to.be.equal(input2.success);
            expect(testee[0].contentType).to.be.equal(input2.contentType);
            expect(testee[0].contentKind).to.be.equal(input2.contentKind);
            expect(testee[0].warningCount).to.be.equal(input2.warningCount);
            expect(testee[0].errorCount).to.be.equal(input2.errorCount);
            expect(testee[0].messages).to.have.length(0);
        });
    });
});
