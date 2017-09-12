'use strict';

app.directive(
	'replace',
	[
		'$compile',
		'$templateRequest',
		function($compile, $templateRequest) {
			return {
				restrict: 'E',

				/*
				// Template for directive 'replace' must have exactly one root element.
				replace: true,
				templateUrl: function(el, attr) {
					return attr['src'];
				}
				*/

				link: function(scope, el, attr) {
					var url = attr['src'];

					$templateRequest(url).then(function(tmpl) {
						el.html(tmpl);
						tmpl = el.children();
						el.replaceWith(tmpl);
						$compile(tmpl)(scope);
					});
				}
			};
		}
	]
);
