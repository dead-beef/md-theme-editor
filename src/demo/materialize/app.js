'use strict';

(function(root, factory) {
	if(typeof define === 'function' && define.amd) {
		define([
			'jquery',
			'materialize-css',
			'sass.js'
		], factory);
	}
	else if(typeof module === 'object' && module.exports) {
		module.exports = factory(
			require('jquery'),
			require('materialize-css'),
			require('sass.js')
		);
	}
	else {
		factory(root.jQuery, root.Materialize, root.Sass);
	}
})(this, function($, Materialize, Sass) {
	$(document).ready(function() {
		var theme = window.args.theme;
		if(!theme) {
			theme = '@import "materialize-css/sass/materialize.scss";';
		}
		theme = '$roboto-font-path: "../../fonts/roboto/";\n' + theme;

		Sass.compile(theme, function(result) {
			if(result.status) {
				$('body')
					.html(
						result.formatted
							.replace(/>/g, '&gt;')
							.replace(/</g, '&lt;')
							.replace(/\n/g, '<br/>')
					)
					.removeClass('hide');
				return;
			}

			$('style')
				.attr('type', 'text/css')
				.text(result.text)
				.appendTo($('head'));

			var colors = [
				'red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue',
				'light-blue', 'cyan', 'teal', 'green', 'light-green',
				'lime', 'yellow', 'amber', 'orange', 'deep-orange',
				'brown', 'blue-grey', 'grey'
			];

			var values = [
				'base',
				'lighten-1', 'lighten-2', 'lighten-3', 'lighten-4', 'lighten-5',
				'darken-1', 'darken-2', 'darken-3', 'darken-4',
				'accent-1', 'accent-2', 'accent-3', 'accent-4'
			];

			var customColors = [];

			colors.push.apply(colors, customColors);

			$('.color-demo,.text-color-demo').each(function() {
				var el = $(this);
				var container = el.parent();
				var bg = el.hasClass('color-demo');
				var fg = el.hasClass('text-color-demo');
				colors.forEach(function(color) {
					var demo = el.clone();
					if(bg) {
						demo.find('.color-class').addClass(color);
						demo.find('.color-name').append(color);
					}
					if(fg) {
						demo.find('.text-color-class')
							.addClass(color + '-text');
						demo.find('.text-color-name').append(color);
					}
					container.append(demo);
				});
			});

			$('.value-demo,.text-value-demo').each(function() {
				var el = $(this);
				var container = el.parent();
				var bg = el.hasClass('value-demo');
				var fg = el.hasClass('text-value-demo');
				values.forEach(function(value) {
					var demo = el.clone();
					if(bg) {
						demo.find('.value-class').addClass(value);
						demo.find('.value-name').append(value);
					}
					if(fg) {
						demo.find('.text-value-class')
							.addClass('text-' + value);
						demo.find('.text-value-name').append(value);
					}
					container.append(demo);
				});
			});

			$('.color-select,.text-color-select,.value-select,.text-value-select')
				.each(function() {
					var el = $(this);
					var target = el.data('target');
					var prev = null;
					var select;
					var bg = el.hasClass('color-select');
					var fg = el.hasClass('text-color-select');
					var options;
					var textClass;
					var bgClass, fgClass;

					if(bg || fg) {
						bgClass = '.color-class';
						fgClass = '.text-color-class';
						options = colors;
						textClass = function(cls) { return cls + '-text'; };
					}
					else {
						bg = el.hasClass('value-select');
						fg = el.hasClass('text-value-select');
						bgClass = '.value-class';
						fgClass = '.text-value-class';
						options = values;
						textClass = function(cls) { return 'text-' + cls; };
					}

					if(this.tagName.toLowerCase() === 'select') {
						select = el;
					}
					else {
						select = el.find('select');
					}
					$('<option/>')
						.attr('value', '')
						.attr('selected', 'selected')
						.text('default')
						.appendTo(select);
					options.forEach(function(color) {
						$('<option/>')
							.attr('value', color)
							.text(color)
							.appendTo(select);
					});
					select.val('');
					select.on('change', function() {
						var cls = $(this).val();
						var targets, textTargets;
						if(bg) {
							targets = $(target).find(bgClass);
							if(prev) {
								targets.removeClass(prev);
							}
						}
						if(fg) {
							textTargets = $(target).find(fgClass);
							if(prev) {
								textTargets.removeClass(textClass(prev));
							}
						}
						prev = cls;
						if(bg) {
							targets.addClass(cls);
						}
						if(fg) {
							textTargets.addClass(textClass(cls));
						}
					});
				});

			$('.toast-demo').on('click', function() {
				var toast = $('<span>Toast content</span>')
					.append($('<button class="btn-flat toast-action">Action</button>'));
				Materialize.toast(toast, 5000);
			});

			$('.sidenav').sideNav();
			$('.collapsible').collapsible();
			$('select').material_select();
			$('.dropdown-button').dropdown();
			$('.char-counter').characterCounter();
			$('.dropdown-button').dropdown();
			$('.materialboxed').materialbox();
			$('.modal').modal();
			$('.slider').slider();

			setTimeout(function() {
				$('.carousel').carousel();
				$('ul.tabs').tabs();
			}, 250);

			$('.autocomplete').autocomplete({
				data: {
					'1234': null,
					'2345': null,
					'3456': null,
					'4567': null,
					'5678': null
				},
				limit: 20,
				minLength: 1,
			});

			$('.chips').material_chip({
				data: [
					{ tag: 'Chip' },
					{ tag: 'Selected' }
				],
				autocompleteOptions: {
					data: {
						'1234': null,
						'2345': null,
						'3456': null,
						'4567': null,
						'5678': null
					},
					limit: Infinity,
					minLength: 1
				}
			});

			$('.chips .chip').each(function() {
				if($(this).text().toLowerCase().indexOf('selected') >= 0) {
					$(this).addClass('selected');
				}
			});

			$('.datepicker').pickadate({
				selectMonths: true,
				selectYears: true,
				min: false,
				max: true,
				format: 'yyyy-mm-dd'
			});

			$('.timepicker').pickatime({});

			$('input[type=range]').each(function() {
				$(this).parent()
					.removeClass('input-field')
					.addClass('range-field')
					.on('mousedown', function() {
						var el = $(this).children('.thumb');
						el.show();
						var hide = function() {
							el.hide();
							$(window).off('mouseup', hide);
						};
						$(window).on('mouseup', hide);
					});
			});

			$('body').removeClass('hide');
		});
	});
});
