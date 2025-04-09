document.addEventListener("DOMContentLoaded", () => {
  console.log("window.electronAPI:", window.electronAPI);

  let userMinutes = 25;
  let initialTime = userMinutes * 60;
  let timeLeft = initialTime;
  let countdownInterval = null;
  let studiedSeconds = 0;
  let isStudySession = true; // Defaults to true for regular sessions

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
      if (isStudySession) {
        studiedSeconds++;

        if (studiedSeconds % 30 === 0) {
          window.electronAPI.saveStudyTime(studiedSeconds);
          studiedSeconds = 0; // Reset after logging
        }
      }
      updateTimerDisplay();

      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        countdownInterval = null;

        if (isStudySession) {
          // Log the remaining time if the total time is not divisible by 30
          window.electronAPI.saveStudyTime(studiedSeconds);
          studiedSeconds = 0;
        }
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
    timeLeft = initialTime;
    studiedSeconds = 0;
    isStudySession = true;
    updateTimerDisplay();
  }

  function setNewTimer() {
    const input = timeInput.value.trim();
    let totalSeconds;

    const mmssMatch = input.match(/^(\d{1,2}):([0-5]\d)$/);
    const secondsOnlyMatch = input.match(/^(\d{1,3})$/);

    if (mmssMatch) {
      const minutes = parseInt(mmssMatch[1], 10);
      const seconds = parseInt(mmssMatch[2], 10);
      totalSeconds = minutes * 60 + seconds;
    } else if (secondsOnlyMatch) {
      totalSeconds = parseInt(secondsOnlyMatch[1], 10);
    } else {
      errorMsg.textContent =
        "Invalid time format. Use MM:SS or SS format (e.g. 25:00 or 45).";
      return;
    }

    errorMsg.textContent = "";
    userMinutes = Math.floor(totalSeconds / 60); // Update global
    initialTime = totalSeconds;
    timeLeft = totalSeconds;
    setNewTimerFromSeconds(totalSeconds);
  }

  function setNewTimerFromSeconds(seconds) {
    clearInterval(countdownInterval);
    countdownInterval = null;
    initialTime = seconds;
    timeLeft = seconds;
    studiedSeconds = 0;
    isStudySession = true;
    updateTimerDisplay();
  }

  shortBreakBtn.addEventListener("click", () => {
    isStudySession = false;
    userMinutes = 5;
    initialTime = userMinutes * 60;
    timeLeft = userMinutes * 60;
    updateTimerDisplay();
  });

  longBreakBtn.addEventListener("click", () => {
    isStudySession = false;
    userMinutes = 15;
    initialTime = userMinutes * 60;
    timeLeft = userMinutes * 60;
    updateTimerDisplay();
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
