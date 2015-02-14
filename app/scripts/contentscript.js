'use strict';

var xcept = (function () {

	var errors = [];
	var timer = null;
	var $this;

	function xcept() {
		$this = this;

		//start listening
		this.initialiseEvents();

		//inject code into the page
		var script = this.buildInjectCode();
		(document.head || document.documentElement).appendChild(script);
		script.parentNode.removeChild(script);
	}

	/**
	 * Attach any listeners
	 */
	xcept.prototype.initialiseEvents = function () {

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

	}

	/**
	 * Code which is injected into the page and allows communication
	 * back with the chrome app
	 */
	xcept.prototype.injectErrorListener = function () {
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

	/**
	 * Builds the script element that is to be added to the page
	 */
	xcept.prototype.buildInjectCode = function () {
		//inject the code into the page using as a script tag
		var script = document.createElement('script');
		script.textContent = '(' + $this.injectErrorListener + '())';	
		return script;
	}

	return xcept;

})();

//execute
var app = new xcept();
