app.service('themeExportService', [
	'$injector',
	'themeService', 'paletteService',
	'THEME_PALETTES', 'EXPORT_FORMATS',
	function(
		$injector,
		themeService, paletteService,
		THEME_PALETTES, EXPORT_FORMATS
	) {
		var self = this;
		self.format = {};

		EXPORT_FORMATS.forEach(function(fmt) {
			self.format[fmt] = $injector.get(fmt + 'ExportService');
		});

		self.exportTheme = function(fmt) {
			var theme = themeService.theme;
			var palettes = paletteService.custom;
			var service = self.format[fmt];
			return service.exportTheme(theme, palettes);
		};
	}
]);
