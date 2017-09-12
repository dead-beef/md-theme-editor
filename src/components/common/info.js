'use strict';

angular.module(APP_NAME + '.info', [])
	.constant('version', '1.0')
	.constant('languages', ['en', 'ru'])
	.constant('defaultLanguage', 'en')
	.directive('appVersion', ['version', function(version) {
		return function(scope, el) {
			el.text(version);
		};
	}])
	.directive('currentYear', function() {
		return {
			link: function(scope, el) {
				el.html('&copy; ' + new Date().getFullYear());
			}
		};
	});
