'use strict';

/**
 * Hide the pageAction icon when the tab is updated as there may not be
 * any errors
 */
chrome.tabs.onUpdated.addListener(function (tabId) {
  chrome.pageAction.hide(tabId);
});

/**
 * Listens for requests from page scripts. If errors exist on pages
 * then the pageAction icon is shown
 */
chrome.extension.onRequest.addListener(function(request, sender) {
	if (request.errors) {
		console.log(request.errors);
		var hasErrors = request.errors.length > 0;
		if (hasErrors) {
			//show the error icon
			chrome.pageAction.show(sender.tab.id);
		}
		else {
			//hide the icon just for good measure
			chrome.pageAction.hide(sender.tab.id);
		}
	}
});