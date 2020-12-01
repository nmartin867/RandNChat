const connectToSocket = (host) => {
    return new Promise((resolve, reject) => {
        try {
            const socketHost = `ws://${host}`
            console.info(`Connecting to Websocket: ${socketHost}`);
            const ws = new WebSocket(socketHost);
            ws.onopen = () => resolve(ws);
            ws.onerror = reject;
        } catch (e) {
            reject(e);
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('message-window');
    const inputText = document.getElementById('chat-input');
    const sendButton = document.getElementById('chat-button');

    const host = window.location.host;

    connectToSocket(host).then((socket) => {
        /* WebSocket Event Handling*/

        const onSocketClose = event => {

        };

        const onSocketMessage = event => {
            console.info('WebSocket Message: ', event);
            try {
                const message = JSON.parse(event.data);

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
            } catch (e) {
                console.error('JSON parse error: ', e);
            }
        };

        const onSocketError = event => {
            console.error('WebSocket error: ', event);
        };

        sendButton.onclick = () => {
            const { authenticated, user } = mchat.session;
            const msg = inputText.value.trim();
            if(msg.length > 0 && authenticated) {
                const msgPayload = JSON.stringify({
                    userid: user.id,
                    message: msg
                });
                socket.send(msgPayload);
            }
        }
    });
});






