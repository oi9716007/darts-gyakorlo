// ===== Question bank for the Calculate game =====
// Numeric data is language-independent; sentences come from I18N templates.
// build() assembles the full 77-question list in the CURRENT language.
// Every entry: { q, correct, wrong[3] } — answer order is shuffled by the game.
const QuestionBank = (() => {
  // Subtraction pairs [have, throw]; correct = have - throw
  const SUB = [
    [121, 57], [141, 85], [167, 121], [180, 100], [120, 45], [96, 59],
    [130, 81], [156, 98], [110, 66], [87, 45], [175, 60], [143, 87],
    [99, 58], [158, 125], [71, 38], [61, 25], [82, 41], [170, 123],
  ];

  // Missing-number pairs [total, remainder]; correct = total - remainder
  const MISSING = [
    [100, 40], [121, 64], [87, 47], [140, 95], [77, 36], [66, 30], [132, 72], [58, 26],
  ];

  // Checkout routes: [score, correct route, wrong routes] (notation is universal)
  const ROUTES = [
    [170, "T20, T20, Bull", ["T20, T19, Bull", "T20, T20, D20", "T20, Bull, Bull"]],
    [167, "T20, T19, Bull", ["T20, T20, Bull", "T19, T19, Bull", "T20, T17, Bull"]],
    [160, "T20, T20, D20", ["T20, T20, Bull", "T20, T19, D20", "T19, T19, D20"]],
    [100, "T20, D20", ["T20, D10", "T19, D20", "20, D20"]],
    [64, "T16, D8", ["T16, D10", "T14, D10", "14, D20"]],
    [61, "T15, D8", ["T15, D10", "T15, D6", "15, D20"]],
    [68, "T20, D4", ["T20, D8", "T18, D8", "T16, D8"]],
    [76, "T20, D8", ["T20, D6", "T20, D10", "T18, D10"]],
    [84, "T20, D12", ["T20, D10", "T18, D14", "T20, D14"]],
    [90, "T18, D18", ["T18, D16", "T20, D14", "T18, D20"]],
    [96, "T20, D18", ["T20, D16", "T19, D18", "T18, D18"]],
    [62, "T10, D16", ["T10, D14", "T12, D16", "T8, D16"]],
    [60, "20, D20", ["20, D10", "10, D20", "20, D16"]],
    [57, "17, D20", ["19, D20", "17, D16", "7, D20"]],
    [45, "13, D16", ["13, D20", "15, D16", "9, D16"]],
    [41, "9, D16", ["9, D20", "11, D16", "7, D16"]],
    [129, "T19, T20, D6", ["T20, T20, D6", "T19, T19, D6", "T20, T19, D4"]],
  ];

  // Which double checks out: [score, correct, wrongs]
  const DOUBLES = [
    [32, "D16", ["D8", "D12", "D18"]],
    [40, "D20", ["D10", "D16", "D18"]],
    [36, "D18", ["D16", "D12", "D9"]],
    [24, "D12", ["D6", "D14", "D8"]],
    [16, "D8", ["D16", "D4", "D6"]],
    [20, "D10", ["D20", "D5", "D8"]],
    [28, "D14", ["D7", "D12", "D16"]],
    [12, "D6", ["D12", "D3", "D4"]],
    [8, "D4", ["D8", "D2", "D6"]],
  ];

  // Leave a favourite finish: [current, leave, double name]; correct = current - leave
  const LEAVE = [
    [39, 32, "D16"], [43, 40, "D20"], [35, 32, "D16"], [47, 40, "D20"],
    [53, 36, "D18"], [45, 32, "D16"], [51, 32, "D16"], [33, 32, "D16"],
  ];

  // Endgame logic: either universal options (opts, correct first)
  // or a translated option array key (ak, correct first)
  const LOGIC = [
    { qk: "qMax3", opts: ["170", "180", "167", "160"] },
    { qk: "qMax1", opts: ["50 (Bull)", "40 (D20)", "60 (T20)", "38 (D19)"] },
    { qk: "qNo3", opts: ["169", "167", "164", "170"] },
    { qk: "qNo2", opts: ["99", "98", "96", "100"] },
    { qk: "qBust", ak: "aBust" },
    { qk: "qS16", ak: "aS16" },
    { qk: "qOne", ak: "aOne" },
    { qk: "qTwo", ak: "aTwo" },
    { qk: "qS20", ak: "aS20" },
    { qk: "qCont", ak: "aCont" },
    { qk: "qEven", ak: "aEven" },
    { qk: "qMaxDart", opts: ["60 (T20)", "50 (Bull)", "57 (T19)", "40 (D20)"] },
    { qk: "qMax3Darts", opts: ["180", "170", "160", "150"] },
    { qk: "qBull", opts: ["50", "25", "60", "40"] },
    { qk: "qOuter", opts: ["25", "50", "20", "30"] },
    { qk: "qEven81", ak: "aEven81" },
  ];

  // Plausible wrong numbers around a correct value (always unique, always > 0)
  function nearWrongs(c) {
    const low = c - 2 > 0 ? c - 2 : c + 1;
    return [String(c + 2), String(low), String(c + 10)];
  }

  function build() {
    const t = I18N.t, fmt = I18N.fmt;
    const list = [];

    SUB.forEach(([a, b]) => {
      const c = a - b;
      list.push({ q: fmt(t("qSub"), { a, b }), correct: String(c), wrong: nearWrongs(c) });
    });

    MISSING.forEach(([a, b]) => {
      const c = a - b;
      list.push({ q: fmt(t("qMissing"), { a, b }), correct: String(c), wrong: nearWrongs(c) });
    });

    ROUTES.forEach(([n, correct, wrong]) => {
      const q = n === 170 ? t("qRouteMax") : fmt(t("qRoute"), { n });
      list.push({ q, correct, wrong });
    });

    DOUBLES.forEach(([n, correct, wrong]) => {
      list.push({ q: fmt(t("qDouble"), { n }), correct, wrong });
    });

    // 50 is special: one-dart Bull finish, with a translated trap option
    list.push({ q: t("qDouble50"), correct: "Bull (D25)", wrong: ["D20", "T20", t("aNoD25")] });

    LEAVE.forEach(([a, b, d]) => {
      const c = a - b;
      const low = c - 2 > 0 ? c - 2 : c + 1;
      list.push({
        q: fmt(t("qLeave"), { a, b, d }),
        correct: String(c),
        wrong: [String(c + 2), String(low), String(c + 6)],
      });
    });

    LOGIC.forEach(item => {
      const opts = item.opts || t(item.ak);
      list.push({ q: t(item.qk), correct: opts[0], wrong: opts.slice(1) });
    });

    return list;
  }

  return { build };
})();
