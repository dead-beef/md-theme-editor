app.directive('demo', [
	'$interval', '$timeout',
	function($interval, $timeout) {
		return {
			replace: true,
			template: '<iframe></iframe>',
			link: function(scope, iframe) {
				var isLoading = {
					ng1: function(body) {
						return body.hasAttribute('ng-cloak');
					},
					materialize: function(body) {
						return body.classList.contains('hide');
					},
					'default': function() { return false; }
				};

				$timeout(function() {
					var ctrl = scope.demo;
					var url = 'demo/'.concat(
						ctrl.format, '/index.html', ctrl.args
					);

					var loading = isLoading[ctrl.format];
					if(!loading) {
						loading = isLoading['default'];
					}

					iframe.attr('src', url);

					iframe.on('load', function() {
						scope.$apply(function() { ctrl.show = true; });

						var interval = $interval(function() {
							var body = iframe.contents()[0].body;
							if(!(ctrl.loading = loading(body))) {
								$interval.cancel(interval);
								interval = null;
							}
						}, 250);

						scope.$on('$destroy', function() {
							if(interval !== null) {
								$interval.cancel(interval);
							}
						});
					});
				});
			}
		};
	}
]);
