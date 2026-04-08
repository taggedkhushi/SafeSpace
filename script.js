// Navigation Function
function goToPage(page) {
  window.location.href = page;
}

// Panic Button 
const panicBtn = document.getElementById("panicBtn");

if (panicBtn) {
  panicBtn.addEventListener("click", () => {

    // 🔴 danger mode
    document.body.classList.add("danger");

    // 🚨 Siren Sound
    let siren = new Audio("assets/sounds/siren.mp3");
    siren.loop = true;
    siren.play();

    // 📍 Get Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        let locationLink = `https://maps.google.com/?q=${lat},${lon}`;

        // 📝 Save log
        let log = {
          time: new Date().toLocaleString(),
          location: locationLink
        };

        let logs = JSON.parse(localStorage.getItem("logs")) || [];
        logs.push(log);
        localStorage.setItem("logs", JSON.stringify(logs));

        console.log("Location saved:", locationLink);
      });
    }

    // 📞 Fake Call Screen
    setTimeout(() => {
      siren.pause();   // stop siren before call
      window.location.href = "pages/call.html";
    }, 3000);

  }); 
}

// 📝 Save Report
function saveReport() {
  let name = document.getElementById("name").value;
  let issue = document.getElementById("issue").value;

  let report = {
    name: name,
    issue: issue,
    time: new Date().toLocaleString()
  };

  let reports = JSON.parse(localStorage.getItem("reports")) || [];
  reports.push(report);
  localStorage.setItem("reports", JSON.stringify(reports));

  alert("Report saved successfully!");

  // Clear form
  document.getElementById("name").value = "";
  document.getElementById("issue").value = "";
}

// 📂 Show History Logs
function loadHistory() {
  let logs = JSON.parse(localStorage.getItem("logs")) || [];
  let container = document.getElementById("historyList");

  if (container) {
    container.innerHTML = "";

    logs.forEach((log) => {
      let div = document.createElement("div");
      div.innerHTML = `
        <p><strong>Time:</strong> ${log.time}</p>
        <p><a href="${log.location}" target="_blank">View Location</a></p>
        <hr>
      `;
      container.appendChild(div);
    });
  }
}

// 📝 Show Reports
function loadReports() {
  let reports = JSON.parse(localStorage.getItem("reports")) || [];
  let container = document.getElementById("reportList");

  if (container) {
    container.innerHTML = "";

    reports.forEach((r) => {
      let div = document.createElement("div");
      div.innerHTML = `
        <p><strong>Name:</strong> ${r.name}</p>
        <p><strong>Issue:</strong> ${r.issue}</p>
        <p><strong>Time:</strong> ${r.time}</p>
        <hr>
      `;
      container.appendChild(div);
    });
  }
}

// 🕵️ Escape Mode (press E 3 times)
let count = 0;

document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "e") {
    count++;
    if (count === 3) {
      document.body.innerHTML = `
        <h2>Calculator</h2>
        <input type="text" placeholder="0">
      `;
    }
  }
});