app.controller('DemoController', [
	'$rootScope', '$scope', 'themeExportService',
	function($rootScope, $scope, exportService) {
		var self = this;

		var unwatch = $rootScope.$watch('stateName', function() {
			var format = $rootScope.stateName.substr(
				$rootScope.stateName.lastIndexOf('.') + 1
			);
			console.log('state change', $rootScope.stateName, format);
			self.format = format;
			self.args = '?theme=' + encodeURIComponent(exportService[format]());
			self.loading = true;
			self.show = false;
		});

		$scope.$on('$destroy', function() {
			console.log('destroy');
			unwatch();
		});
	}
]);
