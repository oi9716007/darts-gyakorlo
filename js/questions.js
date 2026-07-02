// ===== Question bank for the Calculate game =====
// Subtraction only: 100 realistic darts situations, from the opening
// throw at 501 down to the endgame. Each pair is [score, throw]; the
// remainder and the wrong options are computed, so the math is always
// consistent. Sentences come from the I18N qSub template.
const QuestionBank = (() => {
  const SUB = [
    // Opening throws from 501 (pro / advanced)
    [501, 180], [501, 140], [501, 100], [501, 85], [501, 60],
    [501, 45], [501, 26], [501, 121], [501, 81], [501, 95],
    // Opening throws from 301
    [301, 180], [301, 140], [301, 100], [301, 60], [301, 45],
    [301, 26], [301, 85], [301, 55], [301, 41], [301, 77],
    // Big mid-game scores
    [441, 140], [421, 180], [416, 100], [396, 85], [361, 60],
    [356, 140], [340, 100], [321, 121], [380, 45], [401, 140],
    [456, 100], [475, 140], [365, 81], [289, 57], [312, 95],
    // Mid-game between 100 and 300
    [241, 100], [221, 140], [216, 76], [201, 60], [197, 57],
    [186, 90], [181, 45], [177, 100], [170, 50], [167, 26],
    [161, 60], [156, 55], [152, 66], [149, 85], [146, 41],
    [141, 45], [136, 96], [131, 55], [126, 85], [121, 25],
    [117, 57], [114, 54], [109, 68], [107, 67], [104, 72],
    // Endgame under 100
    [99, 47], [96, 56], [95, 63], [94, 54], [92, 60],
    [91, 51], [89, 57], [88, 48], [87, 55], [86, 54],
    [85, 45], [84, 44], [83, 43], [82, 42], [81, 45],
    [79, 39], [78, 38], [77, 45], [76, 44], [74, 42],
    [73, 41], [71, 39], [69, 29], [68, 28], [67, 27],
    // Easy ones for beginners
    [66, 26], [61, 25], [60, 20], [55, 15], [50, 10],
    [48, 16], [45, 13], [44, 12], [43, 3], [42, 10],
    [40, 8], [39, 7], [38, 6], [36, 4], [35, 3],
  ];

  // Plausible wrong numbers around the correct value (unique, always > 0)
  function nearWrongs(c) {
    const low = c - 2 > 0 ? c - 2 : c + 1;
    return [String(c + 2), String(low), String(c + 10)];
  }

  function build() {
    return SUB.map(([a, b]) => {
      const c = a - b;
      return { q: I18N.fmt(I18N.t("qSub"), { a, b }), correct: String(c), wrong: nearWrongs(c) };
    });
  }

  return { build };
})();
