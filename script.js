console.log("✅ script.js loaded successfully");

// ===============================
// ✅ Send Message Function
// ===============================
async function sendMessage() {

  let input = document.getElementById("userInput");
  let msg = input.value.trim();

  if (msg === "") return;

  let chatBox = document.getElementById("chatBox");

  input.disabled = true;

  // Show user message
  chatBox.innerHTML += `
    <div class="msg user">${escapeHTML(msg)}</div>
  `;

  input.value = "";

  // Bot placeholder
  let botDiv = document.createElement("div");
  botDiv.className = "msg bot";
  botDiv.innerHTML = `<p>🤖 Thinking...</p>`;
  chatBox.appendChild(botDiv);

  scrollToBottom(chatBox);

  try {

    let response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: msg })
    });

    let data = await response.json();

    if (!data.reply) {
      botDiv.innerHTML = "⚠️ No reply received";
      input.disabled = false;
      return;
    }

    // Bot reply
    botDiv.innerHTML = `
      <p>${escapeHTML(data.reply)}</p>
    `;

    // ✅ Update Related Links Safely
    let yt = document.getElementById("youtubeLink");
    let ig = document.getElementById("instagramLink");

    if (yt && data.youtube) {
      yt.href = data.youtube;
      yt.innerText = "Open YouTube Results";
    }

    if (ig && data.instagram) {
      ig.href = data.instagram;
      ig.innerText = "Open Instagram Tag";
    }

  } catch (err) {
    botDiv.innerHTML = "❌ Server not responding.";
  }

  input.disabled = false;
  input.focus();
  scrollToBottom(chatBox);
}

// ===============================
// ✅ Voice Function (Desktop Only)
// ===============================
function startVoice() {

  let isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobile) {
    alert("⚠️ Voice input not supported properly on Android. Use Chromebook/Desktop.");
    return;
  }

  if (!("webkitSpeechRecognition" in window)) {
    alert("❌ Voice recognition not supported.");
    return;
  }

  let recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";

  recognition.start();

  document.getElementById("userInput").placeholder =
    "🎤 Listening... Speak now";

  recognition.onresult = function (event) {
    document.getElementById("userInput").value =
      event.results[0][0].transcript;
  };

  recognition.onend = function () {
    document.getElementById("userInput").placeholder =
      "Type your message...";
  };
}

// ===============================
// ✅ Clear Chat
// ===============================
function clearChat() {
  document.getElementById("chatBox").innerHTML = "";
}

// ===============================
// ✅ Scroll Bottom
// ===============================
function scrollToBottom(chatBox) {
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ===============================
// ✅ Escape HTML
// ===============================
function escapeHTML(text) {
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ===============================
// ✅ Enter Key Support
// ===============================
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("userInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") sendMessage();
  });
});
