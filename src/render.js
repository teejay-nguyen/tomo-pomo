document.addEventListener("DOMContentLoaded", () => {
  console.log("window.electronAPI:", window.electronAPI);

  let userMinutes = 25;
  let initialTime = userMinutes * 60;
  let timeLeft = initialTime;
  let countdownInterval = null;
  let studiedSeconds = 0;

  const timerElement = document.getElementById("timer");
  const setTimerBtn = document.getElementById("set-timer-btn");
  const startBtn = document.getElementById("start-btn");
  const pauseBtn = document.getElementById("pause-btn");
  const resetBtn = document.getElementById("reset-btn");
  const shortBreakBtn = document.getElementById("shortBreakBtn");
  const longBreakBtn = document.getElementById("longBreakBtn");
  const timeInput = document.getElementById("timeInput");
  const errorMsg = document.getElementById("errorMsg");

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
    if (countdownInterval || timeLeft <= 0) return;
    countdownInterval = setInterval(() => {
      timeLeft--;
      studiedSeconds++;
      updateTimerDisplay();

      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        window.electronAPI.saveStudyTime(studiedSeconds);
        studiedSeconds = 0;
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
    const input = timeInput.value.trim();
    const match = input.match(/^(\d{1,2}):([0-5]\d)$/);

    if (!match) {
      errorMsg.textContent =
        "Invalid time format. Use MM:SS format (e.g. 25:00).";
      return;
    }

    errorMsg.textContent = "";
    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);
    const totalSeconds = minutes * 60 + seconds;

    userMinutes = minutes; // Update global userMinutes variable

    setNewTimerFromSeconds(totalSeconds);
  }

  function setNewTimerFromSeconds(seconds) {
    clearInterval(countdownInterval);
    countdownInterval = null;
    initialTime = seconds;
    timeLeft = seconds;
    studiedSeconds = 0;
    updateTimerDisplay();
  }

  shortBreakBtn.addEventListener("click", () => {
    userMinutes = 5;
    timeLeft = userMinutes * 60;
    updateTimerDisplay();
    startCountdown();
  });

  longBreakBtn.addEventListener("click", () => {
    userMinutes = 15;
    timeLeft = userMinutes * 60;
    updateTimerDisplay();
    startCountdown();
  });

  setTimerBtn.addEventListener("click", setNewTimer);
  startBtn.addEventListener("click", startCountdown);
  pauseBtn.addEventListener("click", pauseCountdown);
  resetBtn.addEventListener("click", resetCountdown);

  updateTimerDisplay();

  document.getElementById("stats-btn").addEventListener("click", () => {
    window.electronAPI.openStatsWindow();
  });

  document.getElementById("close-btn").addEventListener("click", () => {
    window.electronAPI.closeApp();
  });

  document.getElementById("minimize-btn").addEventListener("click", () => {
    window.electronAPI.minimizeApp();
  });

  document.addEventListener("dblclick", (e) => {
    if (e.target.closest(".draggable")) {
      e.preventDefault();
    }
  });

  document.getElementById("timeInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      setTimerBtn.click();
    }
  });
});
