app.service('settingsService', [
	'$localStorage', 'themeService', 'paletteService',
	function(
		$localStorage,
		themeService, paletteService
	) {
		this.storage = $localStorage.$default({
			instantColorUpdate: true,
			exportUnusedPalettes: true,
			defaultColorPicker: true,
			theme: themeService.theme,
			palettes: paletteService.custom
		});

		for(var palette in this.storage.palettes) {
			paletteService.add(palette, this.storage.palettes[palette]);
		}
		angular.extend(themeService.theme, this.storage.theme);

		this.storage.theme = themeService.theme;
		this.storage.palettes = paletteService.custom;
	}
]);
