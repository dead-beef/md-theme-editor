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

app.directive('inputColor', [
	'debounce', 'paletteService',
	function(debounce, paletteService) {
		return {
			restrict: 'E',
			replace: false,
			transclude: true,
			require: 'ngModel',
			scope: {
				ngModel: '=',
				instantUpdate: '=',
				defaultColorPicker: '='
			},
			templateUrl: 'views/app/input-color.html',
			link: function(scope, el, attr, ngModel) {
				var input = el.find('input');

				var updateModel = function() {
					scope.ngModel = scope.color;
					ngModel.$setViewValue(scope.color);
				};

				var setColor = function(color) {
					scope.color = color;
					scope.$apply(updateModel);
				};

				var spectrum = false;

				var createSpectrum = function() {
					if(!spectrum) {
						spectrum = true;
						el.spectrum({
							color: tinycolor(scope.color),
							showInput: false,
							allowEmpty: false,
							showAlpha: false,
							clickoutFiresChange: false
						});
					}
				};

				var destroySpectrum = function() {
					if(spectrum) {
						spectrum = false;
						el.spectrum('destroy');
					}
				};

				ngModel.$render = function() {
					scope.color = tinycolor(ngModel.$viewValue).toHexString();
					input.val(scope.color);
				};

				scope.input = function() {
					if(!spectrum) {
						input.click();
					}
				};

				input.on('change', function() {
					scope.$apply(updateModel);
				});

				el
					.on('move.spectrum', debounce(50, function(ev, color) {
						scope.$apply(function() {
							scope.color = color.toHexString();
						});
					}))
					.on('change.spectrum', function(ev, color) {
						if(color !== undefined) {
							setColor(color.toHexString());
						}
					})
					.on('hide.spectrum', function(/*ev*/) {
						setColor(el.spectrum('get').toHexString());
					});

				scope.$watch('color', debounce(50, function(color) {
					color = tinycolor(color);
					scope.contrast = paletteService.contrast(color).css;
					if(spectrum) {
						el.spectrum('set', color);
					}
					if(scope.instantUpdate) {
						updateModel();
					}
				}));

				scope.$watch('defaultColorPicker', function(defaultColorPicker) {
					if(defaultColorPicker) {
						destroySpectrum();
					}
					else {
						createSpectrum();
					}
				});

				scope.$on('$destroy', destroySpectrum);
			}
		};
	}
]);

app.directive('paletteEditor', [
	function() {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			//require: 'ngModel',
			scope: {
				name: '=',
				instantUpdate: '=',
				defaultColorPicker: '='
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
