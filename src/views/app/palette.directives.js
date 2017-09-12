app.directive('paletteSelect', function() {
	return {
		restrict: 'E',
		replace: true,
		//require: 'ngModel',
		scope: {
			name: '=',
			ngModel: '=',
			options: '='
		},
		templateUrl: 'views/app/palette-select.html'
	};
});

app.directive('inputColor', [ 'paletteService', function(paletteService) {
	return {
		restrict: 'E',
		replace: false,
		transclude: true,
		require: 'ngModel',
		scope: {
			ngModel: '=',
			instantUpdate: '='
		},
		templateUrl: 'views/app/input-color.html',
		link: function(scope, el, attr, ngModel) {
			var input = el.find('input');

			var updateModel = function() {
				scope.ngModel = scope.color;
				ngModel.$setViewValue(scope.color);
			};

			input.on('change', function() {
				scope.$apply(updateModel);
			});

			ngModel.$render = function() {
				scope.color = tinycolor(ngModel.$viewValue).toHexString();
				input.val(scope.color);
			};

			scope.input = function() {
				input.click();
			};

			scope.$watch('color', function(color) {
				scope.contrast = paletteService.contrast(tinycolor(color)).css;
				if(scope.instantUpdate) {
					updateModel();
				}
			});
		}
	};
}]);

app.directive('paletteEditor', [
	function() {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			//require: 'ngModel',
			scope: {
				name: '=',
				instantUpdate: '='
			},
			controller: 'PaletteEditorController',
			controllerAs: 'ctrl',
			templateUrl: 'views/app/palette-editor.html'
		};
	}
]);

app.controller('PaletteEditorController', [
	'$scope', '$mdDialog', 'themeService', 'paletteService', 'COLOR_VALUES',
	function($scope, $mdDialog, themeService, paletteService, COLOR_VALUES) {
		var self = this;
		this.COLOR_VALUES = COLOR_VALUES;

		this.update = function(value) {
			var color = this.palette[value].hex;
			paletteService.setColor($scope.name, value, color);
		};

		this.reset = function() {
			paletteService.setColor(
				$scope.name,
				'base',
				this.palette.base
			);
		};

		this.remove = function() {
			paletteService.remove($scope.name);
		};

		this.rename = function() {
			$mdDialog
				.show(
					$mdDialog
						.renamePalette({locals: { name: $scope.name }})
						.theme(themeService.name)
				)
				.then(
					function(result) {
						paletteService.rename($scope.name, result);
						$scope.name = result;
					},
					function() {}
				);
		};

		$scope.$watch('name', function(name) {
			self.palette = paletteService.custom[name];
		});
	}
]);
