app.service('settingsService', [
	'$rootScope', '$localStorage', 'themeService', 'paletteService',
	function(
		$rootScope, $localStorage,
		themeService, paletteService
	) {
		var storage = this.storage = $localStorage.$default({
			instantColorUpdate: true,
			exportUnusedPalettes: true,
			defaultColorPicker: false,
			saveTheme: true,
			theme: themeService.theme,
			palettes: paletteService.custom
		});

		if(storage.saveTheme) {
			for(var palette in storage.palettes) {
				paletteService.add(palette, storage.palettes[palette]);
			}
			angular.extend(themeService.theme, storage.theme);
		}

		$rootScope.$watch(
			function() { return storage.saveTheme; },
			function(saveTheme) {
				if(saveTheme) {
					storage.theme = themeService.theme;
					storage.palettes = paletteService.custom;
				}
				else {
					delete storage.theme;
					delete storage.palettes;
				}
			}
		);
	}
]);
