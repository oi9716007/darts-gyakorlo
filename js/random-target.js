// ===== Random Target game =====
// Draws random targets (simple / double / triple); once the configured
// number of hits is reached, a new target is drawn automatically.
const RandomTarget = (() => {
  // Drawable values per type
  const SIMPLE_VALUES = [...Array.from({ length: 20 }, (_, i) => i + 1), 25];
  const DOUBLE_VALUES = [...Array.from({ length: 20 }, (_, i) => i + 1), 25];
  const TRIPLE_VALUES = [17, 18, 19, 20]; // never T16 or below!

  // Game state (isolated from the other games)
  let settings = { simple: 3, double: 5, triple: 5 };
  let target = null;   // { type, value }
  let hits = 0;

  const el = {
    modal: document.getElementById("rt-modal"),
    inpSimple: document.getElementById("rt-set-simple"),
    inpDouble: document.getElementById("rt-set-double"),
    inpTriple: document.getElementById("rt-set-triple"),
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

  // Draw a new random target
  function nextTarget() {
    const type = rand(["simple", "double", "triple"]);
    const value =
      type === "simple" ? rand(SIMPLE_VALUES) :
      type === "double" ? rand(DOUBLE_VALUES) :
      rand(TRIPLE_VALUES);
    target = { type, value };
    hits = 0;
    render();
  }

  function targetLabel() {
    const { type, value } = target;
    if (type === "simple") return String(value);
    if (type === "double") return value === 25 ? "D25 (Bull)" : "D" + value;
    return "T" + value;
  }

  function typeLabel() {
    return { simple: "Simple", double: "Double", triple: "Triple" }[target.type];
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
    };
    el.modal.classList.add("hidden");
    nextTarget();
  }

  // On entry: open the modal; the game area behind it is blank
  function init() {
    target = null;
    hits = 0;
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
