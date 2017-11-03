# md-theme-editor

## Overview

Material design theme editor.

## Project structure

* `./src` - application
  * `./src/umd` - [UMD](https://github.com/umdjs/umd) scripts
  * `./src/components` - viewless components
  * `./src/views` - view components
  * `./src/css` - stylesheets (scss files are compiled to application css bundle)
    * `./src/css/main.scss` - main application stylesheet
    * `./src/css/vendor.scss` - main vendor stylesheet
  * `./src/img` - images
* `./build` - temporary build files
* `./dist` - bundled application
* `./tests` - unit tests
* `./e2e-tests` - end to end tests
* `./config` - configuration
  * `./config/os.mk` - shell commands
  * `./config/app.mk` - variables
  * `./config/deps.mk` - custom targets/dependencies
  * `./config/override.js` - override dependency package.json

## Requirements

- [`Node.js`](https://nodejs.org/)
- [`NPM`](https://nodejs.org/)
- [`GNU Make`](https://www.gnu.org/software/make/)
- [`Git`](https://git-scm.com/)

## Installation

```bash
git clone https://github.com/dead-beef/md-theme-editor.git
cd md-theme-editor
make install
```

## Building

```bash
# single run
make
# continuous
make watch
# single run, minify
make min
# continuous, minify
make min-watch
```

## Testing

```bash
# unit, single run
make test
# unit, continuous
make test-watch
# end to end, single run
make test-e2e
# all, single run
make test-all
# test application bundle
TEST_BUNDLE=1 make test
# select browsers (default: Firefox)
TEST_BROWSERS="Firefox Chrome" make test
```

## Code Linting

```bash
make lint
```

## Server

```bash
make start
make SERVER_IP=192.168.1.10 SERVER_PORT=1080 start
make stop
```

## Licenses

* [`md-theme-editor`](LICENSE)
