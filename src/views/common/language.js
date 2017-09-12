'use strict';

translate.directive('languageSelect', function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'views/common/language-select.html',
		controller: 'LanguageController',
		controllerAs: 'language'
	};
});

translate.directive('languageMenu', function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'views/common/language-menu.html',
		controller: 'LanguageController',
		controllerAs: 'language'
	};
});

translate.controller(
	'LanguageController',
	[
		'$translate', '$scope', 'languages',
		function($translate, $scope, languages) {
			$scope.vm = {
				languages: languages,
				language: null
			};
			$scope.$watch(
				function() { return $translate.use(); },
				function(lang) { $scope.vm.language = lang; }
			);
			$scope.$watch(
				'vm.language',
				function(lang) { $translate.use(lang); }
			);
		}
	]
);
