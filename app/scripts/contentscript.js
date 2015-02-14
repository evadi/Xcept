'use strict';

(function () {

	var errors = [];
	var timer = null;

	/**
	 * Listens for our custom event to be raised by the inject
	 * script. 
	 */
	document.addEventListener('XceptError', function(e) {
		var error = e.detail;
		var lastError = errors[errors.length - 1];
		if(!lastError || (lastError.text !== error.text || lastError.url !== error.url || lastError.line !== error.line)) {
			errors.push(error);
			if(!timer) {
				timer = window.setTimeout(function() {
					timer = null;
					chrome.extension.sendRequest({
						errors: errors,
						host: window.location.host
					});
				}, 200);
			}
		}
	});

	/**
	 * Code which is injected into the page and allows communication
	 * back with the chrome app
	 */
	function injectErrorListener() {
		window.addEventListener('error', function(e) {
			if(e.filename) {
				document.dispatchEvent(new CustomEvent('XceptError', {
					detail: {
						stack: e.error ? e.error.stack : null,
						url: e.filename,
						line: e.lineno,
						col: e.colno,
						text: e.message
					}
				}));
			}
		});
	}

	//inject the code into the page using as a script tag
	var script = document.createElement('script');
	script.textContent = '(' + injectErrorListener + '())';
	(document.head || document.documentElement).appendChild(script);
	script.parentNode.removeChild(script);

})();
