app.controller('ExportDataDialogController', [
	'$mdDialog', '$mdToast', '$translate',
	'themeService', 'themeExportService', 'EXPORT_FORMATS',
	function($mdDialog, $mdToast, $translate,
	         themeService, exportService, EXPORT_FORMATS) {
		var self = this;

		self.EXPORT_FORMATS = EXPORT_FORMATS;

		if(typeof self.selected === 'string') {
			self.selected = EXPORT_FORMATS.indexOf(self.selected);
		}
		self.selected = self.selected | 0;

		EXPORT_FORMATS.forEach(function(fmt) {
			self[fmt] = exportService[fmt]();
		});

		function toast(text) {
			$mdToast.show(
				$mdToast.simple()
					.hideDelay(1500)
					.textContent(text)
			);
		}

		self.close = function() { $mdDialog.hide(); };
		self.copySuccess = function() {
			toast($translate.instant('action.copy.success').concat(
				': ', EXPORT_FORMATS[self.selected]
			));
		};
		self.copyError = function(err) {
			toast($translate.instant('action.copy.error').concat(
				': ', EXPORT_FORMATS[self.selected], ': ', err.toString()
			));
		};
	}
]);

app.config(['$mdDialogProvider', function($mdDialogProvider) {
	$mdDialogProvider.addPreset('exportData', {
		methods: ['theme'],
		options: function() {
			return {
				templateUrl: 'views/dialogs/export-data.html',
				controller: 'ExportDataDialogController',
				controllerAs: 'dialog',
				bindToController: true,
				clickOutsideToClose: true,
				escapeToClose: true
			};
		}
	});
}]);
