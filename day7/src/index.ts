import fs from "fs";

const input = fs.readFileSync("./src/input.txt", "utf8").replace(/\r/g, "");

const cardRankMapping = {
  "2": "02",
  "3": "03",
  "4": "04",
  "5": "05",
  "6": "06",
  "7": "07",
  "8": "08",
  "9": "09",
  T: "10",
  // J value changed from 11 to 01 as it was devalued in part 2
  J: "01",
  Q: "12",
  K: "13",
  A: "14",
};

type CardKey = keyof typeof cardRankMapping;

interface GameData {
  cards: string;
  bid: number;
}

export enum HandRanking {
  HighCard,
  OnePair,
  TwoPair,
  ThreeOfAKind,
  FullHouse,
  FourOfAKind,
  FiveOfAKind,
}

export interface GameResult {
  ranking: HandRanking;
  cardsTotal: number;
  gameData: GameData;
}

interface HandResult {
  currentGameRank: HandRanking;
  handValue: number;
}

function parseCardInput(input: string): GameData[] {
  return input.split("\n").map((line) => {
    const [cards, bid] = line.trim().split(" ");

    return { cards, bid: Number(bid) };
  });
}

function sort(a: GameResult, b: GameResult) {
  if (a.ranking > b.ranking) {
    return 1;
  }

  if (a.ranking < b.ranking) {
    return -1;
  }

  if (a.cardsTotal < b.cardsTotal) {
    return -1;
  }

  if (a.cardsTotal > b.cardsTotal) {
    return 1;
  }

  return 0;
}

export function sortGameData(games: GameResult[]) {
  return games.sort(sort);
}

function calculateResult(games: GameResult[]) {
  return games.reduce((acc, curr, index) => {
    console.log(curr.gameData.cards, curr.ranking);
    return acc + (index + 1) * curr.gameData.bid;
  }, 0);
}

type HandMapper = Record<string, Partial<Record<HandRanking, HandRanking>>>;

const handMapperPartOne: HandMapper = {
  "1": {
    [HandRanking.HighCard]: HandRanking.HighCard,
  },
  "2": {
    [HandRanking.HighCard]: HandRanking.OnePair,
    [HandRanking.OnePair]: HandRanking.TwoPair,
    [HandRanking.TwoPair]: HandRanking.TwoPair,
    [HandRanking.ThreeOfAKind]: HandRanking.FullHouse,
  },
  "3": {
    [HandRanking.OnePair]: HandRanking.ThreeOfAKind,
    [HandRanking.TwoPair]: HandRanking.FullHouse,
    [HandRanking.ThreeOfAKind]: HandRanking.FullHouse,
  },
  "4": {
    [HandRanking.ThreeOfAKind]: HandRanking.FourOfAKind,
  },
  "5": {
    [HandRanking.FourOfAKind]: HandRanking.FiveOfAKind,
  },
};

const jokerMapper: HandMapper = {
  "1": {
    [HandRanking.HighCard]: HandRanking.OnePair,
    [HandRanking.OnePair]: HandRanking.ThreeOfAKind,
    [HandRanking.TwoPair]: HandRanking.FullHouse,
    [HandRanking.ThreeOfAKind]: HandRanking.FourOfAKind,
    [HandRanking.FourOfAKind]: HandRanking.FiveOfAKind,
  },
  "2": {
    [HandRanking.HighCard]: HandRanking.ThreeOfAKind,
    [HandRanking.OnePair]: HandRanking.FourOfAKind,
    [HandRanking.ThreeOfAKind]: HandRanking.FiveOfAKind,
  },
  "3": {
    [HandRanking.HighCard]: HandRanking.FourOfAKind,
    [HandRanking.OnePair]: HandRanking.FiveOfAKind,
  },
  "4": {
    [HandRanking.HighCard]: HandRanking.FiveOfAKind,
  },
  "5": {
    [HandRanking.HighCard]: HandRanking.FiveOfAKind,
  },
};

export function getHandFromCards(cards: string): HandResult {
  let currentGameRank: HandRanking = HandRanking.HighCard;
  let mappedGame: string[] = [];

  const cardCount = cards.split("").reduce((acc, curr) => {
    mappedGame.push(cardRankMapping[curr as CardKey]);

    if (acc[curr]) {
      acc[curr]++;
    } else {
      acc[curr] = 1;
    }

    if (curr === "J") return acc;

    const newRank =
      handMapperPartOne[acc[curr].toString() as keyof typeof handMapperPartOne][
        currentGameRank
      ];

    if (!newRank) return acc;

    currentGameRank = newRank;

    return acc;
  }, {} as Record<string, number>);

  if (cardCount["J"]) {
    const newRank =
      jokerMapper[cardCount["J"].toString() as keyof typeof handMapperPartOne][
        currentGameRank
      ];

    if (newRank !== undefined) {
      currentGameRank = newRank;
    }
  }

  return { currentGameRank, handValue: Number(mappedGame.join("")) };
}

function processGameData(gameData: GameData[]) {
  const processedGames: GameResult[] = [];

  while (gameData.length) {
    const game = gameData.pop();

    if (!game) break;

    const { currentGameRank, handValue } = getHandFromCards(game.cards);

    if (currentGameRank === undefined) {
      throw new Error("Missing current game rank");
      return [];
    }

    processedGames.push({
      cardsTotal: handValue,
      ranking: currentGameRank,
      gameData: game,
    });
  }

  return processedGames;
}

console.log(
  calculateResult(sortGameData(processGameData(parseCardInput(input))))
);
