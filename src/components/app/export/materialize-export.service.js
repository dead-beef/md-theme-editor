app.service('materializeExportService', [
	'THEME_PALETTES', 'COLOR_VALUES',
	function(THEME_PALETTES, COLOR_VALUES) {

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
			background: 'bg',
			primary: 'primary',
			accent: 'secondary',
			warn: 'error'
		};

		var THEME_SHADES = [
			{
				background: {
					base: '50',
					light: 'A100',
					dark: '800',
					menu: 'A100',
					'menu-hover': '200',
					'menu-text': '900',
					'switch': '200',
					'switch-lever': '500',
					highlight: '200',
					overlay: '900',
					chip: '300'
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
					dark: '300',
					menu: 'A100',
					'menu-hover': '200',
					'menu-text': '900',
					'switch': '200',
					'switch-lever': '500',
					highlight: 'A400',
					overlay: '900',
					chip: '300'
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

		var MATERIALIZE_THEME_VALUES = Object.keys(THEME_SHADES[0].background);

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

		var SCSS_START = [
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

		var SCSS_END = [
			'$link-color: $primary-color;',
			'$border-color: rgba($bg-color-dark, 0.5);',
			'$bg-color-menu-text: rgba($bg-color-menu-text, 0.87);',
			'$card-bg-color: $bg-color-light;',
			'$card-link-color: $text-color;',
			'$collapsible-header-color: $bg-color-light;',
			'$collapsible-border-color: $border-color;',
			'$collection-border-color: $border-color;',
			'$collection-bg-color: $bg-color-light;',
			'$collection-hover-bg-color: $bg-color-dark;',
			'$chip-bg-color: $bg-color-chip;',
			'$chip-selected-color: $primary-color;',
			'$datepicker-selected-outfocus: $secondary-color-light;',
			'$timepicker-clock-color: $text-color;',
			'$timepicker-clock-plate-bg: $bg-color-dark;',
			'$dropdown-bg-color: $bg-color-menu;',
			'$dropdown-hover-bg-color: $bg-color-menu-hover;',
			'$dropdown-color: $bg-color-menu-text;',
			'$select-focus: 1px solid $secondary-color-light;',
			'$switch-bg-color: $secondary-color;',
			'$switch-unchecked-bg: $bg-color-switch;',
			'$switch-checked-lever-bg: rgba($switch-bg-color, 0.5);',
			'$switch-unchecked-lever-bg: $bg-color-switch-lever;',
			'$sidenav-font-color: $text-color;',
			'$sidenav-bg-color: $bg-color-light;',
			'$slider-bg-color: $bg-color-dark;',
			'$slider-bg-color-light: $bg-color-chip;',
			'$slider-indicator-color: $secondary-color;',
			'$tabs-bg-color: $bg-color-light;',
			'$table-border-color: $border-color;',
			'$table-striped-color: $bg-color-highlight;',
			'',
			'@import "materialize-css/sass/materialize";',
			'',
			'body { background-color: $bg-color; color: $text-color; }',
			'label { color: $text-color; }',
			'input[type=range] { border: 0px; }',
			'.modal, .modal .modal-footer',
			'{ background-color: $bg-color-light; }',
			'.modal-overlay { background-color: $bg-color-overlay; }',
			'.carousel-slider > .carousel-item { border: none; }',
			'.picker__box, .picker__select--month.browser-default,',
			'.picker__select--year.browser-default, .picker__button--today,',
			'.picker__button--clear,.picker__button--close',
			'{ background-color: $bg-color-light; border-color: $bg-color-light; }',
			'.picker__clear { color: $secondary-color; }',
			'.picker__day--disabled, .picker__day--disabled:hover,',
			'.picker--focused .picker__day--disabled,',
			'.picker__day--highlighted.picker__day--disabled,',
			'.picker__day--highlighted.picker__day--disabled:hover,',
			'.picker__button--today[disabled], .picker__button--today[disabled]:hover',
			'{ background-color: $bg-color-highlight; border-color: $bg-color-highlight; }',
			'.picker__day--infocus:hover { background-color: rgba($secondary-color, 0.25); }',
			'.clockpicker-plate { background-color: $bg-color; }',
			''
		].join('\n');

		this.exportPalette = function(name, palette) {
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

		this.exportTheme = function(theme, palettes) {
			var self = this;
			var lines = [ SCSS_START ];

			var names = Object.keys(palettes);
			if(names.length) {
				names.forEach(function(name) {
					lines.push(self.exportPalette(name, palettes[name]));
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

			lines.push(SCSS_END);
			return lines.join('\n');
		};
	}
]);
