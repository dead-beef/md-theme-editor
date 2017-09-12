const path = require('path');
const glob = require('glob');
const SpecReporter = require('jasmine-spec-reporter').SpecReporter;

const driverRoot = 'node_modules/protractor/node_modules/webdriver-manager/selenium/';

let args = glob
	.sync(path.resolve(__dirname, '..', driverRoot, 'geckodriver-*'))
	.filter((path) => !/\.[^0-9]+$/.test(path))
	.map((path) => '-Dwebdriver.gecko.driver=' + path);

exports.config = {

	directConnect: false,

	chromeOnly: false,

	allScriptsTimeout: 15000,

	specs: [
		'../e2e-tests/*.js'
	],

	capabilities: {
		'browserName': 'firefox',
		/*'browserName': 'phantomjs',
		'phantomjs': {
			'binary': {
				'path': require('phantomjs-prebuilt').path
			},
			'ghostdriver': {
				'cli': {
					'args': ['--loglevel=DEBUG']
				}
			}
		}*/
	},

	localSeleniumStandaloneOpts: {
		jvmArgs: args
	},

	baseUrl: 'http://127.0.0.1:57005/',

	framework: 'jasmine',

	jasmineNodeOpts: {
		defaultTimeoutInterval: 30000,
		print: function() {}
	},

	onPrepare: function() {
		jasmine.getEnv().addReporter(new SpecReporter({
			spec: {
				displayStacktrace: true
			}
		}));
	}
};
