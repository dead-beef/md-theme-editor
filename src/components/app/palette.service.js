app.service('paletteService', [
	'$rootScope', '$mdTheming', 'mdThemingProvider', 'COLOR_VALUES',
	function($rootScope, $mdTheming, $mdThemingProvider, COLOR_VALUES) {

		this.CONTRAST_DARK = [ 0, 0, 0, 0.87 ];
		this.CONTRAST_LIGHT = [ 255, 255, 255, 0.87 ];

		this.CONTRAST_DARK.css = 'rgba(0,0,0,0.87)';
		this.CONTRAST_LIGHT.css = 'rgba(255,255,255,0.87)';

		this.custom = {};
		this.palettes = Object.keys($mdTheming.PALETTES);

		this.validateName = function(name) {
			if(!/[a-z][-a-z0-9_]*/.test(name)) {
				return 1;
			}
			if($mdTheming.PALETTES[name]) {
				return 2;
			}
			return 0;
		};

		this.tinycolor = function(color) {
			if(typeof color === 'string') {
				return tinycolor(color);
			}
			return color;
		};

		this.newName = function() {
			var i = 0;
			var name;
			do {
				name = 'palette' + (i++);
			}
			while(this.custom[name]);
			return name;
		};

		this.add = function(name, data, noEvent) {
			if(!name) {
				name = this.newName();
			}
			if(!data) {
				data = this.palette('#ff00ff');
			}
			data.name = name;
			$mdThemingProvider.definePalette(name, data);
			this.custom[name] = $mdTheming.PALETTES[name];
			this.palettes.push(name);
			if(!noEvent) {
				$rootScope.$broadcast('palette-add', name);
			}
		};

		this.remove = function(name, noEvent) {
			if(this.custom[name]) {
				this.palettes.splice(this.palettes.indexOf(name), 1);
				delete this.custom[name];
				delete $mdTheming.PALETTES[name];
				if(!noEvent) {
					$rootScope.$broadcast('palette-remove', name);
				}
			}
		};

		this.rename = function(src, dst) {
			var data = this.custom[src];
			this.remove(src, true);
			this.add(dst, data, true);
			$rootScope.$broadcast('palette-rename', src, dst);
		};

		this.update = function(name) {
			if(this.custom[name]) {
				$mdThemingProvider.definePalette(name, this.custom[name]);
				$rootScope.$broadcast('palette-update', name);
			}
		};

		this.reset = function() {
			var customLength = 0;
			for(var name in this.custom) {
				delete this.custom[name];
				delete $mdTheming.PALETTES[name];
				$rootScope.$broadcast('palette-remove', name);
				++customLength;
			}
			this.palettes.length -= customLength;
		};

		this.contrast = function(color) {
			color = this.tinycolor(color);
			if(color.isLight()) {
				return this.CONTRAST_DARK;
			}
			return this.CONTRAST_LIGHT;
		};

		this.color = function(color) {
			color = this.tinycolor(color);
			var rgb = color.toRgb();
			return {
				hex: color.toHexString(),
				value: [ rgb.r, rgb.g, rgb.b ],
				contrast: this.contrast(color)
			};
		};

		this._fromRgb = function(rgb) {
			return tinycolor('rgb('.concat(rgb.join(','), ')'));
		};

		this._dark = function(base) {
			var rgb = [0, 0, 0];
			base = base.toRgb();
			rgb.forEach(function(x, i) {
				x = 'rgb'[i];
				rgb[i] = Math.floor(base[x] * base[x] / 255);
			});
			return this._fromRgb(rgb);
		};

		this._palette = function(base) {
			base = tinycolor(base);

			var light = tinycolor('#fff');
			var dark = this._dark(base);
			var accent = tinycolor.mix(dark, base.tetrad()[3], 15);
			var accent2 = angular.copy(accent).saturate(100);
			accent.saturate(80);

			var lighten = function(x) { return tinycolor.mix(base, light, x); };
			var darken = function(x) { return tinycolor.mix(base, dark, x); };

			return [
				lighten(75), lighten(50), lighten(45), lighten(30), lighten(15),
				base, darken(15), darken(30), darken(50), darken(75),
				angular.copy(accent).lighten(60),
				accent.lighten(50),
				angular.copy(accent2).lighten(40),
				accent2.lighten(30)
			];
		};

		this.palette = function(base) {
			var self = this;
			var ret = {
				base: base,
				baseContrast: this.contrast(base)
			};
			this._palette(base).forEach(function(color, idx) {
				ret[COLOR_VALUES[idx]] = self.color(color);
			});
			return ret;
		};

		this.setColor = function(name, color, value) {
			var palette = this.custom[name];
			if(!palette) {
				return;
			}
			if(color === 'base') {
				angular.extend(palette, this.palette(value));
			}
			else {
				palette[color] = this.color(value);
			}
			this.update(name);
		};
	}
]);
