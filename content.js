var chats = [];
var activeChat;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.DOM === "loaded") {
		initialize();
	}
});

function initialize() {
	$(function() {
		update();
		injectChatListeners();
	});
}

function update() {
	updateChats();
	updateActiveChat();
}

function updateChats() {
	$(".chat-title span").each(function(chatIndex) {
		chats.push($(this).text());
	});
	chats = $.unique(chats);
	console.log("chats: " + chats);
}

function updateActiveChat() {
	if ($(".message-list").length) { // there is an active chat
		injectMessageListeners();
		activeChat = $(".chat.active .chat-title span").first().text();
		console.log("active chat: " + activeChat);
		updateMessages();
	}
}

function updateMessages() {
	console.log("Updating messages...");
	$(".message-list .msg").each(function(messageIndex) {
		var number = $(this).find(".message-author .number").text();
		var name = $(this).find(".message-author .screen-name-text").text();
		
		// handle each message in a multi message 
		if ($(this).hasClass("msg-group")) { 
			$(".message-text-multi").each(function(submessageIndex) {
				var message = buildMessage(number, name, $(this));
				console.log(JSON.stringify(message));
			});
		} else {
			var message = buildMessage(number, name, $(this));
			console.log(JSON.stringify(message));
		}
	});
}

function injectChatListeners() {
	// WhatsApp web loads chats dynamically, so we need to listen for new chats
	// when the chat list changes.
	$(".chatlist:first-child").bind("DOMNodeInserted", function() {
		update();
	});
}

function injectMessageListeners() {
	// Same story for messages.
	$(".message-list").bind("DOMNodeInserted", function() {
		updateMessages();
	})
}

/* Factory method for message object. */
function buildMessage(number, name, node) {
	var message = {};
	message.number = number;
	message.name = name;
	message.text = node.find(".message-text > .selectable-text").text();
	// TODO include date in time
	message.time = node.find(".message-meta .message-datetime").text();
	return message;
}