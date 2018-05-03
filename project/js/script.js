//ALL CHATS
var AllChatsController = (function () {
	
	var Chat = function (chatname, icon, id, messages) {
		this.chatname = chatname;
		this.icon = icon;
		this.id = id;
		this.messages = messages;
	};

	var Message = function (messageText, sendTime, type, id, sender) {
		this.messageText = messageText;
		this.sendTime = sendTime;
		this.type = type;
		this.id = id;
		this.sender = sender;
	};

	var chats = [];

	return {

		addChat: function (name, icon) {
			var newChat, ID, messages;

			//create id
			if (chats.length > 0) {
				ID = chats[chats.length - 1].id + 1;
			} else {
				ID = 0;
			}

			//create empty messages array
			messages = [];
			
			//create chat
			newChat = new Chat(name, icon, ID, messages);

			//add chat ot the chats array
			chats.push(newChat);

			//return new chat el
			return newChat;
		},

		deleteChat: function (ID) {
			var index, ids;

			ids = chats.map(function (current) {
				return current.id;
			});

			index = ids.indexOf(ID);

			if (index !== -1){
				chats.splice(index, 1);
			}	
		},

		deleteMessages: function (chat) {
			var deletingMessages, id; 
			var ids = [];

			deletingMessages = document.getElementsByClassName('current-chat__message-element--delete');

			for (var i = 0; i < deletingMessages.length; i++) {
				ids.push(deletingMessages[i].id.split('-')[1]);
			}

			for (var i = 0; i < ids.length; i++) {
				for (var k = 0; k < chat.messages.length; k++) {
					if (chat.messages[k].id == parseInt(ids[i])) {
						chat.messages.splice(k, 1);
					}
				}
			}
		},

		addMessage: function (text, type, sender, currentChat) {
			var newMessage, date, sendTime, type, ID;

			//create id
			if (currentChat.messages.length > 0) {
				ID = currentChat.messages[currentChat.messages.length - 1].id + 1;
			} else {
				ID = 0;
			}
			
			//define the send time
			date = new Date();
			sendTime = date.getHours() + ':' + (date.getMinutes()<10?'0':'') + date.getMinutes();

			// create message
			newMessage = new Message(text, sendTime, type, ID, sender);

			// add message to chat obj
			currentChat.messages.push(newMessage);

			return newMessage;
		},

		getChats: function() {
			return chats;
		},

		test: function () {
			return chats;
		}

	};


})();

