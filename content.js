var chats = [];
var activeChat;
var outgingAuthor = "you";

var hashtagPattern = /(^|[^0-9A-Z&/]+)(#|\uFF03)([0-9A-Z_]*[A-Z_]+[a-z0-9_\\u00c0-\\u00d6\\u00d8-\\u00f6\\u00f8-\\u00ff]*)/g;

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

// TODO include date
function updateMessages() {
	console.log("Updating messages...");

	$(".msg .message-text").each(function(messageIndex) {
		var msgContainer = $(this).parent().closest(".msg");
		var authorElem = msgContainer.find(".message-author span.emojitext");
		
		var message = {};

		// If there's an author the group is a group-chat or the message is 
		// outgoing.
		if (authorElem.length) { // group chat
			message.author = authorElem.text()
		} else if (msgContainer.hasClass("message-out")) { // outgoing message
			message.author = outgoingAuthor;
		} else { // private chat 
			message.author = activeChat
		};
		message.text = $(this).children(".emojitext").text();
		message.time = $(this).parent().find(".message-meta .message-datetime").text();
		
		console.log(message);
	});
}

function hyperlinkHashtags(element) {
	return elements
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