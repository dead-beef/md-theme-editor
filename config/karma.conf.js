module.exports = (config) => {
	const fs = require('fs');
	const rootRequire = require('root-require');
	const packageJson = rootRequire('package.json');

	let library = false;

	let vendor = './dist/js/vendor.js';
	if(!fs.existsSync(vendor)) {
		vendor = './build/vendor.js';
		library = true;
	}

	let files = [ vendor ];

	if(packageJson.dependencies.jquery !== undefined) {
		files.push({
			pattern: require.resolve('jasmine-jquery'),
			watched: false,
			served: true
		});
	}

	files.push({
		pattern: require.resolve('angular-mocks'),
		watched: false,
		served: true
	});

	let prefix;

	if(process.env.TEST_BUNDLE && !/^\s*$/.test(process.env.TEST_BUNDLE)) {
		files.push('./src/vars.js');
		files.push('./dist/js/*.js');
		if(!library) {
			files.push('./dist/tmpl/*.html');
		}
		prefix = 'dist/tmpl/';
	}
	else {
		files.push.apply(files, [
			'./tests/test-start.js',
			'./src/vars.js',
			'./src/main.js',
			'./src/components/**/*.js',
		]);

		if(library) {
			files.push('./build/templates.js');
		}
		else {
			files.push.apply(files, [
				'./src/views/**/*.js',
				'./src/views/**/*.html'
			]);
		}

		prefix = 'src/';
	}

	let browsers = process.env.TEST_BROWSERS;
	if(browsers) {
		browsers = browsers.split(/\s+/);
	}
	if(!(browsers && browsers[0])) {
		browsers = ['Firefox'];
	}

	files.push('./tests/**/*.test.js');

	config.set({
		basePath: '../',

		files: files,

		frameworks: ['jasmine'],

		preprocessors: {
			'./src/views/**/*.html': ['ng-html2js'],
			'./dist/tmpl/*.html': ['ng-html2js']
		},
		ngHtml2JsPreprocessor: {
			stripPrefix: prefix,
			moduleName: 'ngTemplates'
		},

		reporters: ['spec'],
		specReporter: {
			maxLogLines: 5,
			suppressErrorSummary: true,
			suppressFailed: false,
			suppressPassed: false,
			suppressSkipped: true,
			showSpecTiming: false,
			failFast: false
		},

		port: 9876,

		colors: true,
		logLevel: config.LOG_INFO,

		autoWatch: true,
		singleRun: false,

		browsers: browsers
	});
};
