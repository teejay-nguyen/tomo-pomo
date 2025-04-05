const { ipcRenderer } = require("electron");

let userMinutes = 25;
let initialTime = userMinutes * 60;
let timeLeft = 10;
let countdownInterval = null;
const timerElement = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");

function updateTimerDisplay() {
  timerElement.textContent = formatTime(timeLeft);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsRemaining = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secondsRemaining
    .toString()
    .padStart(2, "0")}`;
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

function pauseCountdown() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

function resetCountdown() {
  clearInterval(countdownInterval);
  countdownInterval = null;
  timeLeft = userMinutes * 60;
  updateTimerDisplay();
}

function setNewTimer() {
  userMinutes = parseInt(minutesInput.value, 10);
  if (!isNaN(userMinutes) && userMinutes > 0) {
    initialTime = userMinutes * 60;
    timeLeft = initialTime;
    clearInterval(countdownInterval);
    countdownInterval = null;
    updateTimerDisplay();
  }
}

setBtn.addEventListener("click", setNewTimer);
startBtn.addEventListener("click", startCountdown);
pauseBtn.addEventListener("click", pauseCountdown);
resetBtn.addEventListener("click", resetCountdown);

updateTimerDisplay();

document.getElementById("close-btn").addEventListener("click", () => {
  ipcRenderer.send("close-app");
});

document.getElementById("minimize-btn").addEventListener("click", () => {
  ipcRenderer.send("minimize-app");
});
