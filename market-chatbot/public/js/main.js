const sendButton = document.querySelector("#sendButton");
const inputText = document.querySelector("#inputText");
const messagesContainer = document.querySelector("#messages");

const userId = Date.now() + Math.floor(777 + Math.random() * 7000);

const sendMessage = async () => {
  const message = inputText.value.trim();

  if (!message) return false;

  messagesContainer.innerHTML += `<div class="chat__message chat__message--user">${message}</div>`;
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  setTimeout(() => {
    messagesContainer.innerHTML += `<div class="chat__message chat__message--bot chat__message--typing"><div class="loader"></div></div>`;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, 500);

  inputText.value = "";

  try {
    const response = await fetch("/api/chatbot", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ userId, message }),
    });
    const data = await response.json();

    document.querySelector(".chat__message--typing").remove();

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
