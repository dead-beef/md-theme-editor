'use strict';

(function(root, factory) {
	if(typeof define === 'function' && define.amd) {
		define([
			'angular',
			'angular-material'
		], factory);
	}
	else if(typeof module === 'object' && module.exports) {
		module.exports = factory(
			require('angular'),
			require('angular-material')
		);
	}
	else {
		factory(root.angular);
	}
})(this, function(angular) {
	var app = angular.module('ng1Demo', ['ngMaterial', 'ngMessages']);

	eval(window.args.theme);

	app.controller('Ng1DemoController', [
		'$scope', '$mdDialog', '$mdSidenav', '$mdToast',
		function($scope, $mdDialog, $mdSidenav, $mdToast) {
			this.palettes = [ '', 'md-primary', 'md-accent', 'md-warn' ];
			this.hues = [ 'md-hue-1', 'md-hue-2', 'md-hue-3' ];

			this.switchModel = this.checkboxModel = true;
			this.radioModel = this.selectModel = 0;
			this.sliderModel = 50;
			this.chipsModel = [ 'chips' ];
			this.selectedNavItem = 'page1';
			this.inputModel = '';

			this.range = function(size) {
				var ret = [];
				for(var i = 0; i < size; ret.push(i++));
				return ret;
			};

			this.openSidenav = function() {
				$mdSidenav('demo-sidenav').open();
			};
			this.closeSidenav = function() {
				$mdSidenav('demo-sidenav').close();
			};

			this.openDialog = function() {
				$mdDialog.show(
					$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('Alert dialog')
						.textContent('Text content')
						.ok('Close')
				);
			};

			this.openToast = function() {
				var toast = $mdToast.simple()
					.textContent('Toast')
					.action('Action')
					.highlightAction(true);
				$mdToast.show(toast);
			};
		}
	]);

	var demoTemplates = [];

	app.directive('demo', function() {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			template: function(el, attr) {
				var empty = +attr.hasOwnProperty('empty');
				if(demoTemplates[empty]) {
					return demoTemplates[empty];
				}
				else {
					var tmpl = '<div flex="100" flex-gt-sm="50"><md-card>';
					if(!empty) {
						tmpl += '<md-card-content layout="column">';
					}
					tmpl += '<md-content><ng-transclude>'
						+ '</ng-transclude></md-content>';
					if(!empty) {
						tmpl += '</md-card-content>';
					}
					tmpl += '</md-card></div>';
					return demoTemplates[empty] = tmpl;
				}
			}
		};
	});

	app.directive('showErrors', [ '$timeout', function($timeout) {
		return {
			restrict: 'A',
			link: function(scope, el, attr) {
				var form = scope[attr.name];
				$timeout(function() {
					if(form.$invalid) {
						angular.forEach(form.$error, function(fields) {
							angular.forEach(fields, function(field) {
								field.$setTouched();
							});
						});
					}
				});
			}
		};
	}]);

	app.directive('colorDemo', function() {
		return {
			restrict: 'E',
			template: function(el, attr) {
				var hasModel = [
					'md-checkbox',
					'md-switch',
					'md-radio-group'
				];
				var hasDisabled = [
					'md-button',
					'md-checkbox',
					'md-switch',
					'md-radio-group'
				];
				var hasInner = {
					'md-radio-group': [
						'<md-radio-button value=0>',
						'</md-radio-button>'
					],
					'md-slider-container': [
						'<span>',
						'</span><md-slider flex min="0" max="100"'
							+ ' ng-model="ctrl.sliderModel"'
							+ ' ng-class="::[palette, hue]"'
							+ ' aria-label="slider"></md-slider>'
					],
					'md-tabs': [
						'<md-tab><md-tab-label>Tab'
							+ '</md-tab-label><md-tab-body>',
						'</md-tab-body></md-tab>'
							+ '<md-tab ng-repeat="i in ::ctrl.range(2)"'
							+ ' ng-disabled="::(i === 1)">'
							+ '<md-tab-label>Tab {{::i}}</md-tab-label>'
							+ '<md-tab-body>Tab {{::i}}</md-tab-body>'
							+ '</md-tab>'
					],
					'md-nav-bar': [
						'<md-nav-item'
							+ ' md-nav-click="angular.noop()" name="page1">',
						'</md-nav-item><md-nav-item'
							+ ' md-nav-click="angular.noop()"'
							+ ' name="page2">Page 2</md-nav-item>'
					]
				};

				var tag = attr.tag;
				var tagAttr = attr.attr ? ' ' + attr.attr : '';
				var model = '';
				var disabled = '';
				var inner = hasInner[tag] || ['', ''];

				if(hasModel.indexOf(tag) >= 0) {
					model = tag.split('-')[1];
					model = ' ng-model="ctrl.'.concat(model, 'Model"');
				}

				if(hasDisabled.indexOf(tag) >= 0) {
					disabled = '<'.concat(
						tag, tagAttr, ' ng-disabled="true">',
						inner[0], 'Disabled', inner[1], '</', tag, '>'
					);
				}

				return '<div layout="row" '.concat(
					'layout-align="start start">',
					'<', tag, tagAttr,
					' ng-repeat="palette in ::ctrl.palettes"',
					model, ' ng-class="::palette">', inner[0],
					'{{ ::(palette || \'Default\') }}', inner[1],
					'</', tag, '>', disabled, '</div>',
					'<div layout="row"',
					' layout-align="start start"',
					' ng-repeat="palette in ctrl.palettes"><', tag, tagAttr,
					' ng-repeat="hue in ::ctrl.hues"', model,
					' ng-class="::[palette, hue]">', inner[0],
					'{{ ::hue }}', inner[1], '</', tag,
					'></div>'
				);
			}
		};
	});
});
