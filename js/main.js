// ===== Main navigation =====
// Switches between the main menu and the game modes.
// Each game runs its own init() on entry, so states never mix.
(() => {
  const screens = document.querySelectorAll(".screen");
  const rtModal = document.getElementById("rt-modal");
  const btModal = document.getElementById("bt-modal");
  const langToggle = document.getElementById("lang-toggle");
  const langMenu = document.getElementById("lang-menu");
  const infoModal = document.getElementById("info-modal");
  const infoTitle = document.getElementById("info-title");
  const infoText = document.getElementById("info-text");

  function showScreen(id) {
    screens.forEach(s => s.classList.toggle("active", s.id === id));
    window.scrollTo(0, 0);
  }

  function openGame(game) {
    if (game === "random") {
      showScreen("screen-random");
      RandomTarget.init(); // opens the settings modal
    } else if (game === "around") {
      showScreen("screen-around");
      AroundBoard.init();
    } else if (game === "calculate") {
      showScreen("screen-calculate");
      Calculate.init();
    } else if (game === "battle") {
      showScreen("screen-battle");
      Battle.init(); // opens the setup modal
    }
  }

  // Main menu cards (Enter key works too, since the cards are divs)
  document.querySelectorAll(".bubble-card").forEach(card => {
    card.addEventListener("click", () => openGame(card.dataset.game));
    card.addEventListener("keydown", e => { if (e.key === "Enter") openGame(card.dataset.game); });
  });

  // Info buttons: open the description modal without starting the game
  document.querySelectorAll(".info-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const card = btn.closest(".bubble-card");
      infoTitle.textContent = card.querySelector(".bubble-title").textContent;
      infoText.textContent = I18N.t(btn.dataset.info);
      infoModal.classList.remove("hidden");
    });
  });
  document.getElementById("info-close").addEventListener("click", () => infoModal.classList.add("hidden"));
  infoModal.addEventListener("click", e => { if (e.target === infoModal) infoModal.classList.add("hidden"); });

  // Back buttons: return to the main menu from anywhere (also close modals)
  document.querySelectorAll("[data-back]").forEach(btn => {
    btn.addEventListener("click", () => {
      rtModal.classList.add("hidden");
      btModal.classList.add("hidden");
      showScreen("screen-menu");
    });
  });

  // Language dropdown next to the title
  langToggle.addEventListener("click", e => {
    e.stopPropagation();
    langMenu.classList.toggle("hidden");
  });
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      I18N.setLang(btn.dataset.lang);
      langMenu.classList.add("hidden");
    });
  });
  // Tapping anywhere else closes the dropdown
  document.addEventListener("click", e => {
    if (!e.target.closest(".lang-dropdown")) langMenu.classList.add("hidden");
  });

  // Apply the stored (or default) language on load
  I18N.apply();
})();
