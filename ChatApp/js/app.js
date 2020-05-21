// Message Controller
const MessageCtrl = (() => {
  // Message constructor
  const Message = function (id, name, message, timestamp, messageType) {
    this.id = id;
    this.name = name;
    this.message = message;
    this.timestamp = timestamp;
    this.messageType = messageType;
  }

  // Data Structure
   messages = [];

  // Public vars and functions
  return {
    getMessages: () => {
      return messages;
    },
    addMessageToStructure: (message) => {
      const newMessage = new Message(message.id, message.nameInput, message.messageInput, message.timestamp, message.messageType);
      messages.push(newMessage);
    },
    deleteMessageFromStructure: (ids) => {
      ids.forEach((id) => {
        if(id.classList.contains('msg-delete')) {
          messages.splice(id.firstElementChild.dataset.id - 1, 1);
        }
      });
    }
  }
})();


// UI Controller
const UICtrl = (() => {
  // Private vars and functions
  const UIElements = {
    sendRadio: ".send",
    replyRadio: ".reply",
    radioDiv: ".radioDiv",
    message: ".message",
    navigation: ".navigation",
    chatBegins: ".chat-body-begins",
    chatEnds: ".chat-body-ends",
    nameInput: ".name",
    messageInput: ".messageInput",
    sendBtn: ".sendBtn"
  }

  // Public vars and functions
  return {
    getUIElements: () => {
      return UIElements;
    },
    addMessageToUI: (message) => {
        // Create delete div with message
        const deleteDiv = document.createElement('div');
        deleteDiv.className = 'p delete';
        deleteDiv.innerHTML = `
          <div class="message message-${message.messageType} animated fadeIn" data-id="${message.id}">
            <span class="message-head">${message.nameInput}</span>
            <div class="message-body">${message.messageInput}</div>
            <span class="timestamp">${message.timestamp}</span>
          </div>
        `;
        const chatBegins = document.querySelector(UIElements.chatBegins);
        const chatEnds = document.querySelector(UIElements.chatEnds);
        //
        chatBegins.insertBefore(deleteDiv, chatEnds);
        UICtrl.clearInputs();
      },
      clearInputs: () => {
        document.querySelector(UIElements.nameInput).value = '';
        document.querySelector(UIElements.messageInput).value = '';
      },
      activateDeleteState: (e) => {
        // Ensure only one message can be highlighted
        // Add the message-delete class depending on where was clicked
        const selectedArea = e.target;
        if(document.querySelectorAll('.message-delete').length < 1) {
          if(selectedArea.classList.contains('message')) {
            selectedArea.parentElement.className = 'p delete message-delete msg-delete';
          } else if(selectedArea.classList.contains('message-head') ||
                    selectedArea.classList.contains('message-body') ||
                    selectedArea.classList.contains('timestamp')
                  ) {
            selectedArea.parentElement.parentElement.className = 'p delete message-delete msg-delete';
          }
        }
        // Put icons into the radioDiv
        document.querySelector(UIElements.radioDiv).innerHTML = '';
        // Create trashIcon and cancelIcon
        const trashIcon = document.createElement('i');
        trashIcon.className = 'fa fa-trash deleteMessage mr';
        const cancelIcon = document.createElement('i');
        cancelIcon.className = 'fa fa-times-circle cancel';

        document.querySelector(UIElements.radioDiv).appendChild(trashIcon);
        document.querySelector(UIElements.radioDiv).appendChild(cancelIcon);
      },
      deleteMessageFromUI: (ids) => {
        // Remove div and add fading effect
        ids.forEach((id) => {
          if(id.classList.contains('msg-delete')) {
            id.classList.remove("message-delete");
            id.firstElementChild.classList.add("fadeaway");
            setTimeout(() => {id.remove();}, 300);
          }
        });
        // Put radios back
        document.querySelector(UIElements.radioDiv).innerHTML = `
          <label class="custom-input m-0 mr-2">S
            <input type="radio" name="messageType" class="send">
            <span class="radio"></span>
          </label>
          <label class="custom-input m-0">R
            <input type="radio" name="messageType" class="reply">
            <span class="radio"></span>
          </label>
        `;
      },
      clearDeleteState: () => {
        // Remove message delete classes
        const allMessages = document.querySelectorAll(UIElements.message);
        allMessages.forEach((message) => {
          message.parentElement.classList.remove('message-delete');
          message.parentElement.classList.remove('msg-delete');
        });
        // Put radios back
        document.querySelector(UIElements.radioDiv).innerHTML = `
          <label class="custom-input m-0 mr-2">S
            <input type="radio" name="messageType" class="send">
            <span class="radio"></span>
          </label>
          <label class="custom-input m-0">R
            <input type="radio" name="messageType" class="reply">
            <span class="radio"></span>
          </label>
        `;
      }
  }
})();

