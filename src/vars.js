/* eslint-disable no-unused-vars */
var APP_NAME = 'app';

var APP_DEPS = [
	'ngAnimate',
	'ngAria',
	'ngMaterial',
	'ngMessages',
	'ngStorage',
	'pascalprecht.translate',
	'angular-clipboard',
	'ui.router',
	'rt.debounce',
	APP_NAME + '.info',
	APP_NAME + '.translate',
	APP_NAME + '.stateData'
];

var TESTING = typeof jasmine !== 'undefined';
/* eslint-enable no-unused-vars */

$.fn.spectrum.load = false;
