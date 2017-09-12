app.config([
	'$provide', '$mdThemingProvider',
	function($provide, $mdThemingProvider) {
		$provide.value('mdThemingProvider', $mdThemingProvider);
	}
]);

app.service('themeService', [
	'$rootScope', 'mdThemingProvider', '$mdTheming', 'THEME_PALETTES',
	function($rootScope, $mdThemingProvider, $mdTheming, THEME_PALETTES) {
		var self = this;
		var i = 0;
		var DEFAULT_THEME = {
			background: 'grey',
			primary: 'indigo',
			accent: 'pink',
			warn: 'deep-orange',
			dark: false
		};

		this.name = 'default';
		this.theme = angular.copy(DEFAULT_THEME);

		this.rebuild = function() {
			if(i) {
				var styles = $('style[md-theme-style]');
				styles.slice(0, styles.length - 16).remove();
				delete $mdTheming.THEMES['theme' + i];
			}

			this.name = 'theme' + (++i);

			$mdThemingProvider.theme(this.name)
				.primaryPalette(this.theme.primary)
				.backgroundPalette(this.theme.background)
				.accentPalette(this.theme.accent)
				.warnPalette(this.theme.warn)
				.dark(this.theme.dark);

			$mdTheming.generateTheme(this.name);
		};

		this.reset = function() {
			angular.extend(this.theme, DEFAULT_THEME);
		};

		this.replacePalette = function(src, dst) {
			THEME_PALETTES.forEach(function(palette) {
				if(self.theme[palette] === src) {
					self.theme[palette] = dst;
				}
			});
		};

		$rootScope.$watchCollection(
			function() { return self.theme; },
			function() { self.rebuild(); }
		);

		$rootScope.$on(
			'palette-remove',
			function(ev, name) { self.replacePalette(name, 'grey'); }
		);

		$rootScope.$on(
			'palette-rename',
			function(ev, src, dst) { self.replacePalette(src, dst); }
		);

		$rootScope.$on(
			'palette-update',
			function(ev, name) {
				if(THEME_PALETTES.some(function(palette) {
					return self.theme[palette] === name;
				})) {
					self.rebuild();
				}
			}
		);
	}
]);
