const storageKey = "romantic-date-state";

const validNames = ["александра", "саша", "санек"];

function loadState() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    return {};
  }
}

function saveState(nextState) {
  localStorage.setItem(storageKey, JSON.stringify(nextState));
}

function isValidName(value) {
  const normalized = value.trim().toLowerCase();
  return normalized && validNames.some((item) => normalized === item || normalized.startsWith(item));
}

function goTo(page) {
  window.location.href = page;
}

function formatDate(dateValue) {
  const safeDate = new Date(dateValue);
  if (Number.isNaN(safeDate.getTime())) {
    return "дата не выбрана";
  }

  const day = String(safeDate.getDate()).padStart(2, "0");
  const month = String(safeDate.getMonth() + 1).padStart(2, "0");
  const year = safeDate.getFullYear();

  return `${day}.${month}.${year}`;
}

function formatSummaryText(state) {
  const place = state.place || "место не выбрано";
  const date = formatDate(state.date);
  const time = state.time || "время не выбрано";
  const name = state.name || "Милая";

  return `${name}, назначено свидание на ${date} в ${time} в ${place}.`;
}

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  const state = loadState();

  if (page === "index") {
    const form = document.getElementById("nameForm");
    const input = document.getElementById("nameInput");
    const errorMessage = document.getElementById("errorMessage");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = input.value;

      if (!isValidName(value)) {
        errorMessage.textContent = "Извините, но вас зовут не так";
        input.focus();
        return;
      }

      const nextState = { ...state, name: value.trim() };
      saveState(nextState);
      goTo("question.html");
    });

    return;
  }

  if (page === "question") {
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const zone = document.querySelector(".answer-zone");

    yesBtn.addEventListener("click", () => {
      const nextState = { ...state, answer: "Да" };
      saveState(nextState);
      goTo("place.html");
    });

    const moveNoButton = () => {
      const rect = zone.getBoundingClientRect();
      const maxX = Math.max(rect.width - noBtn.offsetWidth - 18, 0);
      const maxY = Math.max(rect.height - noBtn.offsetHeight - 18, 0);
      const x = Math.random() * maxX;
      const y = Math.random() * maxY;

      noBtn.style.position = "absolute";
      noBtn.style.left = `${x}px`;
      noBtn.style.top = `${y}px`;
    };

    noBtn.addEventListener("mouseenter", moveNoButton);
    noBtn.addEventListener("focus", moveNoButton);
    noBtn.addEventListener("click", (event) => {
      event.preventDefault();
      moveNoButton();
    });

    return;
  }

  if (page === "place") {
    const cards = document.querySelectorAll(".place-card");
    const customInput = document.querySelector(".custom-place-input");
    const customBtn = document.querySelector(".custom-place-btn");

    cards.forEach((card) => {
      if (card.classList.contains("custom-card")) {
        return;
      }

      card.addEventListener("click", () => {
        const selectedPlace = card.dataset.place || "Свой вариант";
        const nextState = { ...state, place: selectedPlace };
        saveState(nextState);
        goTo("date.html");
      });
    });

    const submitCustomPlace = () => {
      const customValue = customInput?.value.trim();
      const finalPlace = customValue || "Свой вариант";
      const nextState = { ...state, place: finalPlace };
      saveState(nextState);
      goTo("date.html");
    };

    customInput?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        submitCustomPlace();
      }
    });

    customBtn?.addEventListener("click", submitCustomPlace);

    return;
  }

  if (page === "date") {
    const dateOptions = document.getElementById("dateOptions");
    const timeOptions = document.getElementById("timeOptions");
    const continueBtn = document.getElementById("dateNextBtn");
    const monthLabel = document.getElementById("calendarMonthLabel");
    const prevMonthBtn = document.getElementById("prevMonthBtn");
    const nextMonthBtn = document.getElementById("nextMonthBtn");

    const startDate = new Date("2026-10-13T00:00:00");
    const endDate = new Date("2026-12-31T00:00:00");
    const monthNames = [
      "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
      "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ];
    const timeValues = [
      "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
      "20:00", "20:30", "21:00", "21:30", "22:00", "22:30",
      "23:00", "23:30"
    ];

    let currentMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    let selectedDateIso = startDate.toISOString();
    let selectedTimeValue = "18:00";

    function isWithinRange(date) {
      return date >= startDate && date <= endDate;
    }

    function renderCalendar() {
      dateOptions.innerHTML = "";
      monthLabel.textContent = `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;

      prevMonthBtn.disabled = currentMonth.getFullYear() === startDate.getFullYear() && currentMonth.getMonth() === startDate.getMonth();
      nextMonthBtn.disabled = currentMonth.getFullYear() === endDate.getFullYear() && currentMonth.getMonth() === endDate.getMonth();

      const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const firstDate = new Date(Math.max(monthStart.getTime(), startDate.getTime()));
      const lastDate = new Date(Math.min(monthEnd.getTime(), endDate.getTime()));

      for (let current = new Date(firstDate); current <= lastDate; current.setDate(current.getDate() + 1)) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "date-option";
        button.textContent = `${String(current.getDate()).padStart(2, "0")}.${String(current.getMonth() + 1).padStart(2, "0")}`;
        button.dataset.date = new Date(current.getFullYear(), current.getMonth(), current.getDate()).toISOString();

        if (button.dataset.date === selectedDateIso) {
          button.classList.add("selected");
        }

        button.addEventListener("click", () => {
          selectedDateIso = button.dataset.date;
          renderCalendar();
        });

        dateOptions.appendChild(button);
      }
    }

    function renderTimeOptions() {
      timeOptions.innerHTML = "";

      timeValues.forEach((timeValue) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "time-option";
        button.textContent = timeValue;

        if (timeValue === selectedTimeValue) {
          button.classList.add("selected");
        }

        button.addEventListener("click", () => {
          selectedTimeValue = timeValue;
          renderTimeOptions();
        });

        timeOptions.appendChild(button);
      });
    }

    prevMonthBtn.addEventListener("click", () => {
      const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
      if (isWithinRange(prevMonth)) {
        currentMonth = prevMonth;
        renderCalendar();
      }
    });

    nextMonthBtn.addEventListener("click", () => {
      const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
      if (isWithinRange(nextMonth)) {
        currentMonth = nextMonth;
        renderCalendar();
      }
    });

    renderCalendar();
    renderTimeOptions();

    continueBtn.addEventListener("click", () => {
      const nextState = { ...state, date: selectedDateIso, time: selectedTimeValue };
      saveState(nextState);
      goTo("final.html");
    });

    return;
  }

  if (page === "final") {
    const summaryText = document.getElementById("summaryText");
    const copyBtn = document.getElementById("copyBtn");

    const summary = formatSummaryText(state);
    summaryText.textContent = summary;

    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(summary);
        copyBtn.textContent = "Скопировано";
      } catch (error) {
        copyBtn.textContent = "Не удалось скопировать";
      }
    });
  }
});
