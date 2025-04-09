const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage('user', message);
  userInput.value = '';

  const loader = document.createElement('div');
  loader.className = 'bot-msg';
  loader.id = 'loading';
  loader.innerHTML = 'AI is typing<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>';
  chatBox.appendChild(loader);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    document.getElementById('loading')?.remove();
    appendMessage('bot', data.reply);
  } catch (err) {
    document.getElementById('loading')?.remove();
    appendMessage('bot', '❌ Error: Failed to get a response.');
    console.error(err);
  }
}

function appendMessage(sender, message) {
  const msgDiv = document.createElement('div');
  msgDiv.className = sender === 'user' ? 'user-msg' : 'bot-msg';
  msgDiv.textContent = message;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ✅ Enable sending on Enter key
userInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});
