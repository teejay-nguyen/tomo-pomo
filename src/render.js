const { ipcRenderer } = require("electron");

document.getElementById("close-btn").addEventListener("click", () => {
  ipcRenderer.send("close-app");
});

document.getElementById("minimize-btn").addEventListener("click", () => {
  ipcRenderer.send("minimize-app");
});

let timeLeft = 10;
let countdownInterval = null;
const timerElement = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");

function updateTimerDisplay() {
  timerElement.textContent = timeLeft > 0 ? timeLeft : "Time's up!";
}

function startCountdown() {
  if (countdownInterval) return;
  countdownInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  }, 1000);
}

function resetCountdown() {
  clearInterval(countdownInterval);
  countdownInterval = null;
  timeLeft = 10;
  updateTimerDisplay();
}

startBtn.addEventListener("click", startCountdown);
resetBtn.addEventListener("click", resetCountdown);

updateTimerDisplay();

// const countdown = setInterval(() => {
//   timeLeft--;
//   timerElement.textContent = timeLeft;

//   if (timeLeft <= 0) {
//     clearInterval(countdown);
//     timerElement.textContent = "Time's up!";
//   }
// }, 1000);
