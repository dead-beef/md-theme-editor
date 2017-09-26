app.service('ng1ExportService', [
	'THEME_PALETTES', 'COLOR_VALUES',
	function(THEME_PALETTES, COLOR_VALUES) {

		this.exportPalette = function(name, palette) {
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

		this.exportTheme = function(theme, palettes) {
			var lines = [
				'app.config(["$mdThemingProvider",'
				+ ' function($mdThemingProvider) {'
			];

			for(var name in palettes) {
				lines.push(this.exportPalette(name, palettes[name]));
			}

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