//UI CONTROLLER
var UIController = (function () {

	var DOMStrings = {
		addChatBtn: '.all-chats__add-btn',
		popUpWindow: '.pop-up',
		popUpShadow: '.pop-shadow',
		popUpOk: '.pop-up__btn--ok',
		popUpCancel: '.pop-up__btn--cancel',
		popUpInput: '.pop-up__input',
		popUpIcons: 'pop-up__icon',
		chatOuter: '.current-chat__messages-outer',
		chatContainer: '.current-chat__messages-container',
		chatTop: '.current-chat__top',
		chatTopIcon: '.current-chat__chat-img',
		chatTopName: '.current-chat__chat-name',
		chatsList: '.all-chats__chats-list',
		chatEl: '.all-chats__list-el',
		sendBtn: '.current-chat__send-btn',
		textInput: '.current-chat__message-input',
		deleteChatBtn: '.all-chats__close-btn',
		deleteMessageBtn: '.current-chat__delete-btn'
	};


	
	return {

		getDOM: function () {
			return DOMStrings;
		},

		showPopUp: function () {
			document.querySelector(DOMStrings.popUpShadow).classList.add('pop-shadow--active');
			document.querySelector(DOMStrings.popUpWindow).classList.add('pop-up--active');
			document.querySelector(DOMStrings.popUpInput).focus();
		},

		hidePopUp: function () {
			document.querySelector(DOMStrings.popUpShadow).classList.remove('pop-shadow--active');
			document.querySelector(DOMStrings.popUpWindow).classList.remove('pop-up--active');
			document.querySelector(DOMStrings.popUpInput).value = '';
		},

		resetPopUpIcons: function (icons) {	
			for (var i = 0; i < icons.length; i++){
				icons[i].classList.remove('pop-up__icon--selected');
			}
		},

		popUpIconActive: function (icon) {
			icon.classList.add('pop-up__icon--selected');	
		},

		getPopUpData: function () {
			var icons = document.getElementsByClassName(DOMStrings.popUpIcons);
			for (var i = 0; i < icons.length; i++) {
				if (icons[i].classList.contains('pop-up__icon--selected')) {
					return {
						chatName: document.querySelector(DOMStrings.popUpInput).value,
						avatarId: document.querySelector('.pop-up__icon--selected').dataset.icon
					};
				}
			}
			return -1;
		},

		displayChat: function (chatObj) {
			var html, newHtml, chatsItems;

			chatsItems = document.getElementsByClassName('all-chats__list-el');
			for (var i = 0; i < chatsItems.length; i++){
				chatsItems[i].classList.remove('all-chats__list-el--active');
			}

			html = '<div class="all-chats__list-el all-chats__list-el--active" id="chat-%id%"><div class="all-chats__chat-icon"><img src="img/chat-icon-%icon%.png" alt="" class="all-chats__chat-img"></div><div class="all-chats__chat-main"><span class="all-chats__chat-name">%CHATNAME%</span><div class="all-chats__last-message"><span class="all-chats__last-message-author">Этот чат пока пуст</span><span class="all-chats__last-message-text"></span></div></div><div class="all-chats__chat-info"><div class="all-chats__last-message-time"></div></div><span class="all-chats__close-btn fa fa-times-circle"></span></div>';
			
			newHtml = html.replace('%id%', chatObj.id);
			newHtml = newHtml.replace('%icon%', chatObj.icon);
			newHtml = newHtml.replace('%CHATNAME%', chatObj.chatname);

			//Insert HTML into the DOM
			document.querySelector('.all-chats__chats-list').insertAdjacentHTML('beforeend', newHtml);
		},

		deleteChatItem: function (chatID) {
			var el = document.getElementById(chatID);
			el.classList.add('all-chats__list-el--hide');

			setTimeout(function() { el.parentNode.removeChild(el) }, 250);
			
		},

		clearChatWindow: function () {
			var chat = document.querySelector(DOMStrings.chatContainer);
			while (chat.firstChild) {
    			chat.removeChild(chat.firstChild);
			}
		},

		clearChatTop: function () {
			document.querySelector(DOMStrings.chatTopIcon).src= "";
			document.querySelector(DOMStrings.chatTopName).textContent = '';
		},

		clearInput: function () {
			document.querySelector(DOMStrings.textInput).value = '';
		},

		displayChatMessages: function (chatObj) {
			var messageHtml, newMessageHtml;

			messageHtml = '<div id="message-%messageid%" class="current-chat__message-element current-chat__message-element--%type%"><span class="current-chat__message-text">%message%</span><span class="current-chat__message-time">%sendtime%</span></div>';
			
			for (var i = 0; i < chatObj.messages.length; i++) {
				newMessageHtml = messageHtml.replace('%type%', chatObj.messages[i].type);
				newMessageHtml = newMessageHtml.replace('%messageid%', chatObj.messages[i].id);
				newMessageHtml = newMessageHtml.replace('%message%', chatObj.messages[i].messageText);
				newMessageHtml = newMessageHtml.replace('%sendtime%', chatObj.messages[i].sendTime);

				//Insert Message HTML into the DOM
				document.querySelector('.current-chat__messages-container').insertAdjacentHTML('beforeend', newMessageHtml);
			}	
		},

		displayChatTop: function (chatObj) {
			document.querySelector(DOMStrings.chatTopIcon).src = 'img/chat-icon-' + chatObj.icon +'.png';
			document.querySelector(DOMStrings.chatTopName).textContent = chatObj.chatname;
		},

		displayNewMessage: function (message, currentChat) {
			var messageHtml, newMessageHtml, chatsList, amountHtml, newAmountHtml;

			////chat
			messageHtml = '<div id="message-%messageid%" class="current-chat__message-element current-chat__message-element--%type%"><span class="current-chat__message-text">%message%</span><span class="current-chat__message-time">%sendtime%</span></div>';
			
			newMessageHtml = messageHtml.replace('%type%', message.type);
			newMessageHtml = newMessageHtml.replace('%messageid%', message.id);
			newMessageHtml = newMessageHtml.replace('%message%', message.messageText);
			newMessageHtml = newMessageHtml.replace('%sendtime%', message.sendTime);
			
			//Insert Message HTML into the DOM
			document.querySelector('.current-chat__messages-container').insertAdjacentHTML('beforeend', newMessageHtml);

			//// sidebar
			chatsList = document.querySelectorAll(DOMStrings.chatEl);

			for (var i = 0; i < chatsList.length; i++) {
				if ( chatsList[i].id == ('chat-' + currentChat.id) ) {
					chatsList[i].children[1].children[1].children[0].textContent = message.sender + ':';
					chatsList[i].children[1].children[1].children[1].textContent = ' ' + message.messageText;
					chatsList[i].children[2].children[0].textContent = message.sendTime;

					if (chatsList[i].children[2].children.length == 1) {
						amountHtml = '<div class="all-chats__messages-amount"><div class="all-chats__messages-amount-value">%1%</div></div>';
						newAmountHtml = amountHtml.replace('%1%', currentChat.messages.length);

						chatsList[i].children[2].insertAdjacentHTML('beforeend', newAmountHtml);
					} else {
						chatsList[i].children[2].children[1].children[0].textContent = currentChat.messages.length;
					}				
				}
			}	
		},

		messageScroll: function () {
			var containerOuter = document.querySelector(DOMStrings.chatOuter);
   			containerOuter.scrollTop = containerOuter.scrollHeight;
		},

		showChatDeleteBtn: function (event) {
			var item, chatsList;

			event.preventDefault();
	
			chatsList = document.querySelector(DOMStrings.chatsList);
			item = event.target;
	
			while (item != chatsList) {

			    if (item.classList[0] == 'all-chats__list-el') {
			    	
					if (event.which === 3 || event.button === 2) {
						item.classList.toggle('all-chats__list-el--delete');
						item.querySelector('.all-chats__close-btn').classList.toggle('all-chats__close-btn--move');
					}
	
		    		
		    		break;
		   		} else {
		    		item = item.parentNode;
		  	 	} 

			}
		},

		updateCounter: function (chat) {
			document.getElementById('chat-' + chat.id).children[2].children[1].children[0].textContent = chat.messages.length;
		},

		updateLastMessage: function (chat) {
			if (chat.messages.length > 0) {
				document.getElementById('chat-' + chat.id).children[1].children[1].children[1].textContent = chat.messages[chat.messages.length - 1].messageText;
			} else {
				document.getElementById('chat-' + chat.id).children[1].children[1].children[1].textContent = '';
			}
		},

		updateTime: function (chat) {
			if (chat.messages.length > 0) {
				document.getElementById('chat-' + chat.id).children[2].children[0].textContent = chat.messages[chat.messages.length - 1].sendTime;
			} else {
				document.getElementById('chat-' + chat.id).children[2].children[0].textContent = '--:--';
			}
		},

		updateAuthor: function (chat) {
			if (chat.messages.length > 0) {
				document.getElementById('chat-' + chat.id).children[1].children[1].children[0].textContent = chat.messages[chat.messages.length - 1].sender + ':';
			} else {
				document.getElementById('chat-' + chat.id).children[1].children[1].children[0].textContent = 'Этот чат пока пуст';
			}
		},

		showMessageDeleteBtn: function (event) {
			var item, messagesContainer;

			event.preventDefault();
	
			messagesContainer = document.querySelector(DOMStrings.chatContainer);
			item = event.target;
	
			while (item != messagesContainer) {

			    if (item.classList[0] == 'current-chat__message-element') {
			    	
					if (event.which === 3 || event.button === 2) {
						item.classList.toggle('current-chat__message-element--delete');

						var messages = document.getElementsByClassName('current-chat__message-element');

						for (var i = 0; i < messages.length; i++) {
							if (messages[i].classList.contains('current-chat__message-element--delete')) {
								document.querySelector('.current-chat__delete-btn').classList.add('current-chat__delete-btn--move');
								break;
							} else {
								document.querySelector('.current-chat__delete-btn').classList.remove('current-chat__delete-btn--move');
							}				
						}					

						
					}
	
		    		
		    		break;
		   		} else {
		    		item = item.parentNode;
		  	 	} 

			}
		}
		

	};

})();


