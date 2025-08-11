const sendButton = document.querySelector("#sendButton");
const selecButton = document.querySelector("#selectButton");

const generateAvatar = async () => {
  const avatar = selecButton.value.trim();

  if (!avatar) return false;

  const avatarBox = document.querySelector(".avatar-box");

  avatarBox.innerHTML = `<div class=loader></div>`;

  try {
    const response = await fetch("/api/gen-img", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ avatar }),
    });
    const data = await response.json();

    avatarBox.innerHTML = `<img src="${data.imageUrl}"/>`;
  } catch (error) {
    console.error("Error:", error);
  }
};

sendButton.addEventListener("click", generateAvatar);
