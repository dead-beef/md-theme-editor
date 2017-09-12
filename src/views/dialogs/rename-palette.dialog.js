app.controller('RenamePaletteDialogController', [
	'$mdDialog', 'paletteService',
	function($mdDialog, paletteService) {
		this.result = this.name;
		this.cancel = function() { $mdDialog.cancel(); };
		this.ok = function() { $mdDialog.hide(this.result); };
		this.valid = function() {
			return paletteService.validateName(this.result);
		};
	}
]);

app.config(['$mdDialogProvider', function($mdDialogProvider) {
	$mdDialogProvider.addPreset('renamePalette', {
		methods: ['theme'],
		options: function() {
			return {
				templateUrl: 'views/dialogs/rename-palette.html',
				controller: 'RenamePaletteDialogController',
				controllerAs: 'dialog',
				bindToController: true,
				clickOutsideToClose: true,
				escapeToClose: true
			};
		}
	});
}]);
