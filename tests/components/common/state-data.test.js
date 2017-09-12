'use strict';

describe('stateData module', function() {

	var rootScope, state;
	var stateName = [ 'st0', 'st1' ];
	var stateData = [ 'state0', 'state1' ];

	beforeEach(function() {
		module(APP_NAME + '.stateData');
		module(function($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise('/0');
			$stateProvider
				.state(stateName[0], {
					url: '/0',
					data: stateData[0]
				})
				.state(stateName[1], {
					url: '/1',
					data: stateData[1]
				});
		});
		inject(function($rootScope, $state) {
			rootScope = $rootScope;
			state = $state;
			rootScope.$digest();
		});
	});

	it('should initialize', function() {
		expect(rootScope.stateName).toBe(stateName[0]);
		expect(rootScope.stateData).toBe(stateData[0]);
	});

	it('should update', function(done) {
		rootScope.$apply(function() {
			state.go(stateName[1])
				.then(function() {
					expect(rootScope.stateName).toBe(stateName[1]);
					expect(rootScope.stateData).toBe(stateData[1]);
					done();
				});
		});
	});

});
