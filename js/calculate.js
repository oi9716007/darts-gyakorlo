// ===== Calculate game =====
// Darts mental-math quiz: 4 answer options, instant feedback, running score.
const Calculate = (() => {
  const LETTERS = ["A", "B", "C", "D"];

  // Game state
  let deck = [];        // shuffled question deck
  let index = 0;        // current question index
  let score = 0;        // correct answers
  let answered = 0;     // answered questions
  let locked = false;   // buttons are locked after answering

  const el = {
    score: document.getElementById("calc-score"),
    question: document.getElementById("calc-question"),
    answers: document.getElementById("calc-answers"),
    feedback: document.getElementById("calc-feedback"),
    next: document.getElementById("calc-next"),
    restart: document.getElementById("calc-restart"),
    card: document.querySelector("#screen-calculate .game-card"),
    summary: document.getElementById("calc-summary"),
    summaryText: document.getElementById("calc-summary-text"),
    again: document.getElementById("calc-again"),
  };

  // Fisher-Yates shuffle (does not mutate the original)
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function renderScore() {
    el.score.textContent = "Score: " + score + " / " + answered;
  }

  // Render the current question with shuffled answer order
  function showQuestion() {
    const item = deck[index];
    const options = shuffle([item.correct, ...item.wrong]);

    el.question.textContent = item.q;
    el.answers.innerHTML = "";
    el.feedback.classList.add("hidden");
    el.feedback.classList.remove("good", "bad");
    el.next.classList.add("hidden");
    locked = false;

    options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.className = "answer-btn";
      btn.dataset.value = opt;
      btn.innerHTML = '<span class="letter">' + LETTERS[i] + ")</span>" + opt;
      btn.addEventListener("click", () => onAnswer(btn, opt, item.correct));
      el.answers.appendChild(btn);
    });
    renderScore();
  }

  function onAnswer(btn, chosen, correct) {
    if (locked) return;
    locked = true;
    answered++;

    const buttons = el.answers.querySelectorAll(".answer-btn");
    buttons.forEach(b => { b.disabled = true; });

    if (chosen === correct) {
      score++;
      btn.classList.add("correct");
      el.feedback.textContent = "✓ Correct!";
      el.feedback.classList.add("good");
    } else {
      btn.classList.add("wrong");
      // highlight the correct answer in green
      buttons.forEach(b => {
        if (b.dataset.value === correct) b.classList.add("correct");
      });
      el.feedback.textContent = "✗ Wrong! The correct answer is: " + correct;
      el.feedback.classList.add("bad");
    }
    el.feedback.classList.remove("hidden");
    el.next.classList.remove("hidden");
    renderScore();
  }

  function nextQuestion() {
    index++;
    if (index >= deck.length) {
      showSummary();
    } else {
      showQuestion();
    }
  }

  function showSummary() {
    el.card.classList.add("hidden");
    el.summary.classList.remove("hidden");
    el.summaryText.textContent = "🏁 Finished! Your result: " + score + " / " + answered;
  }

  // New round: shuffled questions, score reset to zero
  function init() {
    deck = shuffle(QUESTIONS);
    index = 0;
    score = 0;
    answered = 0;
    el.card.classList.remove("hidden");
    el.summary.classList.add("hidden");
    showQuestion();
  }

  el.next.addEventListener("click", nextQuestion);
  el.restart.addEventListener("click", init);
  el.again.addEventListener("click", init);

  return { init };
})();