// APP CONTROLER
var AppController = (function (AllCtrl, UICtrl) {

	var DOM = UICtrl.getDOM();
	var currentChat = -1;

	var setupEventListeners = function () {
		var icons = document.getElementsByClassName(DOM.popUpIcons);

		document.querySelector(DOM.addChatBtn).addEventListener('click', UICtrl.showPopUp);
		document.querySelector(DOM.popUpOk).addEventListener('click', function () {
			addNewChat();
			UICtrl.resetPopUpIcons(icons);
			UICtrl.hidePopUp();
		});
		document.addEventListener('keypress', function (event) {
			if ( event.keyCode === 13 || event.which === 13) {
				if (document.querySelector('.pop-up--active')){
					addNewChat();
					UICtrl.resetPopUpIcons(icons);
					UICtrl.hidePopUp();
				}
			}
		});


		document.querySelector(DOM.popUpCancel).addEventListener('click', function () {
			UICtrl.resetPopUpIcons(icons);
			UICtrl.hidePopUp();
		});
		
		for(var i = 0; i < icons.length; i++){
			icons[i].addEventListener('click', function () {
				UICtrl.resetPopUpIcons(icons);
				UICtrl.popUpIconActive(this);
			});
		}

		document.querySelector(DOM.chatsList).addEventListener('click', selectChat);

		document.querySelector(DOM.chatsList).addEventListener('contextmenu', UICtrl.showChatDeleteBtn);
		document.addEventListener('click', function (event) {

			if (document.querySelector(DOM.chatsList).contains(event.target)){
 				return;
 			} else {
 			  	var chats = document.getElementsByClassName('all-chats__list-el');

				for (var i = 0; i < chats.length; i++) {
					chats[i].classList.remove('all-chats__list-el--delete');
					chats[i].querySelector('.all-chats__close-btn').classList.remove('all-chats__close-btn--move');
				}
  			}
		
		});

		document.querySelector(DOM.chatContainer).addEventListener('contextmenu', UICtrl.showMessageDeleteBtn);
		document.addEventListener('click', function (event) {

			if (document.querySelector(DOM.chatContainer).contains(event.target)){
				console.log('outside');
 				return;
 			} else {
 				console.log('inside');
 			  	var messages = document.getElementsByClassName('current-chat__message-element');

				for (var i = 0; i < messages.length; i++) {
					messages[i].classList.remove('current-chat__message-element--delete');
					document.querySelector('.current-chat__delete-btn').classList.remove('current-chat__delete-btn--move');
				}
  			}
		
		});

		document.querySelector(DOM.chatsList).addEventListener('click', ctrlDeleteChat);
		document.querySelector(DOM.deleteMessageBtn).addEventListener('click', ctrlDeleteMessages);

		document.querySelector(DOM.sendBtn).addEventListener('click', sendMessage);

		document.addEventListener('keypress', function (event) {
			if ( event.keyCode === 13 || event.which === 13) {
				sendMessage();
			}
		});

	};


	var addNewChat = function () {
		var input, newChat;

		//get inputs
		input = UICtrl.getPopUpData();

		if (input != -1 && input.chatName !== '') {
			
			//create chat object
			newChat = AllCtrl.addChat(input.chatName, input.avatarId);

			currentChat = newChat;

			//Clear prev chat messages and chat top in UI
			UICtrl.clearChatWindow();
			UICtrl.clearChatTop();

			// clear input field
			UICtrl.clearInput();

			//display chat in list UI
			UICtrl.displayChat(newChat);

			//display new chat in chat top
			UICtrl.displayChatTop(newChat);

			//display chat messages in UI
			UICtrl.displayChatMessages(newChat);

			// focus on input
			document.querySelector(DOM.textInput).focus();	

		}				
	};

	var ctrlDeleteChat = function (event) {
		var itemID, ID;

		if (event.target.classList[0] == 'all-chats__close-btn') {
			itemID = event.target.parentNode.id;
		}
	
		if (itemID) {
			ID = parseInt(itemID.split('-')[1]);

			// 1. Delete item from data
			AllCtrl.deleteChat(ID);

			// 2. Delete item from UI
			UICtrl.deleteChatItem(itemID);

			// clear chat window
			UICtrl.clearChatWindow();
			UICtrl.clearChatTop();

			// clear input field
			UICtrl.clearInput();
		}
	};

	var ctrlDeleteMessages = function () {

		// 1. Delete item from data
		AllCtrl.deleteMessages(currentChat);

		// clear chat window
		UICtrl.clearChatWindow();

		//display chat messages in UI
		UICtrl.displayChatMessages(currentChat);
	
		document.querySelector('.current-chat__delete-btn').classList.remove('current-chat__delete-btn--move');

		// update Counter
		UICtrl.updateCounter(currentChat);

		// update last message
		UICtrl.updateLastMessage(currentChat);

		// update time
		UICtrl.updateTime(currentChat);

		// update author
		UICtrl.updateAuthor(currentChat);
	};

	var selectChat = function (event) {
		var item, chatsList, chatsArray, chatsItems;

		chatsList = document.querySelector(DOM.chatsList);
		item = event.target;

		while (item != chatsList) {
		    if (item.classList[0] == 'all-chats__list-el') {
		    	chatsArray = AllCtrl.getChats();

		    	UICtrl.clearChatWindow();
				UICtrl.clearChatTop();

		    	// clear input field
				UICtrl.clearInput();

				chatsItems = document.getElementsByClassName('all-chats__list-el');
				for (var i = 0; i < chatsItems.length; i++){
					chatsItems[i].classList.remove('all-chats__list-el--active');
				}

				item.classList.toggle('all-chats__list-el--active');


		    	for (var i = 0; i < chatsArray.length; i++) {

		    		if (chatsArray[i].id == item.id[item.id.length -1]) {
		    			currentChat = chatsArray[i];

						//display new chat in chat top
						UICtrl.displayChatTop(currentChat);
			
						//display chat messages in UI
						UICtrl.displayChatMessages(currentChat);

						// scroll to the bottom
						UICtrl.messageScroll();

						// focus on input
						document.querySelector(DOM.textInput).focus();	
		    		}
		    	}

		    	break;
		    } else {
		    	item = item.parentNode;
		    } 
		}
	};

	var sendMessage = function () {
		var textInput, message, type, sender;

		type = 0;
		sender = 'You';

		// get text input
		textInput = document.querySelector(DOM.textInput).value;

		// clear input field
		UICtrl.clearInput();

		// get chat to add message to
		
		if (textInput !== '' && currentChat != -1) {
			// create new message obj
			message = AllCtrl.addMessage(textInput, type, sender, currentChat);
	
			// show new message in UI
			UICtrl.displayNewMessage(message, currentChat);

			// scroll to the bottom
			UICtrl.messageScroll();

			// focus on input
			document.querySelector(DOM.textInput).focus();	
		}
		

	};


	return {
		init: function () {
			console.log('App started');
			setupEventListeners();
			UICtrl.clearChatWindow();
			UICtrl.clearChatTop();
		}
	};

})(AllChatsController, UIController);

AppController.init();

//console.log('!!!');