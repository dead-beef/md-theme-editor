'use strict';

describe('info module', function() {
	beforeEach(module(APP_NAME + '.info'));

	describe('version constant', function() {
		var ver;

		beforeEach(inject(function(version) {
			ver = version;
		}));

		it('should be defined', function() {
			expect(ver).toBeDefined();
		});

		it('should be a version', function() {
			expect(typeof ver).toEqual('string');
			expect(ver).toMatch(/^[0-9]+\.[0-9]+(\.[0-9]+)?(-.+)?$/);
		});
	});

	describe('languages constant', function() {
		var lang;

		beforeEach(inject(function(languages) {
			lang = languages;
		}));

		it('should be defined', function() {
			expect(lang).toBeDefined();
		});

		it('should be an array of languages', function() {
			expect(Array.isArray(lang)).toBeTruthy();
			for(var i = 0; i < lang.length; ++i) {
				expect(typeof lang[i]).toEqual('string');
				expect(lang[i].length).toEqual(2);
			}
		});

		it('should not be empty', function() {
			expect(lang.length).toBeGreaterThan(0);
		});
	});

	describe('defaultLanguage constant', function() {
		var lang, def;

		beforeEach(inject(function(languages, defaultLanguage) {
			lang = languages;
			def = defaultLanguage;
		}));

		it('should be defined', function() {
			expect(def).toBeDefined();
		});

		it('should be in languages array', function() {
			expect(lang.indexOf(def)).toBeGreaterThan(-1);
		});
	});

	describe('app-version directive', function() {
		it(
			'should print current version',
			inject(function($compile, $rootScope, version) {
				var element = $compile('<span app-version></span>')($rootScope);
				expect(element.html()).toEqual(version);
			})
		);
	});

	describe('current-year directive', function() {

		var scope, el;

		beforeEach(inject(function($rootScope, $compile) {
			scope = $rootScope.$new();
			el = $compile('<span current-year></span>')(scope);
			scope.$digest();
		}));

		afterEach(function() {
			scope.$destroy();
		});

		it('element should be defined', function () {
			expect(el).toBeDefined();
		});

		it('should display current year', function () {
			expect(el.html()).toEqual('© ' + new Date().getFullYear());
		});

	});
});
