window.args = {
	theme: ''
};

window.location.search.split(/[?&]/)
	.forEach(function(arg) {
		arg = arg.split('=');
		if(arg.length === 2) {
			window.args[arg[0]] = decodeURIComponent(arg[1]);
		}
	});
