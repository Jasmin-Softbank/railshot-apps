const form = document.querySelector('#chat-form');
const input = document.querySelector('#message');
const messages = document.querySelector('#messages');
const error = document.querySelector('#error');
const button = form.querySelector('button');

function bubble(text, kind) {
  const item = document.createElement('p');
  item.className = `bubble ${kind}`;
  item.textContent = text;
  messages.append(item);
  messages.scrollTop = messages.scrollHeight;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const message = input.value.trim();
  if (!message) return;
  error.hidden = true;
  input.value = '';
  button.disabled = true;
  bubble(message, 'user');
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || '응답을 받지 못했습니다.');
    bubble(result.reply, 'bot');
  } catch (cause) {
    error.textContent = cause.message;
    error.hidden = false;
  } finally {
    button.disabled = false;
    input.focus();
  }
});
