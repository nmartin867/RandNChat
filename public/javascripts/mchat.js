(chat => {
    const chatWindow = document.getElementById('message-window');
    const inputText = document.getElementById('chat-input');
    const sendButton = document.getElementById('chat-button');

    chat.socketReady = false;

    console.info(`Connecting to Websocket: ${chat.wsHost}`);

    const ws = new WebSocket(chat.wsHost);

    ws.onopen = event => {
        console.info('WebSocket Opened');
        chat.socketReady = true;
        inputText.onkeyup = event => {
            console.log(event.target.value);
        };
        sendButton.onclick = event => {
            sendMessage();
        };
    }

    ws.onerror = event => {
        console.error('WebSocket error: ', event);
    };

    ws.onclose = event => {
        chat.socketReady = false;
        sendButton.disabled = true;
        console.info('WebSocket Closed');
    };

    ws.onmessage = event => {
        console.info('WebSocket Message: ', event);
        const message = JSON.parse(event.data);
        const messageElement = createMessageElement(message);

        chatWindow.appendChild(messageElement);
    };

    function createMessageElement(message) {
        const dateSpan = document.createElement('span');
        dateSpan.classList.add('message-date');

        const authorSpan = document.createElement('span');
        authorSpan.classList.add('author-name');

        const authorContainer = document.createElement('div');
        authorContainer.classList.add('message-auth-container');

        authorContainer.appendChild(dateSpan);
        authorContainer.appendChild(authorSpan);

        const messageSpan = document.createElement('span');
        messageSpan.classList.add('message-text');

        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message-text-container');

        messageContainer.appendChild(messageSpan);


        const container = document.createElement('div');
        container.classList.add('chat-message');

        container.appendChild(authorContainer);
        container.appendChild(messageContainer);

        return container;
    }

    function sendMessage() {
        const {authenticated, user} = mchat.session;
        const msg = inputText.value.trim();
        if(msg.length > 0 && authenticated) {
            const msgPayload = JSON.stringify({
                userid: user.id,
                message: msg
            });
            ws.send(msgPayload);
        }
    }

})(mchat);