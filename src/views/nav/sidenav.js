'use strict';

app.directive('sideNav', [
	'$transitions', '$timeout',
	function($transitions, $timeout) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'views/nav/sidenav.html',
			controller: 'SideNavController',
			controllerAs: 'sidenav',
			link: function(scope, el/*, attr*/) {
				$transitions.onBefore({}, scope.sidenav.close);
				$transitions.onSuccess({}, function() {
					$timeout(function() {
						el.find('md-list-item > .md-button')
							.removeClass('md-focused');
						el.find('md-list-item.active > .md-button')
							.addClass('md-focused');
					});
				});
			}
		};
	}
]);

app.controller('SideNavController', [
	'$scope', '$mdSidenav', '$mdDialog', '$translate',
	'themeService', 'paletteService', 'themeExportService', 'EXPORT_FORMATS',
	function($scope, $mdSidenav, $mdDialog, $translate,
			 themeService, paletteService, exportService, EXPORT_FORMATS) {
		var self = function() { return $mdSidenav('sidenav'); };

		this.open = function() { self().open(); };
		this.toggle = function() { self().toggle(); };
		this.close = function() { self().close(); };

		this.EXPORT_FORMATS = EXPORT_FORMATS;

		this.exportData = function(fmt) {
			this.close();
			$mdDialog.show(
				$mdDialog
					.exportData({locals: { selected: fmt }})
					.theme(themeService.name)
			);
		};

		this.reset = function() {
			var confirm = $mdDialog.confirm()
				.title($translate.instant('action.reset.confirm.title'))
				.textContent($translate.instant('action.reset.confirm.text'))
				.clickOutsideToClose(true)
				.escapeToClose(true)
				.theme(themeService.name)
				.ok($translate.instant('action.ok'))
				.cancel($translate.instant('action.cancel'));

			$mdDialog
				.show(confirm)
				.then(
					function() {
						themeService.reset();
						paletteService.reset();
					},
					function() {}
				);
		};
	}
]);
