import { getHandFromCards, HandRanking } from "./index";

describe("Get hand from cards", () => {
  const cases = [
    ["A2345", 1402030405, HandRanking.HighCard],
    ["AAK23", 1414130203, HandRanking.OnePair],
    ["AAQQT", 1414121210, HandRanking.TwoPair],
    ["AAAT6", 1414141006, HandRanking.ThreeOfAKind],
    ["AAQQQ", 1414121212, HandRanking.FullHouse],
    ["AAAA9", 1414141409, HandRanking.FourOfAKind],
    ["AAAAA", 1414141414, HandRanking.FiveOfAKind],
    // Core joker scenarios
    ["J2345", 102030405, HandRanking.OnePair],
    ["J2245", 102020405, HandRanking.ThreeOfAKind],
    ["J2255", 102020505, HandRanking.FullHouse],
    ["J2225", 102020205, HandRanking.FourOfAKind],
    ["J2222", 102020202, HandRanking.FiveOfAKind],
    ["JJ345", 101030405, HandRanking.ThreeOfAKind],
    ["JJ225", 101020205, HandRanking.FourOfAKind],
    ["JJ222", 101020202, HandRanking.FiveOfAKind],
    ["JJJ45", 101010405, HandRanking.FourOfAKind],
    ["JJJ22", 101010202, HandRanking.FiveOfAKind],
    ["JJJJ2", 101010102, HandRanking.FiveOfAKind],
    ["JJJJJ", 101010101, HandRanking.FiveOfAKind],

    ["23J45", 203010405, HandRanking.OnePair],
    ["2245J", 202040501, HandRanking.ThreeOfAKind],
    ["225J5", 202050105, HandRanking.FullHouse],
    ["22J25", 202010205, HandRanking.FourOfAKind],
    ["2222J", 202020201, HandRanking.FiveOfAKind],
    ["J345J", 103040501, HandRanking.ThreeOfAKind],
    ["2J2J5", 201020105, HandRanking.FourOfAKind],
    ["222JJ", 202020101, HandRanking.FiveOfAKind],
    ["45JJJ", 405010101, HandRanking.FourOfAKind],
    ["22JJJ", 202010101, HandRanking.FiveOfAKind],
    ["JJ2JJ", 101020101, HandRanking.FiveOfAKind],
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
