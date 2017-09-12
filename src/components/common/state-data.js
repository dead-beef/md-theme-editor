'use strict';

angular
	.module(APP_NAME + '.stateData', ['ui.router'])
	.run(['$transitions', '$rootScope', function($transitions, $rootScope) {
		$transitions.onSuccess({}, function(transition) {
			var toState = transition.to();
			$rootScope.stateData = toState.data;
			$rootScope.stateName = toState.name;
		});
	}]);
