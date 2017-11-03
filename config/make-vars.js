const path = require('path');
const rootRequire = require('root-require');
const packpath = require('packpath');
const glob = require('glob');
const packageJson = rootRequire('package.json');
const overridePackageJson = require('./override');

const root = packpath.parent();

const getPackageJson = (pack) => {
	let override = overridePackageJson[pack];
	pack = require(path.join(pack, 'package.json'));
	if(override === undefined) {
		return pack;
	}
	return Object.assign({}, pack, override);
};

const resolveRoot = (pack) => {
	let main = require.resolve(pack);
	let packRoot = main.substr(0, main.indexOf(pack) + pack.length);
	return path.relative(root, packRoot);
};

const resolve = (pack) => {
	let override = overridePackageJson[pack];
	override = override && override.main;
	if(!override) {
		return path.relative(root, require.resolve(pack));
	}
	return path.join(resolveRoot(pack), override);
};

const _getDeps = (pack, res, used) => {
	for(let dep in pack.dependencies) {
		if(!used[dep]) {
			_getDeps(getPackageJson(dep), res, used);
			res.push(resolve(dep));
			used[dep] = true;
		}
	}
	return res;
};

const getDeps = (pack) => _getDeps(pack, [], {});

const demoJsDeps = {
	'materialize': getDeps({dependencies: {
		'jquery': true,
		'materialize-css': true
	}})
};

const demoCopyDeps = {
	'materialize': [
		{
			distDir: 'materialize-css/sass',
			root: path.join(resolveRoot('materialize-css'), 'sass'),
			files: '**/*.scss'
		}
	],
	'common': [
		{
			distDir: '',
			root: path.join(resolveRoot('sass.js'), 'dist'),
			files: 'sass.sync.js'
		}/*,
		{
			distDir: '',
			root: path.join(resolveRoot('jquery'), 'dist'),
			files: 'jquery.js'
		}*/
	]
};

let scripts = [];

for(let script in packageJson.scripts) {
	if(!/^(pre|post)/.test(script)) {
		scripts.push(script.replace(/:/g, '-'));
	}
}

[
	'materialize-css',
	'sass.js'
].forEach(function(pack) { delete packageJson.dependencies[pack]; });

let jsDeps = getDeps(packageJson)
	.filter((dep) => dep.endsWith('.js'));

console.log('NPM_SCRIPTS :=', scripts.join(' '));
console.log('ifeq "$(LIB_JS_FILES)" ""');
console.log('LIB_JS_FILES :=', jsDeps.join(' '));
console.log('endif');
console.log('APP_OUT_DIRS :=');
console.log('BUILD_DEMO :=');
console.log('BUILD_DEMO_COPY :=');

for(let demo in demoJsDeps) {
	let filesVar = demo.toUpperCase().concat('_DEMO_LIB_JS_FILES');
	let buildDir = '$(BUILD_DIR)/demo/' + demo;
	let distDir = '$(DIST_DIR)/demo/' + demo;
	let minDir = '$(MIN_DIR)/demo/' + demo;
	console.log(filesVar, ':=', demoJsDeps[demo].join(' '));
	console.log('APP_OUT_DIRS +=', buildDir, distDir, minDir);
	console.log('BUILD_DEMO +=', buildDir + '/vendor.js');
	console.log(buildDir.concat(
		'/vendor.js: $(', filesVar, ') | $(APP_OUT_DIRS)'
	));
	console.log('\t$(call prefix,[js-cat]   ,$(CAT) $^ >$@.tmp)');
	console.log('\t$(call prefix,[js-cat]   ,$(MV) $@.tmp $@)');
}

for(let demo in demoCopyDeps) {
	let filesVarBase = demo.toUpperCase().concat('_DEMO_COPY_FILES');
	let distFilesVarBase = filesVarBase + '_DIST';
	demoCopyDeps[demo].forEach((copy, i) => {
		let filesVar = filesVarBase.concat('_', i);
		let distFilesVar = distFilesVarBase.concat('_', i);
		let distDir = path.join('$(DIST_DIR)/demo', demo, copy.distDir);
		let files = glob.sync(path.join(copy.root, copy.files));
		if(!files) {
			return;
		}
		console.log(filesVar, ':=', files.join(' '));
		console.log(
			distFilesVar, ':=',
			files
				.map((file) => path.join(
					distDir,
					path.relative(copy.root, file)
				))
				.join(' ')
		);
		console.log('APP_OUT_DIRS +=', distDir);
		console.log('BUILD_DEMO_COPY += $(' + distFilesVar + ')');
		console.log(
			'$(eval $(call make-copy-target,',
			'$(' + distFilesVar + '),',
			copy.root, ',',
			distDir, '))'
		);
	});
}
