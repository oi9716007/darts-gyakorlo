// ===== War Against the Board game =====
// Setup: enter a 3-dart score to beat and the points needed to win.
// Each round: type your actual 3-dart score (kept for stats), then tap
// whoever earned the point — you (score >= threshold) or the board.
// First to the target points wins; the end screen shows match stats.
const Battle = (() => {
  // Game state
  let threshold = 60;   // 3-dart score to beat
  let target = 10;      // points needed to win
  let mePoints = 0;
  let boardPoints = 0;
  let scores = [];      // every entered 3-dart score (for stats)
  let t20Count = 0;
  let t19Count = 0;
  let over = false;

  const el = {
    modal: document.getElementById("bt-modal"),
    inpScore: document.getElementById("bt-set-score"),
    inpTarget: document.getElementById("bt-set-target"),
    startBtn: document.getElementById("bt-start"),
    card: document.getElementById("bt-card"),
    firstTo: document.getElementById("bt-first-to"),
    threshold: document.getElementById("bt-threshold"),
    score: document.getElementById("bt-score"),
    error: document.getElementById("bt-error"),
    me: document.getElementById("bt-me"),
    board: document.getElementById("bt-board"),
    mePointsEl: document.getElementById("bt-me-points"),
    boardPointsEl: document.getElementById("bt-board-points"),
    t20: document.getElementById("bt-t20"),
    t19: document.getElementById("bt-t19"),
    t20CountEl: document.getElementById("bt-t20-count"),
    t19CountEl: document.getElementById("bt-t19-count"),
    result: document.getElementById("bt-result"),
    winner: document.getElementById("bt-winner"),
    stats: document.getElementById("bt-stats"),
    again: document.getElementById("bt-again"),
    reset: document.getElementById("bt-reset"),
  };

  function render() {
    el.firstTo.textContent = I18N.fmt(I18N.t("btFirstTo"), { n: target });
    el.threshold.textContent = String(threshold);
    el.mePointsEl.textContent = String(mePoints);
    el.boardPointsEl.textContent = String(boardPoints);
    el.t20CountEl.textContent = String(t20Count);
    el.t19CountEl.textContent = String(t19Count);
  }

  function readScoreInput() {
    const v = parseInt(el.score.value, 10);
    return Number.isFinite(v) && v >= 0 && v <= 180 ? v : null;
  }

  // A round ends: the tapped bubble gets the point
  function addPoint(who) {
    if (over) return;
    const s = readScoreInput();
    if (s === null) {
      el.error.classList.remove("hidden"); // stats need the real score
      return;
    }
    el.error.classList.add("hidden");
    scores.push(s);
    if (who === "me") mePoints++; else boardPoints++;
    el.score.value = "";
    render();
    if (mePoints >= target || boardPoints >= target) showResult();
  }

  function showResult() {
    over = true;
    const t = I18N.t;
    el.winner.textContent = mePoints >= target ? t("btWinMe") : t("btWinBoard");

    const avg = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : "0";
    const high = scores.length ? Math.max(...scores) : 0;
    const count180 = scores.filter(s => s === 180).length;
    const rows = [
      [t("btAvg"), avg],
      [t("btHigh"), high],
      ["T20", t20Count],
      ["T19", t19Count],
      ["180", count180],
    ];
    el.stats.innerHTML = "";
    rows.forEach(([label, value]) => {
      const row = document.createElement("div");
      row.className = "stats-row";
      const l = document.createElement("span");
      l.textContent = label;
      const v = document.createElement("span");
      v.className = "stats-value";
      v.textContent = String(value);
      row.append(l, v);
      el.stats.appendChild(row);
    });

    el.card.classList.add("hidden");
    el.result.classList.remove("hidden");
  }

  function resetMatch() {
    mePoints = 0;
    boardPoints = 0;
    scores = [];
    t20Count = 0;
    t19Count = 0;
    over = false;
    el.score.value = "";
    el.error.classList.add("hidden");
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
  el.t20.addEventListener("click", () => { if (!over) { t20Count++; render(); } });
  el.t19.addEventListener("click", () => { if (!over) { t19Count++; render(); } });
  // Reset: restart the match with the same settings
  el.reset.addEventListener("click", resetMatch);
  // Play again: back to the setup modal (values are kept in the inputs)
  el.again.addEventListener("click", () => { resetMatch(); openSettings(); });

  return { init };
})();
