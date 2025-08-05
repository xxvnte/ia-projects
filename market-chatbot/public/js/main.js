const sendButton = document.querySelector("#sendButton");
const inputText = document.querySelector("#inputText");
const messagesContainer = document.querySelector("#messages");

const sendMessage = async () => {
  const message = inputText.value.trim();

  if (!message) return false;

  messagesContainer.innerHTML += `<div class="chat__message chat__message--user">${message}</div>`;
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  inputText.value = "";
  try {
    const response = await fetch("/api/chatbot", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();

    messagesContainer.innerHTML += `<div class="chat__message chat__message--bot">${data.botResponse}</div>`;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  } catch (error) {
    console.error("Error:", error);
  }
};

sendButton.addEventListener("click", sendMessage);
inputText.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});
