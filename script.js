// ===============================
// ✅ Voice Input Function (Mobile Safe Fix)
// ===============================
function startVoice() {

  // 🔊 Play Mic Click Sound
  let sound = new Audio("click.mp3");
  sound.play();

  // ✅ Detect Mobile Device
  let isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // ❌ Mobile Voice Not Supported Properly
  if (isMobile) {
    alert(
      "⚠️ Voice input is not supported properly on Android mobile browsers.\n\nUse Desktop/Chromebook for best results."
    );
    return;
  }

  // Check Browser Support
  if (!("webkitSpeechRecognition" in window)) {
    alert("❌ Voice recognition not supported in this browser.");
    return;
  }

  let recognition = new webkitSpeechRecognition();

  // Language Setting
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  // Start Voice Listening
  recognition.start();

  // Show Listening Status
  document.getElementById("userInput").placeholder =
    "🎤 Listening... Speak now";

  // When Voice Result Comes
  recognition.onresult = function (event) {
    let voiceText = event.results[0][0].transcript;

    document.getElementById("userInput").value = voiceText;

    document.getElementById("userInput").placeholder =
      "Type your message...";
  };

  // Better Error Handling
  recognition.onerror = function (event) {

    console.log("Voice Error:", event.error);

    alert("⚠️ Voice input failed. Please use Desktop Chrome.");

    document.getElementById("userInput").placeholder =
      "Type your message...";
  };

  // When Voice Stops
  recognition.onend = function () {
    document.getElementById("userInput").placeholder =
      "Type your message...";
  };
}
