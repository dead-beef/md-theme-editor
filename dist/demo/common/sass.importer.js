"use strict";!function(e,t){"function"==typeof define&&define.amd?define(["jquery","sass.js"],t):"object"==typeof module&&module.exports?module.exports=t(require("jquery"),require("sass.js")):t(e.jQuery,e.Sass)}(this,function(e,t){function s(e){var t=e.lastIndexOf("/");return t<0?".":e.substr(0,t)}var n={};t.importer(function(t,r){if(!t.path&&t.current){var o,u=[],c=[],i=function(e){u.push(e),u.push(e.replace(/(\/?)([^\/]+)$/,"$1_$2"))},a=n[t.previous];o=void 0===a?t.resolved.replace(/^(\/sass)?\//,""):a.concat("/",t.current),n[t.current]=s(o),o.match(/\.s?css$/)?i(o):(i(o+".css"),i(o+".scss"));var f=function(){if(!u.length)return c.length||(c=[t+": no urls"]),void r({error:c.join("\n")});var t=u.pop();e.get(t).done(function(e){e=e.replace(/type=([-a-z]+)/g,'type="$1"'),r({content:e})}).fail(function(e,s){c.push("GET ".concat(t,": ",s,": ",e.statusText)),f()})};f()}else r()})});