#--------

include config/common.mk

#--------

SASS = node-sass --include-path $(CSS_INCLUDE_PATH)
LINT = eslint
MINJS = uglifyjs
MINCSS = csso
MINJSON = node config/min-json.js
MINHTML = html-minifier -c config/html-minifier.conf.json
ESCHTML = sed -r "s/'/\\\\'/g"
WATCH = chokidar $(WATCH_FILES) -i '**/.*' -c

START = http-server -a $(SERVER_IP) -p $(SERVER_PORT) -c-1 $(DIST_DIR)
STOP = pkill -f http-server

TEST = karma start config/karma.conf.js --single-run
TEST_WATCH = karma start config/karma.conf.js
TEST_E2E = ./e2e-test

MAKE_VARS = config/make-vars.js
MAKE_VARS_CMD := node $(MAKE_VARS)

LINT_ENABLED = 1
LIBRARY =

LIB_JS_FILES =

#--------

include config/os.mk
include config/app.mk

VARS_FILE := $(BUILD_DIR)/vars.mk
-include $(VARS_FILE)

#--------

APP_OUT_JS_DIR := $(DIST_DIR)/js
APP_OUT_CSS_DIR := $(DIST_DIR)/css
APP_OUT_HTML_DIR := $(DIST_DIR)/tmpl
APP_OUT_FONT_DIR := $(DIST_DIR)/fonts

