app.animation('.fold-animation', ['$animateCss', function($animateCss) {
	var duration = 0.25;
	var easing = 'ease-out';
	var properties = [ 'width', 'height' ];

	function addAnimation(show, hide, property, el) {
		var maxProperty = 'max-' + property;
		show[maxProperty] = el[property]() + 'px';
		hide[maxProperty] = '0px';
	}

	function getAnimation(el, leave) {
		var hideFrame = leave ? 'to': 'from';
		var showFrame = leave ? 'from': 'to';

		var show = {};
		var hide = { overflow: 'hidden' };

		var direction = +(el.width() / el.parent().width() > 0.5);

		addAnimation(show, hide, properties[direction], el);

		var siblings = el.siblings('.fold-animation');
		if(!siblings.length) {
			addAnimation(show, hide, properties[1 - direction], el);
		}

		var ret = {
			easing: easing,
			duration: duration
		};

		ret[hideFrame] = hide;
		ret[showFrame] = show;

		return ret;
	}

	return {
		enter: function(el, done) {
			return $animateCss(el, getAnimation(el))
				.start()
				.done(function() {
					el.css({
						'max-width': '',
						'max-height': '',
						'overflow': ''
					});
					done();
				});
		},
		leave: function(el/*, done*/) {
			return $animateCss(el, getAnimation(el, true));
		}
	};
}]);
