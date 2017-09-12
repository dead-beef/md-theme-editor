'use strict';

describe('language controller', function() {
	var scope, languages, translate, language;

	beforeEach(function() {
		module(APP_NAME);
		inject(function(
			$rootScope, $controller, _languages_,
			defaultLanguage
		) {
			languages = _languages_;
			language = defaultLanguage;
			scope = $rootScope.$new();

			translate = {};
			translate.use = jasmine.createSpy().and.callFake(function(lang) {
				if(lang === undefined) {
					return language;
				}
				else {
					language = lang;
				}
			});

			$controller(
				'LanguageController',
				{
					$scope: scope,
					$translate: translate
				}
			);

			scope.$digest();
		});
	});

	afterEach(function() {
		scope.$destroy();
	});

	it('should initialize', function() {
		expect(scope.vm.language).toBeDefined();
		expect(scope.vm.language).toEqual(translate.use());
		expect(scope.vm.languages).toBeDefined();
		expect(scope.vm.languages).toBe(languages);
	});

	it('should watch vm.language', function() {
		scope.vm.language = 'ru';
		scope.$digest();
		expect(translate.use).toHaveBeenCalledWith('ru');
	});

	it('should watch $translate.use()', function() {
		translate.use('de');
		scope.$digest();
		expect(scope.vm.language).toEqual('de');
	});
});
