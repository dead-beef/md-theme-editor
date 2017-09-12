'use strict';

describe('replace directive', function() {
	module.sharedInjector();
	beforeAll(module(APP_NAME));

	var tmpl = '<span>1</span><span ng-bind="testVar"></span>';
	var scope, el, container;

	beforeAll(inject(function($rootScope, $compile, $templateCache) {
		$templateCache.put('test.html', tmpl);

		el = angular.element('<replace src="test.html"></replace>');
		container = angular.element('<div/>').append(el);
		angular.element(document.body).append(container);

		scope = $rootScope.$new();
		$compile(el)(scope);
		scope.$digest();
	}));

	afterAll(function() {
		scope.$destroy();
		container.remove();
	});

	it('should include', function() {
		var span = container.find('span');
		expect(span).toExist();
		expect(span.length).toEqual(2);
		span = container.find('span[ng-bind="testVar"]');
		expect(span).toExist();
		expect(span.length).toEqual(1);
	});

	it('should replace', function() {
		expect(container.find('replace')).not.toExist();
		expect(container.children().length).toEqual(2);
	});

	it('should compile', function() {
		var el = container.children('span[ng-bind]');
		scope.testVar = null;
		scope.$digest();
		expect(el.html()).toEqual('');
		scope.testVar = 'test';
		scope.$digest();
		expect(el.html()).toEqual('test');
	});
});
