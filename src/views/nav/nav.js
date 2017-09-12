'use strict';

app.directive('navBar', function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'views/nav/nav.html',
		controller: 'NavController',
		controllerAs: 'navbar'
	};
});

app.controller('NavController', [ function() {
}]);
