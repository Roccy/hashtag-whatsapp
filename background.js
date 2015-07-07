var urlRegex = /^https?:\/\/web.whatsapp\.com/;

/* When the browser-action button is clicked... */
chrome.browserAction.onClicked.addListener(function(tab) {
	if (urlRegex.test(tab.url)) {
		// ... send a message to the active WhatsApp tab
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {"DOM": "loaded"});
		});
	}
});