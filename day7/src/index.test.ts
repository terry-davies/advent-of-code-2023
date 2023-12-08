import {
  getHandFromCards,
  HandRanking,
  sortGameData,
  GameResult,
} from "./index";

const gameDataPlaceholder = { cards: "A1234", bid: 12 };

describe("Get hand from cards", () => {
  const cases = [
    ["A2345", 1402030405, HandRanking.HighCard],
    ["AAK23", 1414130203, HandRanking.OnePair],
    ["AAJJT", 1414111110, HandRanking.TwoPair],
    ["AAAJT", 1414141110, HandRanking.ThreeOfAKind],
    ["AAJJJ", 1414111111, HandRanking.FullHouse],
    ["AAAAJ", 1414141411, HandRanking.FourOfAKind],
    ["AAAAA", 1414141414, HandRanking.FiveOfAKind],
    ["AAAKK", 1414141313, HandRanking.FullHouse],
  ];

  it.each(cases)(
    "given %p as hand, returns card total %p and hand rank %p",
    (hand, cardTotal, ranking) => {
      const result = getHandFromCards(hand as string);
      expect(result.currentGameRank).toEqual(ranking);
      expect(result.handValue).toEqual(cardTotal);
    }
  );
});
