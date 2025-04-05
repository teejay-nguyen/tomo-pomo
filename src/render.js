const { ipcRenderer } = require("electron");

document.getElementById("close-btn").addEventListener("click", () => {
  ipcRenderer.send("close-app");
});

document.getElementById("minimize-btn").addEventListener("click", () => {
  ipcRenderer.send("minimize-app");
});

let timeLeft = 10;
const timerElement = document.getElementById("timer");

const countdown = setInterval(() => {
  timeLeft--;
  timerElement.textContent = timeLeft;

  if (timeLeft <= 0) {
    clearInterval(countdown);
    timerElement.textContent = "Time's up!";
  }
}, 1000);
