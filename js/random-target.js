// ===== Random Target game =====
// Draws random targets (simple / double / triple / D25); once the configured
// number of hits is reached, a new target is drawn automatically.
// Rules: simple is 1-20 only (no 25), D25 is its own target type with its
// own hit count, and after a triple the next 5 targets are never triples.
const RandomTarget = (() => {
  // Drawable values per type
  const SIMPLE_VALUES = Array.from({ length: 20 }, (_, i) => i + 1); // 1-20, no 25
  const DOUBLE_VALUES = Array.from({ length: 20 }, (_, i) => i + 1); // D1-D20
  const TRIPLE_VALUES = [17, 18, 19, 20]; // never T16 or below!
  const TRIPLE_GAP = 5; // required non-triple targets between two triples

  // Game state (isolated from the other games)
  let settings = { simple: 3, double: 5, triple: 5, bull: 3 };
  let target = null;        // { type, value }
  let hits = 0;
  let tripleCooldown = 0;   // how many non-triple targets are still owed

  const el = {
    modal: document.getElementById("rt-modal"),
    inpSimple: document.getElementById("rt-set-simple"),
    inpDouble: document.getElementById("rt-set-double"),
    inpTriple: document.getElementById("rt-set-triple"),
    inpBull: document.getElementById("rt-set-bull"),
    startBtn: document.getElementById("rt-start"),
    type: document.getElementById("rt-type"),
    target: document.getElementById("rt-target"),
    counter: document.getElementById("rt-counter"),
    plus: document.getElementById("rt-plus"),
    reset: document.getElementById("rt-reset"),
  };

  function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Draw a new random target, honouring the triple spacing rule
  function nextTarget() {
    const types = tripleCooldown > 0
      ? ["simple", "double", "bull"]
      : ["simple", "double", "triple", "bull"];
    const type = rand(types);

    if (type === "triple") {
      tripleCooldown = TRIPLE_GAP; // next 5 targets must be non-triple
    } else if (tripleCooldown > 0) {
      tripleCooldown--;
    }

    const value =
      type === "simple" ? rand(SIMPLE_VALUES) :
      type === "double" ? rand(DOUBLE_VALUES) :
      type === "triple" ? rand(TRIPLE_VALUES) :
      25; // bull
    target = { type, value };
    hits = 0;
    render();
  }

  function targetLabel() {
    const { type, value } = target;
    if (type === "simple") return String(value);
    if (type === "double") return "D" + value;
    if (type === "triple") return "T" + value;
    return "D25"; // bull
  }

  function typeLabel() {
    return { simple: "Simple", double: "Double", triple: "Triple", bull: "Bull" }[target.type];
  }

  function needed() {
    return settings[target.type];
  }

  function render() {
    el.type.textContent = typeLabel();
    el.target.textContent = targetLabel();
    el.counter.textContent = hits + " / " + needed();
  }

  function onPlus() {
    if (!target) return;
    hits++;
    if (hits >= needed()) {
      nextTarget(); // required hits reached, draw a new target
    } else {
      render();
    }
  }

  // Open the settings modal (before the game starts)
  function openSettings() {
    el.modal.classList.remove("hidden");
  }

  function readSetting(input, fallback) {
    const v = parseInt(input.value, 10);
    return Number.isFinite(v) && v >= 1 ? Math.min(v, 20) : fallback;
  }

  function start() {
    settings = {
      simple: readSetting(el.inpSimple, 3),
      double: readSetting(el.inpDouble, 5),
      triple: readSetting(el.inpTriple, 5),
      bull: readSetting(el.inpBull, 3),
    };
    el.modal.classList.add("hidden");
    tripleCooldown = 0;
    nextTarget();
  }

  // On entry: open the modal; the game area behind it is blank
  function init() {
    target = null;
    hits = 0;
    tripleCooldown = 0;
    el.type.textContent = "—";
    el.target.textContent = "?";
    el.counter.textContent = "0 / 0";
    openSettings();
  }

  el.startBtn.addEventListener("click", start);
  el.plus.addEventListener("click", onPlus);
  // Reset: clear the counter and draw a new target with the current settings
  el.reset.addEventListener("click", () => { if (target) nextTarget(); else openSettings(); });

  return { init };
})();
