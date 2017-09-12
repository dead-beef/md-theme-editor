app.service('themeExportService', [
	'themeService', 'paletteService', 'THEME_PALETTES', 'COLOR_VALUES',
	function(themeService, paletteService, THEME_PALETTES, COLOR_VALUES) {
		var self = this;

		self.materialize = function(/*theme, palettes*/) {
			return 'test';
		};

		self._ng1Palette = function(name, palette) {
			var lines = [
				'\t$mdThemingProvider.definePalette("'.concat(name, '", {')
			];
			COLOR_VALUES.forEach(function(value, i) {
				lines.push('\t\t"'.concat(
					value, '": ', JSON.stringify(palette[value]),
					i + 1 < COLOR_VALUES.length ? ',' : ''
				));
			});
			lines.push('\t});');
			lines.push('');
			return lines.join('\n');
		};

		self.ng1 = function(theme, palettes) {
			theme = theme || themeService.theme;
			palettes = palettes || paletteService.custom;

			var used = {};
			var lines = [
				'app.config(["$mdThemingProvider",'
				+ ' function($mdThemingProvider) {'
			];

			THEME_PALETTES.forEach(function(name) {
				var palette = theme[name];
				if(palettes[palette] && !used[palette]) {
					used[palette] = true;
					lines.push(self._ng1Palette(palette, palettes[palette]));
				}
			});

			lines.push('\t$mdThemingProvider.theme("default")');

			THEME_PALETTES.forEach(function(name) {
				var palette = theme[name];
				lines.push('\t\t.'.concat(name, 'Palette("', palette, '")'));
			});

			if(theme.dark) {
				lines.push('\t\t.dark();');
			}
			else {
				lines[lines.length - 1] += ';';
			}

			lines.push('}]);');
			lines.push('');

			return lines.join('\n');
		};
	}
]);
