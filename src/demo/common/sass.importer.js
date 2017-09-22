'use strict';

(function(root, factory) {
	if(typeof define === 'function' && define.amd) {
		define([
			'jquery',
			'sass.js'
		], factory);
	}
	else if(typeof module === 'object' && module.exports) {
		module.exports = factory(
			require('jquery'),
			require('sass.js')
		);
	}
	else {
		factory(root.jQuery, root.Sass);
	}
})(this, function($, Sass) {
	function dirname(path) {
		var i = path.lastIndexOf('/');
		if(i < 0) {
			return '.';
		}
		return path.substr(0, i);
	}

	var path = {};

	Sass.importer(function(request, done) {
		if(!request.path && request.current) {
			var urls = [];
			var errors = [];

			var addUrls = function(url) {
				urls.push(url);
				urls.push(url.replace(/(\/?)([^\/]+)$/, '$1_$2'));
			};

			var root = path[request.previous];
			var url;
			if(root === undefined) {
				url = request.resolved.replace(/^(\/sass)?\//, '');
			}
			else {
				url = root.concat('/', request.current);
			}
			path[request.current] = dirname(url);

			if(!url.match(/\.s?css$/)) {
				addUrls(url + '.css');
				addUrls(url + '.scss');
			}
			else {
				addUrls(url);
			}

			var get = function() {
				if(!urls.length) {
					if(!errors.length) {
						errors = [ url + ': no urls' ];
					}
					done({ error: errors.join('\n') });
					return;
				}
				var url = urls.pop();
				$.get(url)
					.done(function(data) {
						data = data.replace(/type=([-a-z]+)/g, 'type="$1"');
						done({ content: data });
					})
					.fail(function(jqXHR, textStatus) {
						errors.push('GET '.concat(
							url, ': ', textStatus, ': ', jqXHR.statusText
						));
						get();
					});
			};

			get();
		}
		else {
			done();
		}
	});
});
