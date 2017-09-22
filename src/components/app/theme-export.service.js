app.service('themeExportService', [
	'themeService', 'paletteService', 'THEME_PALETTES', 'COLOR_VALUES',
	function(themeService, paletteService, THEME_PALETTES, COLOR_VALUES) {
		var self = this;

		var MATERIALIZE_COLOR_VALUES = {
			'50': 'lighten-5',
			'100': 'lighten-4',
			'200': 'lighten-3',
			'300': 'lighten-2',
			'400': 'lighten-1',
			'500': 'base',
			'600': 'darken-1',
			'700': 'darken-2',
			'800': 'darken-3',
			'900': 'darken-4',
			'A100': 'accent-1',
			'A200': 'accent-2',
			'A400': 'accent-3',
			'A700': 'accent-4'
		};

		var MATERIALIZE_THEME_PALETTES = {
			background: 'background',
			primary: 'primary',
			accent: 'secondary',
			warn: 'error'
		};

		var MATERIALIZE_THEME_VALUES = [
			'base', 'light', 'dark', 'light-2', 'dark-2'
		];

		var THEME_SHADES = [
			{
				background: {
					base: '50',
					light: 'A100',
					'light-2': 'A100',
					dark: '800',
					'dark-2': '200'
				},
				primary: {
					base: '500',
					light: 'A100',
					dark: '800'
				},
				accent: {
					base: 'A200',
					light: 'A700'
				},
				warn: {
					base: 'A700'
				}
			},
			{
				background: {
					base: 'A400',
					light: '800',
					'light-2': 'A100',
					dark: '300',
					'dark-2': '200'
				},
				primary: {
					base: '500',
					light: 'A100',
					dark: '800'
				},
				accent: {
					base: '500',
					light: 'A700'
				},
				warn: {
					base: 'A700'
				}
			}
		];

		/*var MATERIALIZE_PALETTE_CLASSES = [
			'@each $name, $color in $custom-colors {',
			'\t@each $type, $value in $color {',
			'\t\t@if $type == "base" {',
			'\t\t\t.#{$name} { background-color: $value !important; }',
			'\t\t\t.#{$name}-text { color: $value !important; }',
			'\t\t}',
			'\t\t@else {',
			'\t\t\t.#{$name}.#{$type} { background-color: $value !important; }',
			'\t\t\t.#{$name}-text.text-#{$type} { color: $value !important; }',
			'\t\t}',
			'\t}',
			'}',
			].join('\n');*/

		var MATERIALIZE_CSS_START = [
			'@import "materialize-css/sass/components/color";',
			'',
			'$brown: map-merge($brown, (',
			'\t"accent-1": #d7ccc8, "accent-2": #bcaaa4,',
			'\t"accent-3": #8d6e63, "accent-4": #5d4037',
			'));',
			'$blue-grey: map-merge($blue-grey, (',
			'\t"accent-1": #cfd8dc, "accent-2": #b0bec5,',
			'\t"accent-3": #78909c, "accent-4": #455a64',
			'));',
			'$grey: map-merge($grey, (',
			'\t"accent-1": #ffffff, "accent-2": #000000,',
			'\t"accent-3": #303030, "accent-4": #616161',
			'));',
			'',
			'$colors: map-merge($colors, (',
			'\t"grey": $grey, "blue-grey": $blue-grey, "brown": $brown',
			'));',
			''
		].join('\n');

		var MATERIALIZE_CSS_END = [
			'$link-color: $primary-color;',
			'$card-bg-color: $background-color-light;',
			'$card-link-color: $text-color;',
			'$collapsible-header-color: $background-color-light;',
			'$collection-border-color: $background-color-dark;',
			'$collection-bg-color: $background-color-light;',
			'$collection-hover-bg-color: $background-color-dark-2;',
			'$chip-bg-color: $background-color-dark-2;',
			'$chip-selected-color: $primary-color;',
			'$datepicker-selected-outfocus: $secondary-color-light;',
			'$timepicker-clock-color: $text-color;',
			'$timepicker-clock-plate-bg: $background-color-dark;',
			'$dropdown-bg-color: $background-color-light-2;',
			'$dropdown-hover-bg-color: $background-color-dark-2;',
			'$dropdown-color: $text-color;',
			'$select-focus: 1px solid $secondary-color-light;',
			'$switch-checked-lever-bg: $secondary-color-light;',
			'$switch-unchecked-lever-bg: $background-color-dark-2;',
			'$sidenav-font-color: $text-color;',
			'$sidenav-bg-color: $background-color-light;',
			'$slider-bg-color: $background-color-dark;',
			'$slider-bg-color-light: $background-color-dark-2;',
			'$slider-indicator-color: $secondary-color;',
			'$tabs-bg-color: $background-color-light;',
			'$table-border-color: $background-color-dark;',
			'$table-striped-color: $background-color-dark-2;',
			'',
			'@import "materialize-css/sass/materialize";',
			'',
			'body { background-color: $background-color; color: $text-color; }',
			'input[type=range] { border: 0px; }',
			'.modal { &, & .modal-footer { background-color: $background-color-light; } }',
			'.modal-overlay { background-color: $background-color-dark; }',
			'.picker__box, .picker__select--month.browser-default,',
			'.picker__select--year.browser-default, .picker__button--today,',
			'.picker__button--clear,.picker__button--close',
			'{ background-color: $background-color-light; border-color: $background-color-light; }',
			'.picker__day--disabled, .picker__day--disabled:hover, .picker--focused .picker__day--disabled,',
			'.picker__day--highlighted.picker__day--disabled,.picker__day--highlighted.picker__day--disabled:hover',
			'.picker__button--today[disabled], .picker__button--today[disabled]:hover',
			'{ background-color: $background-color-dark-2; border-color: $background-color-dark-2; }',
			'.clockpicker-plate { background-color: $background-color; }',
			''
		].join('\n');

		self._materializePalette = function(name, palette) {
			var lines = [
				'$'.concat(name, ': (')
			];
			COLOR_VALUES.forEach(function(value, i) {
				lines.push('\t"'.concat(
					MATERIALIZE_COLOR_VALUES[value], '": ',
					palette[value].hex,
					i + 1 < COLOR_VALUES.length ? ',' : ''
				));
			});
			lines.push(');\n');
			return lines.join('\n');
		};

		self.materialize = function(theme, palettes) {
			theme = theme || themeService.theme;
			palettes = palettes || paletteService.custom;

			var lines = [ MATERIALIZE_CSS_START ];

			var names = Object.keys(palettes);
			if(names.length) {
				names.forEach(function(name) {
					lines.push(self._materializePalette(name, palettes[name]));
				});
				lines.push('$custom-colors: (');
				names.forEach(function(name, i) {
					lines.push('\t"'.concat(
						name, '": $', name,
						i + 1 < names.length ? ',' : ''
					));
				});
				lines.push(');');
				lines.push('\n$colors: map-merge($colors, $custom-colors);\n');
				//lines.push(MATERIALIZE_PALETTE_CLASSES);
			}

			var values = THEME_SHADES[+theme.dark];

			THEME_PALETTES.forEach(function(palette) {
				MATERIALIZE_THEME_VALUES.forEach(function(value) {
					var shade = values[palette][value];
					if(shade !== undefined) {
						lines.push('$'.concat(
							MATERIALIZE_THEME_PALETTES[palette],
							'-color', value === 'base' ? '' : '-' + value,
							': color("', theme[palette], '", "',
							MATERIALIZE_COLOR_VALUES[shade], '");'
						));
					}
				});
			});

			if(theme.dark) {
				lines.push('$text-color: rgba(255, 255, 255, 0.87);');
			}
			else {
				lines.push('$text-color: rgba(0, 0, 0, 0.87);');
			}

			lines.push(MATERIALIZE_CSS_END);
			return lines.join('\n');
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

			var lines = [
				'app.config(["$mdThemingProvider",'
				+ ' function($mdThemingProvider) {'
			];

			for(var name in palettes) {
				lines.push(self._ng1Palette(name, palettes[name]));
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
