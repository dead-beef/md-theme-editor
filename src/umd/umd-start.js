'use strict';

(function(root, factory) {
	if(typeof define === 'function' && define.amd) {
		define([
			'jquery',
			'tinycolor2',
			'angular',
			'angular-cookies',
			'ngstorage',
			'@uirouter/angularjs',
			'angular-animate',
			'angular-aria',
			'angular-combine',
			'angular-clipboard',
			'angular-material',
			'angular-translate',
			'angular-translate-loader-static-files',
			'angular-translate-storage-cookie',
			'angular-translate-storage-local'
		], factory);
	}
	else if(typeof module === 'object' && module.exports) {
		module.exports = factory(
			require('jquery'),
			require('tinycolor2'),
			require('angular'),
			require('angular-cookies'),
			require('ngstorage'),
			require('@uirouter/angularjs'),
			require('angular-animate'),
			require('angular-aria'),
			require('angular-combine'),
			require('angular-clipboard'),
			require('angular-material'),
			require('angular-translate'),
			require('angular-translate-loader-static-files'),
			require('angular-translate-storage-cookie'),
			require('angular-translate-storage-local')
		);
	}
	else {
		factory(root.jQuery, root.tinycolor, root.angular);
	}
})(this, function($, tinycolor, angular) {
