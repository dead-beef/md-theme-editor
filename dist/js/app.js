"use strict";!function(e,t){"function"==typeof define&&define.amd?define(["jquery","tinycolor2","angular","angular-cookies","ngstorage","@uirouter/angularjs","angular-animate","angular-aria","angular-combine","angular-clipboard","angular-debounce","angular-material","angular-translate","angular-translate-loader-static-files","angular-translate-storage-cookie","angular-translate-storage-local","spectrum-colorpicker"],t):"object"==typeof module&&module.exports?module.exports=t(require("jquery"),require("tinycolor2"),require("angular"),require("angular-cookies"),require("ngstorage"),require("@uirouter/angularjs"),require("angular-animate"),require("angular-aria"),require("angular-combine"),require("angular-clipboard"),require("angular-debounce"),require("angular-material"),require("angular-translate"),require("angular-translate-loader-static-files"),require("angular-translate-storage-cookie"),require("angular-translate-storage-local"),require("spectrum-colorpicker")):t(e.jQuery,e.tinycolor,e.angular)}(this,function(e,t,o){var r=["ngAnimate","ngAria","ngMaterial","ngMessages","ngStorage","pascalprecht.translate","angular-clipboard","ui.router","rt.debounce","app.info","app.translate","app.stateData"],n="undefined"!=typeof jasmine;e.fn.spectrum.load=!1;var a=["$stateProvider","$urlRouterProvider","$mdIconProvider","EXPORT_FORMATS"],i=["$rootScope","themeService","settingsService"];n||(r.push("angularCombine"),a.push("angularCombineConfigProvider")),a.push(function(e,t,o,r,n){void 0!==n&&n.addConf(/./,"tmpl/app.html"),o.defaultFontSet("material-icons"),t.otherwise("/"),e.state("main",{url:"/",templateUrl:"views/pages/main.html",data:{pageTitle:"main.title",pageLead:"main.brief"}}).state("demo",{url:"/demo",templateUrl:"views/pages/demo/layout.html",data:null}),r.forEach(function(t){e.state("demo."+t,{url:"/"+t,template:"<demo flex></demo>",data:{pageTitle:"demo.".concat(t,".title")}})})}),i.push(function(e,t,o){e.themeService=t,e.settings=o.storage});var c=o.module("app",r).config(a).run(i);c.service("paletteService",["$rootScope","$mdTheming","mdThemingProvider","COLOR_VALUES",function(e,r,n,a){this.CONTRAST_DARK=[0,0,0,.87],this.CONTRAST_LIGHT=[255,255,255,.87],this.CONTRAST_DARK.css="rgba(0,0,0,0.87)",this.CONTRAST_LIGHT.css="rgba(255,255,255,0.87)",this.custom={},this.palettes=Object.keys(r.PALETTES),this.validateName=function(e){return/[a-z][-a-z0-9_]*/.test(e)?r.PALETTES[e]?2:0:1},this.tinycolor=function(e){return"string"==typeof e?t(e):e},this.newName=function(){var e,t=0;do{e="palette"+t++}while(this.custom[e]);return e},this.add=function(t,o,a){t||(t=this.newName()),o||(o=this.palette("#ff00ff")),o.name=t,n.definePalette(t,o),this.custom[t]=r.PALETTES[t],this.palettes.push(t),a||e.$broadcast("palette-add",t)},this.remove=function(t,o){this.custom[t]&&(this.palettes.splice(this.palettes.indexOf(t),1),delete this.custom[t],delete r.PALETTES[t],o||e.$broadcast("palette-remove",t))},this.rename=function(t,o){var r=this.custom[t];this.remove(t,!0),this.add(o,r,!0),e.$broadcast("palette-rename",t,o)},this.update=function(t){this.custom[t]&&(n.definePalette(t,this.custom[t]),e.$broadcast("palette-update",t))},this.reset=function(){var t=0;for(var o in this.custom)delete this.custom[o],delete r.PALETTES[o],e.$broadcast("palette-remove",o),++t;this.palettes.length-=t},this.contrast=function(e){return(e=this.tinycolor(e)).isLight()?this.CONTRAST_DARK:this.CONTRAST_LIGHT},this.color=function(e){var t=(e=this.tinycolor(e)).toRgb();return{hex:e.toHexString(),value:[t.r,t.g,t.b],contrast:this.contrast(e)}},this._fromRgb=function(e){return t("rgb(".concat(e.join(","),")"))},this._dark=function(e){var t=[0,0,0];return e=e.toRgb(),t.forEach(function(o,r){o="rgb"[r],t[r]=Math.floor(e[o]*e[o]/255)}),this._fromRgb(t)},this._palette=function(e){e=t(e);var r=t("#fff"),n=this._dark(e),a=t.mix(n,e.tetrad()[3],15),i=o.copy(a).saturate(100);a.saturate(80);var c=function(o){return t.mix(e,r,o)},l=function(o){return t.mix(e,n,o)};return[c(75),c(50),c(45),c(30),c(15),e,l(15),l(30),l(50),l(75),o.copy(a).lighten(60),a.lighten(50),o.copy(i).lighten(40),i.lighten(30)]},this.palette=function(e){var t=this,o={base:e,baseContrast:this.contrast(e)};return this._palette(e).forEach(function(e,r){o[a[r]]=t.color(e)}),o},this.setColor=function(e,t,r){var n=this.custom[e];n&&("base"===t?o.extend(n,this.palette(r)):n[t]=this.color(r),this.update(e))}}]),c.service("settingsService",["$localStorage","themeService","paletteService",function(e,t,r){this.storage=e.$default({instantColorUpdate:!0,exportUnusedPalettes:!0,defaultColorPicker:!0,theme:t.theme,palettes:r.custom});for(var n in this.storage.palettes)r.add(n,this.storage.palettes[n]);o.extend(t.theme,this.storage.theme),this.storage.theme=t.theme,this.storage.palettes=r.custom}]),c.service("themeExportService",["$injector","themeService","paletteService","THEME_PALETTES","EXPORT_FORMATS",function(e,t,o,r,n){var a=this;a.format={},n.forEach(function(t){a.format[t]=e.get(t+"ExportService")}),a.exportTheme=function(e,n){var i,c=t.theme,l=a.format[e];return n?i=o.custom:(i={},r.forEach(function(e){e=c[e];var t=o.custom[e];t&&(i[e]=t)})),l.exportTheme(c,i)}}]),c.constant("THEME_PALETTES",["background","primary","accent","warn"]).constant("COLOR_VALUES",["50","100","200","300","400","500","600","700","800","900","A100","A200","A400","A700"]).constant("EXPORT_FORMATS",["ng1","materialize"]),c.config(["$provide","$mdThemingProvider",function(e,t){e.value("mdThemingProvider",t)}]),c.service("themeService",["$rootScope","mdThemingProvider","$mdTheming","THEME_PALETTES",function(t,r,n,a){var i=this,c=0,l={background:"grey",primary:"indigo",accent:"pink",warn:"deep-orange",dark:!1};this.name="default",this.theme=o.copy(l),this.rebuild=function(){if(c){var t=e("style[md-theme-style]");t.slice(0,t.length-16).remove(),delete n.THEMES["theme"+c]}this.name="theme"+ ++c,r.theme(this.name).primaryPalette(this.theme.primary).backgroundPalette(this.theme.background).accentPalette(this.theme.accent).warnPalette(this.theme.warn).dark(this.theme.dark),n.generateTheme(this.name)},this.reset=function(){o.extend(this.theme,l)},this.replacePalette=function(e,t){a.forEach(function(o){i.theme[o]===e&&(i.theme[o]=t)})},t.$watchCollection(function(){return i.theme},function(){i.rebuild()}),t.$on("palette-remove",function(e,t){i.replacePalette(t,"grey")}),t.$on("palette-rename",function(e,t,o){i.replacePalette(t,o)}),t.$on("palette-update",function(e,t){a.some(function(e){return i.theme[e]===t})&&i.rebuild()})}]),c.service("materializeExportService",["THEME_PALETTES","COLOR_VALUES",function(e,t){var o={50:"lighten-5",100:"lighten-4",200:"lighten-3",300:"lighten-2",400:"lighten-1",500:"base",600:"darken-1",700:"darken-2",800:"darken-3",900:"darken-4",A100:"accent-1",A200:"accent-2",A400:"accent-3",A700:"accent-4"},r={background:"bg",primary:"primary",accent:"secondary",warn:"error"},n=[{background:{base:"50",light:"A100","light-2":"A100",dark:"800","dark-2":"200"},primary:{base:"500",light:"A100",dark:"800"},accent:{base:"A200",light:"A700"},warn:{base:"A700"}},{background:{base:"A400",light:"800","light-2":"A100",dark:"300","dark-2":"200"},primary:{base:"500",light:"A100",dark:"800"},accent:{base:"500",light:"A700"},warn:{base:"A700"}}],a=Object.keys(n[0].background),i=['@import "materialize-css/sass/components/color";',"","$brown: map-merge($brown, (",'\t"accent-1": #d7ccc8, "accent-2": #bcaaa4,','\t"accent-3": #8d6e63, "accent-4": #5d4037',"));","$blue-grey: map-merge($blue-grey, (",'\t"accent-1": #cfd8dc, "accent-2": #b0bec5,','\t"accent-3": #78909c, "accent-4": #455a64',"));","$grey: map-merge($grey, (",'\t"accent-1": #ffffff, "accent-2": #000000,','\t"accent-3": #303030, "accent-4": #616161',"));","","$colors: map-merge($colors, (",'\t"grey": $grey, "blue-grey": $blue-grey, "brown": $brown',"));",""].join("\n"),c=["$link-color: $primary-color;","$card-bg-color: $bg-color-light;","$card-link-color: $text-color;","$collapsible-header-color: $bg-color-light;","$collection-border-color: $bg-color-dark;","$collection-bg-color: $bg-color-light;","$collection-hover-bg-color: $bg-color-dark-2;","$chip-bg-color: $bg-color-dark-2;","$chip-selected-color: $primary-color;","$datepicker-selected-outfocus: $secondary-color-light;","$timepicker-clock-color: $text-color;","$timepicker-clock-plate-bg: $bg-color-dark;","$dropdown-bg-color: $bg-color-light-2;","$dropdown-hover-bg-color: $bg-color-dark-2;","$dropdown-color: $text-color;","$select-focus: 1px solid $secondary-color-light;","$switch-checked-lever-bg: $secondary-color-light;","$switch-unchecked-lever-bg: $bg-color-dark-2;","$sidenav-font-color: $text-color;","$sidenav-bg-color: $bg-color-light;","$slider-bg-color: $bg-color-dark;","$slider-bg-color-light: $bg-color-dark-2;","$slider-indicator-color: $secondary-color;","$tabs-bg-color: $bg-color-light;","$table-border-color: $bg-color-dark;","$table-striped-color: $bg-color-dark-2;","",'@import "materialize-css/sass/materialize";',"","body { background-color: $bg-color; color: $text-color; }","input[type=range] { border: 0px; }",".modal, .modal .modal-footer","{ background-color: $bg-color-light; }",".modal-overlay { background-color: $bg-color-dark; }",".picker__box, .picker__select--month.browser-default,",".picker__select--year.browser-default, .picker__button--today,",".picker__button--clear,.picker__button--close","{ background-color: $bg-color-light; border-color: $bg-color-light; }",".picker__day--disabled, .picker__day--disabled:hover,",".picker--focused .picker__day--disabled,",".picker__day--highlighted.picker__day--disabled,",".picker__day--highlighted.picker__day--disabled:hover,",".picker__button--today[disabled], .picker__button--today[disabled]:hover","{ background-color: $bg-color-dark-2; border-color: $bg-color-dark-2; }",".clockpicker-plate { background-color: $bg-color; }",""].join("\n");this.exportPalette=function(e,r){var n=["$".concat(e,": (")];return t.forEach(function(e,a){n.push('\t"'.concat(o[e],'": ',r[e].hex,a+1<t.length?",":""))}),n.push(");\n"),n.join("\n")},this.exportTheme=function(t,l){var s=this,u=[i],d=Object.keys(l);d.length&&(d.forEach(function(e){u.push(s.exportPalette(e,l[e]))}),u.push("$custom-colors: ("),d.forEach(function(e,t){u.push('\t"'.concat(e,'": $',e,t+1<d.length?",":""))}),u.push(");"),u.push("\n$colors: map-merge($colors, $custom-colors);\n"));var h=n[+t.dark];return e.forEach(function(e){a.forEach(function(n){var a=h[e][n];void 0!==a&&u.push("$".concat(r[e],"-color","base"===n?"":"-"+n,': color("',t[e],'", "',o[a],'");'))})}),t.dark?u.push("$text-color: rgba(255, 255, 255, 0.87);"):u.push("$text-color: rgba(0, 0, 0, 0.87);"),u.push(c),u.join("\n")}}]),c.service("ng1ExportService",["THEME_PALETTES","COLOR_VALUES",function(e,t){this.exportPalette=function(e,o){var r=['\t$mdThemingProvider.definePalette("'.concat(e,'", {')];return t.forEach(function(e,n){r.push('\t\t"'.concat(e,'": ',JSON.stringify(o[e]),n+1<t.length?",":""))}),r.push("\t});"),r.push(""),r.join("\n")},this.exportTheme=function(t,o){var r=['app.config(["$mdThemingProvider", function($mdThemingProvider) {'];for(var n in o)r.push(this.exportPalette(n,o[n]));return r.push('\t$mdThemingProvider.theme("default")'),e.forEach(function(e){var o=t[e];r.push("\t\t.".concat(e,'Palette("',o,'")'))}),t.dark?r.push("\t\t.dark();"):r[r.length-1]+=";",r.push("}]);"),r.push(""),r.join("\n")}}]),c.animation(".fold-animation",["$animateCss",function(e){function t(e,t,o,r){var n="max-"+o;e[n]=r[o]()+"px",t[n]="0px"}function o(e,o){var i=o?"to":"from",c=o?"from":"to",l={},s={overflow:"hidden"},u=+(e.width()/e.parent().width()>.5);t(l,s,a[u],e),e.siblings(".fold-animation").length||t(l,s,a[1-u],e);var d={easing:n,duration:r};return d[i]=s,d[c]=l,d}var r=.25,n="ease-out",a=["width","height"];return{enter:function(t,r){return e(t,o(t)).start().done(function(){t.css({"max-width":"","max-height":"",overflow:""}),r()})},leave:function(t){return e(t,o(t,!0))}}}]),o.module("app.info",[]).constant("version","1.0").constant("languages",["en","ru"]).constant("defaultLanguage","en").directive("appVersion",["version",function(e){return function(t,o){o.text(e)}}]).directive("currentYear",function(){return{link:function(e,t){t.html("&copy; "+(new Date).getFullYear())}}}),c.directive("replace",["$compile","$templateRequest",function(e,t){return{restrict:"E",link:function(o,r,n){var a=n.src;t(a).then(function(t){r.html(t),t=r.children(),r.replaceWith(t),e(t)(o)})}}}]),o.module("app.stateData",["ui.router"]).run(["$transitions","$rootScope",function(e,t){e.onSuccess({},function(e){var o=e.to();t.stateData=o.data,t.stateName=o.name})}]);var l=o.module("app.translate",["app.info","pascalprecht.translate","ngCookies","ngStorage"]).config(["$translateProvider","defaultLanguage",function(e,t){e.useStaticFilesLoader({prefix:"languages/",suffix:".json"}).useSanitizeValueStrategy("escape").preferredLanguage(t).fallbackLanguage(t).useLocalStorage()}]);c.directive("paletteSelect",function(){return{restrict:"E",replace:!0,scope:{name:"=",ngModel:"=",options:"="},templateUrl:"views/app/palette-select.html"}}),c.directive("inputColor",["debounce","paletteService",function(e,o){return{restrict:"E",replace:!1,transclude:!0,require:"ngModel",scope:{ngModel:"=",instantUpdate:"=",defaultColorPicker:"="},templateUrl:"views/app/input-color.html",link:function(r,n,a,i){var c=n.find("input"),l=function(){r.ngModel=r.color,i.$setViewValue(r.color)},s=function(e){r.color=e,r.$apply(l)},u=!1,d=function(){u||(u=!0,n.spectrum({color:t(r.color),showInput:!1,allowEmpty:!1,showAlpha:!1,clickoutFiresChange:!1}))},h=function(){u&&(u=!1,n.spectrum("destroy"))};i.$render=function(){r.color=t(i.$viewValue).toHexString(),c.val(r.color)},r.input=function(){u||c.click()},c.on("change",function(){r.$apply(l)}),n.on("move.spectrum",e(50,function(e,t){r.$apply(function(){r.color=t.toHexString()})})).on("change.spectrum",function(e,t){void 0!==t&&s(t.toHexString())}).on("hide.spectrum",function(){s(n.spectrum("get").toHexString())}),r.$watch("color",e(50,function(e){e=t(e),r.contrast=o.contrast(e).css,u&&n.spectrum("set",e),r.instantUpdate&&l()})),r.$watch("defaultColorPicker",function(e){e?h():d()}),r.$on("$destroy",h)}}}]),c.directive("paletteEditor",[function(){return{restrict:"E",replace:!0,transclude:!0,scope:{name:"=",instantUpdate:"=",defaultColorPicker:"="},controller:"PaletteEditorController",controllerAs:"ctrl",templateUrl:"views/app/palette-editor.html"}}]),c.controller("PaletteEditorController",["$scope","$mdDialog","themeService","paletteService","COLOR_VALUES",function(e,t,o,r,n){var a=this;this.COLOR_VALUES=n,this.update=function(t){var o=this.palette[t].hex;r.setColor(e.name,t,o)},this.reset=function(){r.setColor(e.name,"base",this.palette.base)},this.remove=function(){r.remove(e.name)},this.rename=function(){t.show(t.renamePalette({locals:{name:e.name}}).theme(o.name)).then(function(t){r.rename(e.name,t),e.name=t},function(){})},e.$watch("name",function(e){a.palette=r.custom[e]})}]),l.directive("languageSelect",function(){return{restrict:"E",replace:!0,templateUrl:"views/common/language-select.html",controller:"LanguageController",controllerAs:"language"}}),l.directive("languageMenu",function(){return{restrict:"E",replace:!0,templateUrl:"views/common/language-menu.html",controller:"LanguageController",controllerAs:"language"}}),l.controller("LanguageController",["$translate","$scope","languages",function(e,t,o){t.vm={languages:o,language:null},t.$watch(function(){return e.use()},function(e){t.vm.language=e}),t.$watch("vm.language",function(t){e.use(t)})}]),c.controller("ExportDataDialogController",["$rootScope","$mdDialog","$mdToast","$translate","themeService","themeExportService","EXPORT_FORMATS",function(e,t,o,r,n,a,i){function c(e){o.show(o.simple().hideDelay(1500).textContent(e))}var l=this;l.EXPORT_FORMATS=i,"string"==typeof l.selected&&(l.selected=i.indexOf(l.selected)),l.selected=0|l.selected,i.forEach(function(t){l[t]=a.exportTheme(t,e.settings.exportUnusedPalettes)}),l.close=function(){t.hide()},l.copySuccess=function(){c(r.instant("action.copy.success").concat(": ",i[l.selected]))},l.copyError=function(e){c(r.instant("action.copy.error").concat(": ",i[l.selected],": ",e.toString()))}}]),c.config(["$mdDialogProvider",function(e){e.addPreset("exportData",{methods:["theme"],options:function(){return{templateUrl:"views/dialogs/export-data.html",controller:"ExportDataDialogController",controllerAs:"dialog",bindToController:!0,clickOutsideToClose:!0,escapeToClose:!0}}})}]),c.controller("RenamePaletteDialogController",["$mdDialog","paletteService",function(e,t){this.result=this.name,this.cancel=function(){e.cancel()},this.ok=function(){e.hide(this.result)},this.valid=function(){return t.validateName(this.result)}}]),c.config(["$mdDialogProvider",function(e){e.addPreset("renamePalette",{methods:["theme"],options:function(){return{templateUrl:"views/dialogs/rename-palette.html",controller:"RenamePaletteDialogController",controllerAs:"dialog",bindToController:!0,clickOutsideToClose:!0,escapeToClose:!0}}})}]),c.directive("navBar",function(){return{restrict:"E",replace:!0,templateUrl:"views/nav/nav.html",controller:"NavController",controllerAs:"navbar"}}),c.controller("NavController",[function(){}]),c.directive("sideNav",["$transitions","$timeout",function(e,t){return{restrict:"E",replace:!0,templateUrl:"views/nav/sidenav.html",controller:"SideNavController",controllerAs:"sidenav",link:function(o,r){e.onBefore({},o.sidenav.close),e.onSuccess({},function(){t(function(){r.find("md-list-item > .md-button").removeClass("md-focused"),r.find("md-list-item.active > .md-button").addClass("md-focused")})})}}}]),c.controller("SideNavController",["$scope","$mdSidenav","$mdDialog","$translate","themeService","paletteService","themeExportService","EXPORT_FORMATS",function(e,t,o,r,n,a,i,c){var l=function(){return t("sidenav")};this.open=function(){l().open()},this.toggle=function(){l().toggle()},this.close=function(){l().close()},this.EXPORT_FORMATS=c,this.exportData=function(e){this.close(),o.show(o.exportData({locals:{selected:e}}).theme(n.name))},this.reset=function(){var e=o.confirm().title(r.instant("action.reset.confirm.title")).textContent(r.instant("action.reset.confirm.text")).clickOutsideToClose(!0).escapeToClose(!0).theme(n.name).ok(r.instant("action.ok")).cancel(r.instant("action.cancel"));o.show(e).then(function(){n.reset(),a.reset()},function(){})}}]),c.controller("MainController",["$mdDialog","themeService","paletteService","THEME_PALETTES",function(e,t,o,r){this.THEME_PALETTES=r,this.theme=t.theme,this.palettes=o.palettes,this.customPalettes=o.custom,this.addPalette=function(){o.add()}}]),c.controller("DemoController",["$rootScope","$scope","themeExportService",function(e,t,o){var r=this,n=e.$watch("stateName",function(){var t=e.stateName.substr(e.stateName.lastIndexOf(".")+1);console.log("state change",e.stateName,t),r.format=t,r.args="?theme=",r.args+=encodeURIComponent(o.exportTheme(t,e.settings.exportUnusedPalettes)),r.loading=!0,r.show=!1});t.$on("$destroy",function(){console.log("destroy"),n()})}]),c.directive("demo",["$interval","$timeout",function(e,t){return{replace:!0,template:"<iframe></iframe>",link:function(o,r){var n={ng1:function(e){return e.hasAttribute("ng-cloak")},materialize:function(e){return e.classList.contains("hide")},default:function(){return!1}};t(function(){var t=o.demo,a="demo/".concat(t.format,"/index.html",t.args),i=n[t.format];i||(i=n.default),r.attr("src",a),r.on("load",function(){o.$apply(function(){t.show=!0});var n=e(function(){var o=r.contents()[0].body;(t.loading=i(o))||(e.cancel(n),n=null)},250);o.$on("$destroy",function(){null!==n&&e.cancel(n)})})})}}}])});
