// --- Navigation Function ---
function goToPage(page) {
    window.location.href = page;
}

// --- Global Siren Setup ---
let siren = new Audio("https://www.soundjay.com/buttons/beep-01a.mp3");
siren.loop = true;

// --- Voice Alert ---
function playEmergencyAlarm() {
    const msg = new SpeechSynthesisUtterance("Emergency Alert. SOS Activated.");
    msg.rate = 1.2;
    window.speechSynthesis.speak(msg);
}

// 📩 Send Emergency Alert (WhatsApp)
function sendAlert() {

    let phone = "919174583190";

    // 🔴 Instant WhatsApp (fast + reliable)
    let baseMessage = "🚨 Emergency! I need help!";
    let url = `https://wa.me/${phone}?text=${encodeURIComponent(baseMessage)}`;
    window.open(url, "_self");

    // 🟡 Background location fetch (for logs / debug)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;

            let locationLink = `https://www.google.com/maps?q=${lat},${lon}`;
            console.log("Location:", locationLink);
        });
    }
}

// --- Panic Function ---
function triggerPanic() {
    console.log("SOS Triggered!");

    sendAlert(); // 📩 WhatsApp
    playEmergencyAlarm(); // 🔊 Voice

    document.body.classList.add("danger");

    // 🚨 Siren
    siren.play().catch(e => console.log("Audio play failed:", e));

    // 📍 Save location log
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;

            // ✅ FINAL CORRECT MAP LINK
            let locationLink = `https://www.google.com/maps?q=${lat},${lon}`;

            let log = {
                time: new Date().toLocaleString(),
                location: locationLink
            };

            let logs = JSON.parse(localStorage.getItem("logs")) || [];
            logs.push(log);
            localStorage.setItem("logs", JSON.stringify(logs));
        });
    }

    // 📞 Fake call screen
    setTimeout(() => {
        siren.pause();
        siren.currentTime = 0;
        window.location.href = "call.html";
    }, 4000);
}

// --- Event Listeners ---
document.addEventListener("DOMContentLoaded", () => {
    const panicBtn = document.getElementById("panicBtn");

    if (panicBtn) {
        panicBtn.addEventListener("click", triggerPanic);
    }

    if (document.getElementById("historyList")) {
        loadHistory();
    }
});

// --- Escape Mode ---
// --- Escape Mode (Press E 3 times) ---
let count = 0;

document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "e") {
        count++;
        if (count === 3) {
            document.body.innerHTML = `
                <div style="background:#1e1e1e; height:100vh; display:flex; justify-content:center; align-items:center;">
                    <div style="background:#2c2c2c; padding:20px; border-radius:15px; width:260px; box-shadow:0 0 20px rgba(0,0,0,0.5);">
                        
                        <input id="calcDisplay" type="text" value="0" readonly 
                        style="width:100%; height:50px; margin-bottom:10px; text-align:right; font-size:20px; padding:10px; border:none; border-radius:10px; background:#000; color:#0f0;">

                        <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:10px;">
                            ${["7","8","9","/","4","5","6","*","1","2","3","-","0",".","=","+"].map(val => `
                                <button onclick="calcInput('${val}')" 
                                style="padding:15px; font-size:16px; border:none; border-radius:10px; background:#444; color:white; cursor:pointer;">
                                    ${val}
                                </button>
                            `).join("")}
                        </div>

                        <button onclick="clearCalc()" 
                        style="margin-top:10px; width:100%; padding:10px; border:none; border-radius:10px; background:#ff4d4d; color:white;">
                            Clear
                        </button>
                    </div>
                </div>
            `;
        }
    }
});

// Calculator logic
function calcInput(val) {
    let display = document.getElementById("calcDisplay");

    if (display.value === "0") display.value = "";

    if (val === "=") {
        try {
            display.value = eval(display.value);
        } catch {
            display.value = "Error";
        }
    } else {
        display.value += val;
    }
}

function clearCalc() {
    document.getElementById("calcDisplay").value = "0";
}

// --- Speech Recognition ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        const transcript = event.results[event.resultIndex][0].transcript.toLowerCase();

        if (transcript.includes("help")) {
            console.log("Voice SOS triggered");
            triggerPanic();
        }
    };

    recognition.onend = () => recognition.start();

    window.addEventListener("load", () => {
        try {
            recognition.start();
        } catch (e) {
            console.log("Mic blocked:", e);
        }
    });
}
