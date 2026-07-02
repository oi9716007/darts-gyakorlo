// ===== Access lock =====
// Simple client-side gate so a random visitor with the link can't just open
// the app. NOT real security (the code is visible in this file to anyone
// who looks) - it's a friendly filter for sharing with people you choose.
const AccessLock = (() => {
  const ACCESS_CODE = "darts007";
  const STORAGE_KEY = "darts-app-unlocked";

  const el = {
    lockScreen: document.getElementById("screen-lock"),
    menuScreen: document.getElementById("screen-menu"),
    input: document.getElementById("lock-input"),
    submit: document.getElementById("lock-submit"),
    error: document.getElementById("lock-error"),
  };

  function unlock() {
    localStorage.setItem(STORAGE_KEY, "true");
    el.lockScreen.classList.remove("active");
    el.menuScreen.classList.add("active");
  }

  function tryUnlock() {
    if (el.input.value === ACCESS_CODE) {
      el.error.classList.add("hidden");
      unlock();
    } else {
      el.error.classList.remove("hidden");
      el.input.value = "";
      el.input.focus();
    }
  }

  // Already unlocked on this device before: skip straight to the menu
  function init() {
    if (localStorage.getItem(STORAGE_KEY) === "true") {
      unlock();
    }
  }

  el.submit.addEventListener("click", tryUnlock);
  el.input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") tryUnlock();
  });

  init();
  return {};
})();
