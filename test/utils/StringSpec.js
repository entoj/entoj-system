'use strict';

/**
 * Requirements
 */
const trimMultiline = require(ES_SOURCE + '/utils/string.js').trimMultiline;
const shortenMiddle = require(ES_SOURCE + '/utils/string.js').shortenMiddle;
const shortenLeft = require(ES_SOURCE + '/utils/string.js').shortenLeft;
const activateEnvironment = require(ES_SOURCE + '/utils/string.js').activateEnvironment;
const trimSlashesLeft = require(ES_SOURCE + '/utils/string.js').trimSlashesLeft;
const trimQuotes = require(ES_SOURCE + '/utils/string.js').trimQuotes;
const htmlify = require(ES_SOURCE + '/utils/string.js').htmlify;
const lorem = require('lorem-ipsum');

/**
 * Spec
 */
describe('utils/string', function() {
    describe('#trimMultiline()', function() {
        it('should handle invalid strings', function() {
            expect(trimMultiline()).to.be.equal('');
            expect(trimMultiline(false)).to.be.equal('');
        });

        it('should trim multiple lines', function() {
            const input = `   # Headline
        ## Subheadline
> Pardon my french`;
            const expected = `# Headline
## Subheadline
> Pardon my french`;
            const testee = trimMultiline(input);
            expect(testee).to.be.equal(expected);
        });

        it('should allow to exclude defined sections from triming', function() {
            const input = `       # Safe?
    {##
        # Headline
        ## Subheadline
    #}
    > Pardon my french`;
            const expected = `# Safe?
{##
        # Headline
        ## Subheadline
#}
> Pardon my french`;
            const testee = trimMultiline(input, [{ start: '{##', end: '#}' }]);
            expect(testee).to.be.equal(expected);
        });
    });

    describe('#shortenMiddle()', function() {
        it('should handle invalid strings', function() {
            expect(shortenMiddle()).to.be.equal('');
            expect(shortenMiddle(false)).to.be.equal('');
        });

        it('should leave string as is when < length', function() {
            const input = 'Lorem Ipsum Dolorem';
            const expected = 'Lorem Ipsum Dolorem';
            const testee = shortenMiddle(input);
            expect(testee).to.be.equal(expected);
        });

        it('should remove chars from the middle', function() {
            const input = '1234567890';
            const expected = '123…90';
            const testee = shortenMiddle(input, 6);
            expect(testee).to.be.equal(expected);
        });

        it('should drop last char when length = 2', function() {
            const input = '1234567890';
            const expected = '1…';
            const testee = shortenMiddle(input, 2);
            expect(testee).to.be.equal(expected);
        });

        it('should return first char when length = 1', function() {
            const input = '1234567890';
            const expected = '1';
            const testee = shortenMiddle(input, 1);
            expect(testee).to.be.equal(expected);
        });
    });

    describe('#shortenLeft()', function() {
        it('should handle invalid strings', function() {
            expect(shortenLeft()).to.be.equal('');
            expect(shortenLeft(false)).to.be.equal('');
        });

        it('should leave string as is when < length', function() {
            const input = 'Lorem Ipsum Dolorem';
            const expected = 'Lorem Ipsum Dolorem';
            const testee = shortenLeft(input);
            expect(testee).to.be.equal(expected);
        });

        it('should remove chars from the start', function() {
            const input = '1234567890';
            const expected = '…67890';
            const testee = shortenLeft(input, 6);
            expect(testee).to.be.equal(expected);
        });

        it('should drop last char when length = 2', function() {
            const input = '1234567890';
            const expected = '…0';
            const testee = shortenLeft(input, 2);
            expect(testee).to.be.equal(expected);
        });

        it('should return first char when length = 1', function() {
            const input = '1234567890';
            const expected = '0';
            const testee = shortenLeft(input, 1);
            expect(testee).to.be.equal(expected);
        });
    });

    describe('#activateEnvironment()', function() {
        describe('c-style comments', function() {
            it('should remove all environments when no environment is given', function() {
                const input =
                    'All/* +environment: development */-Development/* -environment *//* +environment: production */-Production/* -environment */';
                const expected = 'All';
                expect(activateEnvironment(input)).to.be.equal(expected);
            });

            it('should remove all environments except the given one', function() {
                const input =
                    'All/* +environment: development */-Development/* -environment *//* +environment: production */-Production/* -environment */';
                const expected = 'All-Production';
                expect(activateEnvironment(input, 'production')).to.be.equal(expected);
            });

            it('should allow to negate environments', function() {
                const input =
                    'All/* +environment: !development */-NotDevelopment/* -environment *//* +environment: production */-Production/* -environment */';
                const expected = 'All-NotDevelopment-Production';
                expect(activateEnvironment(input, 'production')).to.be.equal(expected);
            });
        });

        describe('jinja-style comments', function() {
            it('should remove all environments when no environment is given', function() {
                const input =
                    'All{# +environment: development #}-Development{# -environment #}{# +environment: production #}-Production{# -environment #}';
                const expected = 'All';
                expect(activateEnvironment(input)).to.be.equal(expected);
            });

            it('should remove all environments except the given one', function() {
                const input =
                    'All{# +environment: development #}-Development{# -environment #}{# +environment: production #}-Production{# -environment #}';
                const expected = 'All-Production';
                expect(activateEnvironment(input, 'production')).to.be.equal(expected);
            });

            it('should allow to negate environments', function() {
                const input =
                    'All{# +environment: !development #}-NotDevelopment{# -environment #}{# +environment: production #}-Production{# -environment #}';
                const expected = 'All-NotDevelopment-Production';
                expect(activateEnvironment(input, 'production')).to.be.equal(expected);
            });
        });

        describe('html-style comments', function() {
            it('should remove all environments when no environment is given', function() {
                const input =
                    'Start<!-- +environment: development -->-Development<!-- -environment -->End';
                const expected = 'StartEnd';
                expect(activateEnvironment(input)).to.be.equal(expected);
            });

            it('should remove all environments except the given one', function() {
                const input =
                    'Start<!-- +environment: development -->-Development-<!-- -environment --><!-- +environment: production -->-Production-<!-- -environment -->End';
                const expected = 'Start-Production-End';
                expect(activateEnvironment(input, 'production')).to.be.equal(expected);
            });

            it('should allow to negate environments', function() {
                const input =
                    'Start<!-- +environment: !development -->-NotDevelopment-<!-- -environment --><!-- +environment: production -->-Production-<!-- -environment -->End';
                const expected = 'Start-NotDevelopment--Production-End';
                expect(activateEnvironment(input, 'production')).to.be.equal(expected);
            });

            it('should allow to use mutliple environments', function() {
                const input =
                    'Start<!-- +environment: production, staging -->-Production or Staging-<!-- -environment -->End';
                const expected = 'Start-Production or Staging-End';
                expect(activateEnvironment(input, 'production')).to.be.equal(expected);
                expect(activateEnvironment(input, 'staging')).to.be.equal(expected);
            });

            it('should allow to use nested environments', function() {
                const input =
                    'Start<!-- +environment: production, staging -->-Production-<!-- +environment: staging -->-Staging-<!-- -environment --><!-- -environment -->End';
                const expected = 'Start-Production--Staging-End';
                expect(activateEnvironment(input, 'staging')).to.be.equal(expected);
            });
        });
    });

    describe('#trimSlashesLeft()', function() {
        it('should remove any slashes on the left side', function() {
            expect(trimSlashesLeft('/hi//')).to.be.equal('hi//');
            expect(trimSlashesLeft('//hi')).to.be.equal('hi');
            expect(trimSlashesLeft('/hi/there/')).to.be.equal('hi/there/');
            expect(trimSlashesLeft('\\/hi//')).to.be.equal('hi//');
            expect(trimSlashesLeft('hi//')).to.be.equal('hi//');
        });
    });

    describe('#trimQuotes()', function() {
        it('should remove any quotes from both sides side', function() {
            expect(trimQuotes('hi')).to.be.equal('hi');
            expect(trimQuotes('"hi')).to.be.equal('hi');
            expect(trimQuotes('hi"')).to.be.equal('hi');
            expect(trimQuotes('\'hi')).to.be.equal('hi');
            expect(trimQuotes('hi\'')).to.be.equal('hi');
            expect(trimQuotes('"\'hi"\'')).to.be.equal('hi');
        });
    });

    describe('#htmlify()', function() {
        it('should return a empty string when no or empty string given', function() {
            expect(htmlify()).to.be.equal('');
            expect(htmlify(null)).to.be.equal('');
            expect(htmlify(false)).to.be.equal('');
            expect(htmlify(1)).to.be.equal('');
            expect(htmlify('')).to.be.equal('');
        });

        it('should make paragraphs out of newlines', function() {
            expect(htmlify('one\ntwo\n\nthree')).to.be.equal(
                '<p>one</p>\n<p>two</p>\n<p>three</p>\n'
            );
        });

        it('should contain markup', function() {
            for (let i = 0; i < 100; i++) {
                const lipsum = lorem({
                    units: 'paragraphs',
                    count: 1
                });
                expect(htmlify(lipsum)).to.match(/<[^p][^>]*>.*<\/[^p][^>]*>/);
            }
        });

        it('should allow to customize tag generation', function() {
            const lipsum = 'Dolorem lipsum sum at ebit nor debitel omnese';
            const options = {
                wordsPerTag: 2,
                maxTagOffset: 0,
                minWordsBetweenTags: 1,
                minWordsInTag: 1,
                maxWordsInTag: 1,
                tags: [
                    {
                        name: 'a',
                        probability: 1,
                        attributes: {
                            href: ''
                        }
                    }
                ]
            };
            expect(htmlify(lipsum, options)).to.be.equal(
                '<p><a href="">Dolorem</a> lipsum sum <a href="">at</a> ebit nor <a href="">debitel</a> omnese</p>\n'
            );
        });
    });
});
