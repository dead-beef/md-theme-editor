'use strict';

app.controller('MainController', [
	'$mdDialog', 'themeService', 'paletteService', 'THEME_PALETTES',
	function($mdDialog, themeService, paletteService, THEME_PALETTES)
	{
		this.THEME_PALETTES = THEME_PALETTES;
		this.theme = themeService.theme;
		this.palettes = paletteService.palettes;
		this.customPalettes = paletteService.custom;

		this.addPalette = function() {
			paletteService.add();
		};
	}
]);
