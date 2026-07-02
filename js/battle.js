// ===== War Against the Board game =====
// Setup: enter a 3-dart score to beat and the points needed to win.
// Each round: tap whoever earned the point — you (score >= threshold)
// or the board. First to the target points wins.
const Battle = (() => {
  // Game state
  let threshold = 60;   // 3-dart score to beat
  let target = 10;      // points needed to win
  let mePoints = 0;
  let boardPoints = 0;
  let over = false;

  const el = {
    modal: document.getElementById("bt-modal"),
    inpScore: document.getElementById("bt-set-score"),
    inpTarget: document.getElementById("bt-set-target"),
    startBtn: document.getElementById("bt-start"),
    card: document.getElementById("bt-card"),
    firstTo: document.getElementById("bt-first-to"),
    threshold: document.getElementById("bt-threshold"),
    me: document.getElementById("bt-me"),
    board: document.getElementById("bt-board"),
    mePointsEl: document.getElementById("bt-me-points"),
    boardPointsEl: document.getElementById("bt-board-points"),
    result: document.getElementById("bt-result"),
    winner: document.getElementById("bt-winner"),
    again: document.getElementById("bt-again"),
    reset: document.getElementById("bt-reset"),
  };

  function render() {
    el.firstTo.textContent = I18N.fmt(I18N.t("btFirstTo"), { n: target });
    el.threshold.textContent = String(threshold);
    el.mePointsEl.textContent = String(mePoints);
    el.boardPointsEl.textContent = String(boardPoints);
  }

  // A round ends: the tapped bubble gets the point
  function addPoint(who) {
    if (over) return;
    if (who === "me") mePoints++; else boardPoints++;
    render();
    if (mePoints >= target || boardPoints >= target) showResult();
  }

  function showResult() {
    over = true;
    el.winner.textContent = mePoints >= target ? I18N.t("btWinMe") : I18N.t("btWinBoard");
    el.card.classList.add("hidden");
    el.result.classList.remove("hidden");
  }

  function resetMatch() {
    mePoints = 0;
    boardPoints = 0;
    over = false;
    el.card.classList.remove("hidden");
    el.result.classList.add("hidden");
    render();
  }

  function start() {
    const s = parseInt(el.inpScore.value, 10);
    const p = parseInt(el.inpTarget.value, 10);
    threshold = Number.isFinite(s) ? Math.min(Math.max(s, 1), 180) : 60;
    target = Number.isFinite(p) ? Math.min(Math.max(p, 1), 100) : 10;
    el.modal.classList.add("hidden");
    resetMatch();
  }

  function openSettings() {
    el.modal.classList.remove("hidden");
  }

  // On entry: fresh state and the setup modal
  function init() {
    resetMatch();
    openSettings();
  }

  el.startBtn.addEventListener("click", start);
  el.me.addEventListener("click", () => addPoint("me"));
  el.board.addEventListener("click", () => addPoint("board"));
  // Reset: restart the match with the same settings
  el.reset.addEventListener("click", resetMatch);
  // Play again: back to the setup modal (values are kept in the inputs)
  el.again.addEventListener("click", () => { resetMatch(); openSettings(); });

  return { init };
})();
