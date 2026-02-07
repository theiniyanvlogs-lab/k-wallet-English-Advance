// ===============================
// ✅ Voice Input Function (Final Safe Version)
// ===============================
function startVoice() {

  // ✅ Detect Mobile Device
  let isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // ❌ Android/iPhone Browsers Do Not Support Proper Speech API
  if (isMobile) {
    alert(
      "⚠️ Voice input is not working properly on Android/iPhone browsers.\n\nPlease use Chromebook/Desktop Chrome for Voice Support."
    );
    return;
  }

  // ✅ Play Mic Click Sound (Desktop Only)
  try {
    let sound = new Audio("click.mp3");
    sound.play();
  } catch (e) {
    console.log("Sound play blocked:", e);
  }

  // ✅ Check Browser Support
  if (!("webkitSpeechRecognition" in window)) {
    alert("❌ Voice recognition not supported in this browser.");
    return;
  }

  // ✅ Create Recognition Object
  let recognition = new webkitSpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  // ✅ Start Listening
  recognition.start();

  // UI Update
  let inputBox = document.getElementById("userInput");
  inputBox.placeholder = "🎤 Listening... Speak now";

  // ===============================
  // ✅ Voice Result
  // ===============================
  recognition.onresult = function (event) {
    let voiceText = event.results[0][0].transcript;

    // Put voice text into input box
    inputBox.value = voiceText;

    // Restore placeholder
    inputBox.placeholder = "Type your message...";
  };

  // ===============================
  // ✅ Voice Error Handling
  // ===============================
  recognition.onerror = function (event) {

    console.log("Voice Error:", event.error);

    if (event.error === "not-allowed") {
      alert("❌ Microphone permission denied. Please allow mic access.");
    }
    else if (event.error === "network") {
      alert("⚠️ Speech service network error. Try again.");
    }
    else {
      alert("⚠️ Voice input failed. Use Desktop Chrome.");
    }

    inputBox.placeholder = "Type your message...";
  };

  // ===============================
  // ✅ When Voice Stops
  // ===============================
  recognition.onend = function () {
    inputBox.placeholder = "Type your message...";
  };
}
