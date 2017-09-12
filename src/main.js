var APP_CONFIG = [
	'$stateProvider',
	'$urlRouterProvider',
	'$mdIconProvider',
	'EXPORT_FORMATS'
];

var APP_RUN = [
	'$rootScope',
	'themeService'
];

if(!TESTING) {
	APP_DEPS.push('angularCombine');
	APP_CONFIG.push('angularCombineConfigProvider');
}

APP_CONFIG.push(function(
	$stateProvider,
	$urlRouterProvider,
	$mdIconProvider,
	EXPORT_FORMATS,
	angularCombineConfigProvider
) {
	if(angularCombineConfigProvider !== undefined) {
		angularCombineConfigProvider.addConf(/./, 'tmpl/app.html');
	}

	$mdIconProvider.defaultFontSet('material-icons');
	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('main', {
			url: '/',
			templateUrl: 'views/pages/main.html',
			data: {
				pageTitle: 'main.title',
				pageLead: 'main.brief'
			}
		})
		.state('demo', {
			url: '/demo',
			templateUrl: 'views/pages/demo/layout.html',
			data: null
		});

	EXPORT_FORMATS.forEach(function(fmt) {
		$stateProvider.state('demo.' + fmt, {
			url: '/' + fmt,
			template: '<demo flex></demo>',
			data: {
				pageTitle: 'demo.'.concat(fmt, '.title')
			}
		});
	});
});

APP_RUN.push(function($rootScope, themeService) {
	$rootScope.themeService = themeService;
	$rootScope.settings = {
		instantUpdate: true
	};
});

// eslint-disable-next-line no-unused-vars
var app = angular
	.module(APP_NAME, APP_DEPS)
	.config(APP_CONFIG)
	.run(APP_RUN);