MAKEFILES := Makefile $(VARS_FILE) $(wildcard config/*.mk);

ifneq "$(strip $(LIBRARY))" ""
BUILD_TMPL := $(BUILD_DIR)/templates.js
JS_FILES := $(JS_FILES) $(BUILD_TMPL)
endif

JS_FILES := $(call uniq,$(JS_FILES))
JS_FILES := $(filter-out $(JS_IGNORE),$(JS_FILES))
ifneq "$(strip $(JS_FILES))" ""
JS_FILES := $(APP_DIR)/umd/umd-start.js $(JS_FILES) $(APP_DIR)/umd/umd-end.js
endif

ifeq "$(strip $(CSS_TYPE))" "css"
	CSS_TYPE =
endif

ifeq "$(strip $(CSS_TYPE))" ""
CSS_FILES := $(CSS_FILES) $(foreach d,$(CSS_DIRS),\
                                    $(call rwildcard,$d/,*.css))
CSS_FILES := $(filter-out $(LIB_CSS_FILES) $(LIB_CSS_DEPS),$(CSS_FILES))
CSS_DEPS =
else
CSS_DEPS := $(CSS_FILES) $(foreach d,$(CSS_DIRS),\
                                     $(call rwildcards,$d/,*.css *.$(CSS_TYPE)))
CSS_DEPS := $(filter-out $(LIB_CSS_FILES) $(LIB_CSS_DEPS),$(CSS_DEPS))
CSS_INCLUDE_PATH := $(call join-with,:,$(CSS_DIRS) node_modules)
endif

HTML_TMP_FILES := $(addprefix $(BUILD_TMPL_DIR)/,$(HTML_FILES))

LIB_FONT_TYPES_WILDCARD := $(subst %,*,$(LIB_FONT_TYPES))
LIB_FONTS :=
BUILD_FONTS :=

$(foreach \
    dirs,\
    $(join $(LIB_FONT_DIRS),$(addprefix -->,$(LIB_FONT_DIST_DIRS))),\
    $(eval $(call make-font-target,$(dirs)))\
)

ifneq "$(strip $(LIB_JS_FILES))" ""
LIB_JS := $(BUILD_DIR)/$(LIB_NAME).js
else
LIB_JS =
endif

ifneq "$(strip $(LIB_CSS_FILES))" ""
LIB_CSS := $(BUILD_DIR)/$(LIB_NAME).css
else
LIB_CSS =
endif

ifneq "$(strip $(JS_FILES))" ""
APP_JS := $(BUILD_DIR)/$(APP_NAME).js
else
APP_JS =
endif

ifneq "$(strip $(CSS_FILES))" ""
APP_CSS := $(BUILD_DIR)/$(APP_NAME).css
else
APP_CSS =
endif

ifneq "$(strip $(HTML_FILES))" ""
ifeq "$(strip $(LIBRARY))" ""
APP_HTML := $(BUILD_DIR)/$(APP_NAME).html
else
APP_HTML := $(BUILD_TMPL)
endif
else
APP_HTML =
endif

LIB_MIN_JS := $(LIB_JS:$(BUILD_DIR)%=$(MIN_DIR)%)
LIB_MIN_CSS := $(LIB_CSS:$(BUILD_DIR)%=$(MIN_DIR)%)
APP_MIN_JS := $(APP_JS:$(BUILD_DIR)%=$(MIN_DIR)%)
APP_MIN_CSS := $(APP_CSS:$(BUILD_DIR)%=$(MIN_DIR)%)
APP_MIN_HTML := $(APP_HTML:$(BUILD_DIR)%=$(MIN_DIR)%)

COPY_JS_FILES := $(filter %.js,$(COPY_FILES))
COPY_JSON_FILES := $(filter %.json,$(COPY_FILES))
COPY_CSS_FILES := $(filter %.css,$(COPY_FILES))
COPY_HTML_FILES := $(filter %.html,$(COPY_FILES))
COPY_FILES := $(filter-out %.js %.json %.css %.html,$(COPY_FILES))

BUILD_COPY := $(COPY_FILES:$(APP_DIR)%=$(DIST_DIR)%)
BUILD_COPY_JS := $(COPY_JS_FILES:$(APP_DIR)%=$(BUILD_DIR)%)
BUILD_COPY_JSON := $(COPY_JSON_FILES:$(APP_DIR)%=$(BUILD_DIR)%)
BUILD_COPY_CSS := $(COPY_CSS_FILES:$(APP_DIR)%=$(BUILD_DIR)%)
BUILD_COPY_HTML := $(COPY_HTML_FILES:$(APP_DIR)%=$(BUILD_DIR)%)
BUILD_COPY_DIST := $(BUILD_COPY_JS) $(BUILD_COPY_JSON) \
                   $(BUILD_COPY_CSS) $(BUILD_COPY_HTML)
BUILD_COPY_DIST_MIN := $(BUILD_COPY_DIST:$(BUILD_DIR)%=$(MIN_DIR)%)
BUILD_COPY_ALL := $(BUILD_FONTS) $(BUILD_COPY) $(BUILD_DEMO_COPY) $(BUILD_COPY_DIST)

BUILD_DEMO_MIN := $(BUILD_DEMO:$(BUILD_DIR)%=$(MIN_DIR)%)

BUILD_FILES := $(BUILD_COPY_DIST) $(BUILD_DEMO)
ifneq "$(strip $(LIBRARY))" ""
BUILD_FILES += $(APP_JS) $(APP_CSS) $(APP_HTML)
else
BUILD_FILES += $(LIB_JS) $(LIB_CSS) $(APP_JS) $(APP_CSS) $(APP_HTML)
endif
BUILD_FILES_MIN := $(BUILD_FILES:$(BUILD_DIR)%=$(MIN_DIR)%)
DIST_FILES := $(BUILD_FILES:$(BUILD_DIR)%=$(DIST_DIR)%)

WATCH_FILES := '$(APP_DIR)/**/*' 'config/*' Makefile package.json

APP_OUT_DIRS += $(BUILD_DIR) $(DIST_DIR) $(MIN_DIR) $(BUILD_TMPL_DIR)
APP_OUT_DIRS += \
  $(foreach d,$(BUILD_COPY_DIST),\
    $(dir $d) \
    $(dir $(d:$(BUILD_DIR)/%=$(DIST_DIR)/%)) \
    $(dir $(d:$(BUILD_DIR)/%=$(MIN_DIR)/%)))

ifneq "$(strip $(filter %.js,$(DIST_FILES)))" ""
APP_OUT_DIRS += $(APP_OUT_JS_DIR)
endif

ifneq "$(strip $(filter %.css,$(DIST_FILES)))" ""
APP_OUT_DIRS += $(APP_OUT_CSS_DIR)
endif

ifeq "$(strip $(LIBRARY))" ""
ifneq "$(strip $(filter %.html,$(DIST_FILES)))" ""
APP_OUT_DIRS += $(APP_OUT_HTML_DIR)
endif
ifneq "$(strip $(LIB_FONTS))" ""
APP_OUT_DIRS += $(APP_OUT_FONT_DIR)
endif
endif

APP_OUT_DIRS := $(call uniq,$(APP_OUT_DIRS))

VARS = MAKEFILES LIB_JS_FILES LIB_JS LIB_CSS LIB_CSS_FILES LIB_CSS_DEPS \
       LIB_FONTS JS_FILES CSS_FILES CSS_DEPS HTML_FILES HTML_TMP_FILES \
       APP_JS APP_CSS COPY_FILES COPY_JS_FILES COPY_CSS_FILES \
       COPY_HTML_FILES BUILD_FILES BUILD_FILES_MIN BUILD_FONTS \
       BUILD_COPY BUILD_COPY_JS BUILD_COPY_CSS BUILD_COPY_HTML BUILD_COPY_ALL \
       CSS_INCLUDE_PATH DIST_FILES WATCH_FILES APP_OUT_DIRS \
       TARGETS TEST_TARGETS LIST_TARGETS NPM_SCRIPTS LIST_NPM_SCRIPTS VARS_FILE

TARGETS = all min watch min-watch start stop rebuild clean \
          test test-watch test-e2e test-all install vars help
TEST_TARGETS := $(filter test%,$(TARGETS) $(NPM_SCRIPTS))

LIST_TARGETS := $(addprefix print-,$(TARGETS))

LIST_NPM_SCRIPTS := $(addprefix print-,$(NPM_SCRIPTS))

#--------

.DEFAULT_GOAL := all
.PHONY: $(TARGETS) $(LIST_TARGETS) $(NPM_SCRIPTS) $(LIST_NPM_SCRIPTS) $(VARS)

all min: $(BUILD_COPY_ALL) | $(APP_OUT_DIRS)

all: $(BUILD_FILES)
ifneq "$(strip $(APP_JS) $(LIB_JS))" ""
	$(call prefix,[dist]     ,\
	  $(CPDIST) $(APP_JS) $(LIB_JS) $(APP_OUT_JS_DIR))
endif
ifneq "$(strip $(APP_CSS) $(LIB_CSS))" ""
	$(call prefix,[dist]     ,\
	  $(CPDIST) $(APP_CSS) $(LIB_CSS) $(APP_OUT_CSS_DIR))
endif
ifneq "$(strip $(APP_HTML))" ""
ifeq "$(strip $(LIBRARY))" ""
	$(call prefix,[dist]     , \
	  $(CPDIST) $(APP_HTML) $(APP_OUT_HTML_DIR))
endif
endif
ifneq "$(strip $(BUILD_COPY_DIST))" ""
	$(call prefix,[dist]     ,\
	  $(foreach f,$(BUILD_COPY_DIST),\
	    $(CPDIST) $f $(DIST_DIR)/$(dir $(f:$(BUILD_DIR)/%=%)) &&) true)
endif
ifneq "$(strip $(BUILD_DEMO))" ""
	$(call prefix,[dist]     ,\
	  $(foreach f,$(BUILD_DEMO),\
	    $(CPDIST) $f $(DIST_DIR)/$(dir $(f:$(BUILD_DIR)/%=%)) &&) true)
endif

min: $(BUILD_FILES_MIN)
ifneq "$(strip $(APP_MIN_JS) $(LIB_MIN_JS))" ""
	$(call prefix,[dist]     ,\
	  $(CPDIST) $(APP_MIN_JS) $(LIB_MIN_JS) $(APP_OUT_JS_DIR))
endif
ifneq "$(strip $(APP_MIN_CSS) $(LIB_MIN_CSS))" ""
	$(call prefix,[dist]     ,\
	  $(CPDIST) $(APP_MIN_CSS) $(LIB_MIN_CSS) $(APP_OUT_CSS_DIR))
endif
ifneq "$(strip $(APP_MIN_HTML))" ""
ifeq "$(strip $(LIBRARY))" ""
	$(call prefix,[dist]     , \
	  $(CPDIST) $(APP_MIN_HTML) $(APP_OUT_HTML_DIR))
endif
endif
ifneq "$(strip $(BUILD_COPY_DIST_MIN))" ""
	$(call prefix,[dist]     ,\
	  $(foreach f,$(BUILD_COPY_DIST_MIN),\
	    $(CPDIST) $f $(DIST_DIR)/$(dir $(f:$(MIN_DIR)/%=%)) &&) true)
endif
ifneq "$(strip $(BUILD_DEMO_MIN))" ""
	$(call prefix,[dist]     ,\
	  $(foreach f,$(BUILD_DEMO_MIN),\
	    $(CPDIST) $f $(DIST_DIR)/$(dir $(f:$(MIN_DIR)/%=%)) &&) true)
endif

rebuild: clean
	$(RESET_MAKE)

rebuild-min: clean
	$(RESET_MAKE) min

clean:
	$(call prefix,[clean]    ,$(RM) $(BUILD_DIR)/* $(DIST_DIR)/*)

watch:
	$(call prefix,[build]    ,-$(RESET_MAKE))
	$(call prefix,[watch]    ,$(WATCH) '$(RESET_MAKE)')

min-watch:
	$(call prefix,[build]    ,-$(RESET_MAKE) min)
	$(call prefix,[watch]    ,$(WATCH) '$(RESET_MAKE) min')

install::
	$(call prefix,[install]  ,npm install)

start: stop
	$(call prefix,[start]    ,$(START))

stop:
	$(call prefix,[stop]     ,-$(STOP))

test:
	$(call prefix,[test]     ,$(TEST))

test-watch:
	$(call prefix,[test]     ,$(TEST_WATCH))

test-e2e:
	$(call prefix,[test]     ,$(TEST_E2E))

test-all: test test-e2e

$(NPM_SCRIPTS):
	npm run $(subst -,:,$@) --silent

help: $(LIST_TARGETS) $(LIST_NPM_SCRIPTS)

#--------

$(LIST_TARGETS): print-targets-header
	@$(ECHO) '    ' $(@:print-%=%)

$(LIST_NPM_SCRIPTS): print-npm-header
	@$(ECHO) '    ' $(@:print-%=%)

print-npm-header:
	@$(ECHO) NPM scripts:

print-targets-header:
	@$(ECHO) Make targets:

#--------

node_modules:
	$(call prefix,[install]  ,$(RESET_MAKE) install)

$(APP_OUT_DIRS):
	$(call prefix,[mkdirs]   ,$(MKDIR) $@)

$(MIN_DIR)/%.css: $(BUILD_DIR)/%.css | $(APP_OUT_DIRS)
	$(call prefix,[min-css]  ,$(MINCSS) -i $< -o $@)

$(MIN_DIR)/%.js: $(BUILD_DIR)/%.js | $(APP_OUT_DIRS)
	$(call prefix,[min-js]   ,$(MINJS) $< -c -m >$@.tmp)
	$(call prefix,[min-js]   ,$(MV) $@.tmp $@)

$(MIN_DIR)/%.json: $(BUILD_DIR)/%.json | $(APP_OUT_DIRS)
	$(call prefix,[min-json] ,$(MINJSON) $< >$@.tmp)
	$(call prefix,[min-json] ,$(MV) $@.tmp $@)

$(MIN_DIR)/%.html: $(BUILD_DIR)/%.html | $(APP_OUT_DIRS)
	$(call prefix,[min-tmpl] ,$(MINHTML) $< -o $@.tmp)
	$(call prefix,[min-tmpl] ,$(MV) $@.tmp $@)

$(BUILD_TMPL_DIR)/%.html: %.html
ifeq "$(strip $(LIBRARY))" ""
	$(call prefix,[tmpl]     ,$(MKDIR) $(@D))
	$(call prefix,[tmpl]     ,$(ECHO) '<script type="text/ng-template" id="$(<:$(APP_DIR)/%=%)">' >$@.tmp)
	$(call prefix,[tmpl]     ,$(CAT) $< >>$@.tmp)
	$(call prefix,[tmpl]     ,$(ECHO) '</script>' >>$@.tmp)
	$(call prefix,[tmpl]     ,$(MV) $@.tmp $@)
else
	$(call prefix,[tmpl]     ,$(MKDIR) $(@D))
	$(call prefix,[tmpl]     ,$(ECHO) "	'$(<:$(APP_DIR)/%=%)': '\\" >$@.tmp)
	$(call prefix,[tmpl]     ,$(MINHTML) $< | $(ESCHTML) >>$@.tmp)
	$(call prefix,[tmpl]     ,$(ECHO) "'$(COMMA)" >>$@.tmp)
	$(call prefix,[tmpl]     ,$(MV) $@.tmp $@)
endif

ifneq "$(strip $(APP_HTML))" ""
$(APP_HTML): $(HTML_TMP_FILES) | $(BUILD_TMPL_DIR)
ifeq "$(strip $(LIBRARY))" ""
	$(call prefix,[tmpl-cat] ,$(CAT) $^ >$@.tmp)
	$(call prefix,[tmpl-cat] ,$(MV) $@.tmp $@)
else
	$(call prefix,[tmpl-cat] ,$(ECHO) "exports.module.value$(LP)'$(LIBRARY).templates'$(COMMA){" >$@.tmp)
	$(call prefix,[tmpl-cat] ,$(CAT) $^ >>$@.tmp)
	$(call prefix,[tmpl-cat] ,$(ECHO) "}$(RP);" >>$@.tmp)
	$(call prefix,[tmpl-cat] ,$(MINJS) $@.tmp -c -m >$@.min.tmp)
	$(call prefix,[tmpl-cat] ,$(MV) $@.min.tmp $@)
endif
endif

ifeq "$(CSS_TYPE)" "scss"

ifneq "$(strip $(LIB_CSS))" ""
$(LIB_CSS): $(LIB_CSS_FILES) $(LIB_CSS_DEPS) | $(BUILD_DIR)
	$(call prefix,[lib-css]  ,$(CAT) $(LIB_CSS_FILES) | $(SASS) >$@.tmp)
	$(call prefix,[lib-css]  ,$(MV) $@.tmp $@)
endif

ifneq "$(strip $(APP_CSS))" ""
$(APP_CSS): $(CSS_DEPS) | $(BUILD_DIR)
	$(call prefix,[sass]     ,$(CAT) $(CSS_FILES) | $(SASS) >$@.tmp)
	$(call prefix,[sass]     ,$(MV) $@.tmp $@)
endif

else ifeq "$(CSS_TYPE)" ""

ifneq "$(strip $(LIB_CSS))" ""
$(LIB_CSS): $(LIB_CSS_FILES) | $(BUILD_DIR)
	$(call prefix,[lib-css]  ,$(CAT) $^ >$@.tmp)
	$(call prefix,[lib-css]  ,$(MV) $@.tmp $@)
endif

ifneq "$(strip $(APP_CSS))" ""
$(APP_CSS): $(CSS_FILES) | $(BUILD_DIR)
	$(call prefix,[css-cat]  ,$(CAT) $^ >$@.tmp)
	$(call prefix,[css-cat]  ,$(MV) $@.tmp $@)
endif

else
$(error Unknown css type: $(CSS_TYPE))
endif

ifneq "$(strip $(LIB_JS))" ""
$(LIB_JS): $(LIB_JS_FILES) | $(BUILD_DIR)
	$(call prefix,[lib-js]   ,$(CAT) $^ >$@.tmp)
	$(call prefix,[lib-js]   ,$(MV) $@.tmp $@)
endif

ifneq "$(strip $(APP_JS))" ""
$(APP_JS): $(JS_FILES) | $(BUILD_DIR)
ifneq "$(strip $(LINT_ENABLED))" ""
	$(call prefix,[js-lint]  ,$(LINT) $?)
endif
	$(call prefix,[js-cat]   ,$(CAT) $^ >$@.tmp)
	$(call prefix,[js-cat]   ,$(MV) $@.tmp $@)
endif

$(eval $(call make-copy-target,$(BUILD_COPY),$(APP_DIR),$(DIST_DIR)))
$(eval $(call make-copy-target,$(BUILD_COPY_DIST),$(APP_DIR),$(BUILD_DIR)))

#--------

ifneq "$(MAKECMDGOALS)" "install"
$(VARS_FILE): package.json config/make-vars.js config/override.js | $(BUILD_DIR) $(MAKE_VARS) node_modules
	$(call prefix,[vars]     ,$(MAKE_VARS_CMD) >$@.tmp)
	$(call prefix,[vars]     ,$(MV) $@.tmp $@)
endif

#--------

include config/deps.mk

#--------

$(VARS):
	@$(ECHO) "  " $@ = $($@)

vars: $(VARS)
