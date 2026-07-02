// ===== Main navigation =====
// Switches between the main menu and the game modes.
// Each game runs its own init() on entry, so states never mix.
(() => {
  const screens = document.querySelectorAll(".screen");
  const rtModal = document.getElementById("rt-modal");

  function showScreen(id) {
    screens.forEach(s => s.classList.toggle("active", s.id === id));
    window.scrollTo(0, 0);
  }

  // Main menu bubbles
  document.querySelectorAll(".bubble-card").forEach(card => {
    card.addEventListener("click", () => {
      const game = card.dataset.game;
      if (game === "random") {
        showScreen("screen-random");
        RandomTarget.init(); // opens the settings modal
      } else if (game === "around") {
        showScreen("screen-around");
        AroundBoard.init();
      } else if (game === "calculate") {
        showScreen("screen-calculate");
        Calculate.init();
      }
    });
  });

  // Back buttons: return to the main menu from anywhere (also closes the modal)
  document.querySelectorAll("[data-back]").forEach(btn => {
    btn.addEventListener("click", () => {
      rtModal.classList.add("hidden");
      showScreen("screen-menu");
    });
  });
})();
