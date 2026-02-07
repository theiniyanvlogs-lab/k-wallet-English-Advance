console.log("✅ Script Loaded");

// ===============================
// ✅ Send Message
// ===============================
async function sendMessage() {

  let input = document.getElementById("userInput");
  let msg = input.value.trim();

  if (msg === "") return;

  let chatBox = document.getElementById("chatBox");

  // User Message
  chatBox.innerHTML += `
    <div class="msg user">${escapeHTML(msg)}</div>
  `;

  input.value = "";

  // Bot Placeholder
  let botDiv = document.createElement("div");
  botDiv.className = "msg bot";
  botDiv.innerHTML = "🤖 Thinking...";
  chatBox.appendChild(botDiv);

  scrollToBottom();

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
      botDiv.innerHTML = "⚠️ No reply received.";
      return;
    }

    // Bot Reply + Buttons
    botDiv.innerHTML = `
      <p>${escapeHTML(data.reply)}</p>

      <div class="bot-links">
        <a href="${data.youtube}" target="_blank" class="yt-btn">
          📺 YouTube
        </a>

        <a href="${data.instagram}" target="_blank" class="insta-btn">
          📸 Instagram
        </a>
      </div>
    `;

  } catch (err) {
    botDiv.innerHTML = "❌ Server Error.";
  }

  scrollToBottom();
}

// ===============================
// ✅ Voice Input (Desktop Only Support)
// ===============================
function startVoice() {

  if (!("webkitSpeechRecognition" in window)) {
    alert("⚠️ Voice not supported on this device.");
    return;
  }

  let recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";

  recognition.start();

  recognition.onresult = function (event) {
    document.getElementById("userInput").value =
      event.results[0][0].transcript;
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
function scrollToBottom() {
  let chatBox = document.getElementById("chatBox");
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
