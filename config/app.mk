LINT_ENABLED = 1
LIBRARY =

APP_NAME = app

APP_DIR = src
BUILD_DIR = build
BUILD_TMPL_DIR := $(BUILD_DIR)/_tmpl
MIN_DIR := $(BUILD_DIR)/min
DIST_DIR = dist

LIB_NAME = vendor
LIB_FONT_DIRS := node_modules/material-design-icons-iconfont/dist/fonts \
                 node_modules/roboto-fontface/fonts/roboto
LIB_FONT_DIST_DIRS := material-icons roboto
LIB_FONT_TYPES = %.otf %.eot %.ttf %.woff %.woff2

HTML_DIRS = $(APP_DIR)/views
HTML_FILES := $(foreach d,$(HTML_DIRS),$(call rwildcard,$d/,*.html))

JS_DIRS := $(APP_DIR)/components $(APP_DIR)/views
JS_IGNORE = %.test.js

JS_FILES := $(APP_DIR)/vars.js $(APP_DIR)/main.js
JS_FILES += $(foreach d,$(JS_DIRS),$(call rwildcard,$d/,*.js))

CSS_TYPE = scss
CSS_DIRS = $(APP_DIR)/css
CSS_FILES = $(APP_DIR)/css/main.scss
LIB_CSS_FILES := $(APP_DIR)/css/vendor.scss
LIB_CSS_DEPS =

COPY_DIRS := $(APP_DIR)/img $(APP_DIR)/languages $(APP_DIR)/demo
COPY_FILE_TYPES = %.png %.json %.html %.js %.css
COPY_FILE_TYPES_WILDCARD := $(subst %,*,$(COPY_FILE_TYPES))

COPY_FILES := $(APP_DIR)/index.html $(APP_DIR)/.nojekyll
COPY_FILES += $(foreach d,$(COPY_DIRS),\
                          $(call rwildcards,$d/,$(COPY_FILE_TYPES_WILDCARD)))

NPM_SCRIPTS =

SERVER_IP := 127.0.0.1
SERVER_PORT := 57005
