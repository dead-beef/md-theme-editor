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

		self.exportTheme = function(fmt, exportUnusedPalettes) {
			var theme = themeService.theme;
			var palettes;
			var service = self.format[fmt];

			if(exportUnusedPalettes) {
				palettes = paletteService.custom;
			}
			else {
				palettes = {};
				THEME_PALETTES.forEach(function(name) {
					name = theme[name];
					var palette = paletteService.custom[name];
					if(palette) {
						palettes[name] = palette;
					}
				});
			}

			return service.exportTheme(theme, palettes);
		};
	}
]);