// App Controller
const AppCtrl = (() => {
  function formatTime() {
    let hour = new Date().getHours();
    let minute = new Date().getMinutes();
    let newHour;
    let newMinute;
    let timeOfDay;

    // Get the time of day
    if(hour < 12) {
      timeOfDay = "AM";
    } else if(hour >= 12) {
      timeOfDay = "PM";
    }

    // Format Hour
    if(hour > 12) {
      newHour = hour - 12;
    } else if(hour === 12) {
      newHour = 00;
    } else {
      newHour = hour;
    }

    // Format minute
    if(minute < 10) {
      newMinute = `0${minute}`;
    } else {
      newMinute = minute;
    }
    return time = `${newHour}:${newMinute} ${timeOfDay}`;
  }

  const UIElements = UICtrl.getUIElements();

  const loadEventListeners = () => {
    // Set the message type to send
    document.addEventListener('DOMContentLoaded', setSendRadio);

    // Submit message
    document.querySelector(UIElements.sendBtn).addEventListener('click', submitMessage);

    // Message double click
    document.querySelector(UIElements.chatBegins).addEventListener('dblclick', messageDoubleClicked);

    // Clear delete state
    document.querySelector(UIElements.navigation).addEventListener('click', cancelIconClicked);

    // Delete icon clicked
    document.querySelector(UIElements.navigation).addEventListener('click', trashIconClicked);

    function setSendRadio() {
      document.querySelector(UIElements.sendRadio).checked = true;
    }

    function submitMessage() {
      formatTime();
      // Add new message to MessageCtrl
      const nameInput = document.querySelector(UIElements.nameInput).value;
      const messageInput = document.querySelector(UIElements.messageInput).value;
      let id = 0;
      const timestamp = time;
      let messageType;

      // Get the messages from the data Structure
      MessageCtrl.getMessages();

      // Check the array to set the id accordingly
      if(messages.length === 0) {
        id = 1;
      } else {
        id = messages[messages.length -1].id + 1;
      }

      if(document.querySelector(UIElements.sendRadio).checked === true) {
        messageType = "send";
      } else if(document.querySelector(UIElements.replyRadio).checked === true) {
        messageType = "reply";
      }

      const message = {id, nameInput, messageInput, timestamp, messageType}

      if (document.querySelector(UIElements.nameInput).value !== '' && document.querySelector(UIElements.messageInput).value) {
        // Add message to data Structure
        MessageCtrl.addMessageToStructure(message);

        // Add message to the UI
        UICtrl.addMessageToUI(message);
      }
    }

    function messageDoubleClicked(e) {
      if(e.target.classList.contains('message') ||
        e.target.classList.contains('message-head') ||
        e.target.classList.contains('message-body') ||
        e.target.classList.contains('timestamp')
        ) {
        UICtrl.activateDeleteState(e);
      }
    }

    function cancelIconClicked(e) {
      if(e.target.classList.contains('cancel')) {
        UICtrl.clearDeleteState();
        setSendRadio();
      }
    }

    function trashIconClicked(e) {
      if(e.target.classList.contains('deleteMessage')) {
        let ids = document.querySelectorAll('.p.delete');

        MessageCtrl.deleteMessageFromStructure(ids);
        UICtrl.deleteMessageFromUI(ids);
        setSendRadio();
      }
    }
  }

  // Public vars and functions
  return {
    init: () => {
      loadEventListeners();
    }
  }
})(MessageCtrl, UICtrl);

AppCtrl.init();
