// ===== Around the Board game =====
// Walk around the board in the classic dartboard order, closing with D25 (Bull).
// Per number: Simple (3 checks needed) -> Double (1 check) -> Triple (17-20 only, 3 hits).
const AroundBoard = (() => {
  const ORDER = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
  const TRIPLE_NUMBERS = [17, 18, 19, 20]; // only these get a triple task
  const TOTAL_STEPS = ORDER.length + 1;    // 20 numbers + closing Bull

  // Game state
  let numberIndex = 0;      // position in the order (ORDER.length = Bull finish)
  let phase = "simple";     // "simple" | "double" | "triple" | "bull" | "done"
  let darts = [];           // simple-phase darts: true = hit, false = miss
  let tripleHits = 0;
  let advanceTimer = null;  // pending auto-advance; must be cleared on reset

  const el = {
    progress: document.getElementById("ab-progress"),
    phase: document.getElementById("ab-phase"),
    target: document.getElementById("ab-target"),
    simpleUi: document.getElementById("ab-simple-ui"),
    doubleUi: document.getElementById("ab-double-ui"),
    tripleUi: document.getElementById("ab-triple-ui"),
    doneUi: document.getElementById("ab-done-ui"),
    slots: document.getElementById("ab-slots"),
    hit: document.getElementById("ab-hit"),
    miss: document.getElementById("ab-miss"),
    retry: document.getElementById("ab-retry"),
    doubleOk: document.getElementById("ab-double-ok"),
    counter: document.getElementById("ab-counter"),
    plus: document.getElementById("ab-plus"),
    reset: document.getElementById("ab-reset"),
    restart: document.getElementById("ab-restart"),
  };

  function currentNumber() {
    return ORDER[numberIndex];
  }

  // Move to the next task according to the rules
  function advance() {
    if (phase === "simple") {
      phase = "double";
    } else if (phase === "double") {
      if (TRIPLE_NUMBERS.includes(currentNumber())) {
        phase = "triple";
        tripleHits = 0;
      } else {
        nextNumber();
      }
    } else if (phase === "triple") {
      nextNumber();
    } else if (phase === "bull") {
      phase = "done";
    }
    render();
  }

  function nextNumber() {
    numberIndex++;
    if (numberIndex >= ORDER.length) {
      phase = "bull"; // all numbers done, closing D25 comes next
    } else {
      phase = "simple";
      darts = [];
    }
  }

  // ---- Simple phase: 3 darts marked with check/X ----
  function renderSlots() {
    el.slots.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      const slot = document.createElement("div");
      slot.className = "dart-slot";
      if (i < darts.length) {
        slot.classList.add(darts[i] ? "hit" : "miss");
        slot.textContent = darts[i] ? "✓" : "✗";
      }
      el.slots.appendChild(slot);
    }
  }

  function markDart(hit) {
    if (darts.length >= 3) return;
    darts.push(hit);
    renderSlots();
    if (darts.length === 3) {
      if (darts.every(Boolean)) {
        // all 3 hit: continue after a short pause
        setButtons(false);
        advanceTimer = setTimeout(() => {
          advanceTimer = null;
          darts = [];
          advance();
        }, 500);
      } else {
        // there was a miss: same task again, via the "Retry" button
        setButtons(false);
        el.retry.classList.remove("hidden");
      }
    }
  }

  function setButtons(enabled) {
    el.hit.disabled = !enabled;
    el.miss.disabled = !enabled;
  }

  function retryRound() {
    darts = [];
    el.retry.classList.add("hidden");
    setButtons(true);
    renderSlots();
  }

  // ---- Rendering ----
  function render() {
    // hide every phase UI, then show the current one
    el.simpleUi.classList.add("hidden");
    el.doubleUi.classList.add("hidden");
    el.tripleUi.classList.add("hidden");
    el.doneUi.classList.add("hidden");
    el.retry.classList.add("hidden");

    if (phase === "done") {
      el.phase.textContent = "Done";
      el.target.textContent = "🎯";
      el.progress.textContent = TOTAL_STEPS + " / " + TOTAL_STEPS + " numbers";
      el.doneUi.classList.remove("hidden");
      return;
    }

    const step = Math.min(numberIndex + 1, TOTAL_STEPS);
    el.progress.textContent = step + " / " + TOTAL_STEPS + " numbers";

    if (phase === "bull") {
      el.phase.textContent = "Finish";
      el.target.textContent = "D25 (Bull)";
      el.doubleUi.classList.remove("hidden"); // 1 check, same as double
      return;
    }

    const n = currentNumber();
    if (phase === "simple") {
      el.phase.textContent = "Simple";
      el.target.textContent = String(n);
      el.simpleUi.classList.remove("hidden");
      setButtons(true);
      renderSlots();
    } else if (phase === "double") {
      el.phase.textContent = "Double";
      el.target.textContent = "D" + n;
      el.doubleUi.classList.remove("hidden");
    } else if (phase === "triple") {
      el.phase.textContent = "Triple";
      el.target.textContent = "T" + n;
      el.counter.textContent = tripleHits + " / 3";
      el.tripleUi.classList.remove("hidden");
    }
  }

  function onTriplePlus() {
    tripleHits++;
    if (tripleHits >= 3) {
      advance();
    } else {
      el.counter.textContent = tripleHits + " / 3";
    }
  }

  // Full restart (used on entry and by the reset button)
  function init() {
    // cancel any pending auto-advance so a stale timer cannot skip a task
    if (advanceTimer !== null) {
      clearTimeout(advanceTimer);
      advanceTimer = null;
    }
    numberIndex = 0;
    phase = "simple";
    darts = [];
    tripleHits = 0;
    render();
  }

  el.hit.addEventListener("click", () => markDart(true));
  el.miss.addEventListener("click", () => markDart(false));
  el.retry.addEventListener("click", retryRound);
  el.doubleOk.addEventListener("click", advance);
  el.plus.addEventListener("click", onTriplePlus);
  el.reset.addEventListener("click", init);
  el.restart.addEventListener("click", init);

  return { init };
})();
