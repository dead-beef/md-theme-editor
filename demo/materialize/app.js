"use strict";!function(e,t){"function"==typeof define&&define.amd?define(["jquery","materialize-css","sass.js"],t):"object"==typeof module&&module.exports?module.exports=t(require("jquery"),require("materialize-css"),require("sass.js")):t(e.jQuery,e.Materialize,e.Sass)}(this,function(e,t,a){e(document).ready(function(){var l=window.args.theme;l||(l='@import "materialize-css/sass/materialize.scss";');var s=(l='$roboto-font-path: "../../fonts/roboto/";\n'+l).match(/\$custom-colors: \(\n([\s\S]*?)\n\);/m);s?(s=s[1].split("\n")).forEach(function(e,t){s[t]=e.replace(/^\s*"([^"]*)".*$/,"$1")}):s=[],a.compile(l,function(a){if(a.status)e("body").html(a.formatted.replace(/>/g,"&gt;").replace(/</g,"&lt;").replace(/\n/g,"<br/>")).removeClass("hide");else{e("style").attr("type","text/css").text(a.text).appendTo(e("head"));var l=["red","pink","purple","deep-purple","indigo","blue","light-blue","cyan","teal","green","light-green","lime","yellow","amber","orange","deep-orange","brown","blue-grey","grey"];l.push.apply(l,s);var o=["base","lighten-1","lighten-2","lighten-3","lighten-4","lighten-5","darken-1","darken-2","darken-3","darken-4","accent-1","accent-2","accent-3","accent-4"],n=[];l.push.apply(l,n),e(".color-demo,.text-color-demo").each(function(){var t=e(this),a=t.parent(),s=t.hasClass("color-demo"),o=t.hasClass("text-color-demo");l.forEach(function(e){var l=t.clone();s&&(l.find(".color-class").addClass(e),l.find(".color-name").append(e)),o&&(l.find(".text-color-class").addClass(e+"-text"),l.find(".text-color-name").append(e)),a.append(l)})}),e(".value-demo,.text-value-demo").each(function(){var t=e(this),a=t.parent(),l=t.hasClass("value-demo"),s=t.hasClass("text-value-demo");o.forEach(function(e){var o=t.clone();l&&(o.find(".value-class").addClass(e),o.find(".value-name").append(e)),s&&(o.find(".text-value-class").addClass("text-"+e),o.find(".text-value-name").append(e)),a.append(o)})}),e(".color-select,.text-color-select,.value-select,.text-value-select").each(function(){var t,a,s,n,c,i=e(this),r=i.data("target"),d=null,u=i.hasClass("color-select"),p=i.hasClass("text-color-select");u||p?(n=".color-class",c=".text-color-class",a=l,s=function(e){return e+"-text"}):(u=i.hasClass("value-select"),p=i.hasClass("text-value-select"),n=".value-class",c=".text-value-class",a=o,s=function(e){return"text-"+e}),t="select"===this.tagName.toLowerCase()?i:i.find("select"),e("<option/>").attr("value","").attr("selected","selected").text("default").appendTo(t),a.forEach(function(a){e("<option/>").attr("value",a).text(a).appendTo(t)}),t.val(""),t.on("change",function(){var t,a,l=e(this).val();u&&(t=e(r).find(n),d&&t.removeClass(d)),p&&(a=e(r).find(c),d&&a.removeClass(s(d))),d=l,u&&t.addClass(l),p&&a.addClass(s(l))})}),e(".toast-demo").on("click",function(){var a=e("<span>Toast content</span>").append(e('<button class="btn-flat toast-action">Action</button>'));t.toast(a,5e3)}),e(".sidenav").sideNav(),e(".collapsible").collapsible(),e("select").material_select(),e(".dropdown-button").dropdown(),e(".char-counter").characterCounter(),e(".dropdown-button").dropdown(),e(".materialboxed").materialbox(),e(".modal").modal(),e(".slider").slider(),setTimeout(function(){e(".carousel").carousel(),e("ul.tabs").tabs()},250),e(".autocomplete").autocomplete({data:{1234:null,2345:null,3456:null,4567:null,5678:null},limit:20,minLength:1}),e(".chips").material_chip({data:[{tag:"Chip"},{tag:"Selected"}],autocompleteOptions:{data:{1234:null,2345:null,3456:null,4567:null,5678:null},limit:1/0,minLength:1}}),e(".chips .chip").each(function(){e(this).text().toLowerCase().indexOf("selected")>=0&&e(this).addClass("selected")}),e(".datepicker").pickadate({selectMonths:!0,selectYears:!0,min:!1,max:!0,format:"yyyy-mm-dd"}),e(".timepicker").pickatime({}),e("input[type=range]").each(function(){e(this).parent().removeClass("input-field").addClass("range-field").on("mousedown",function(){var t=e(this).children(".thumb");t.show();var a=function(){t.hide(),e(window).off("mouseup",a)};e(window).on("mouseup",a)})}),e("body").removeClass("hide")}})})});