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
  J: "11",
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

export function getHandFromCards(cards: string) {
  let currentGameRank = HandRanking.HighCard;
  let mappedGame: string[] = [];

  cards.split("").reduce((acc, curr) => {
    mappedGame.push(cardRankMapping[curr as CardKey]);

    if (acc[curr]) {
      acc[curr]++;
    } else {
      acc[curr] = 1;
    }

    if (acc[curr] === 2 && currentGameRank === HandRanking.HighCard) {
      currentGameRank = HandRanking.OnePair;
    } else if (acc[curr] === 2 && currentGameRank === HandRanking.OnePair) {
      currentGameRank = HandRanking.TwoPair;
    } else if (
      acc[curr] === 2 &&
      currentGameRank === HandRanking.ThreeOfAKind
    ) {
      currentGameRank = HandRanking.FullHouse;
    }

    if (acc[curr] === 3 && currentGameRank === HandRanking.OnePair) {
      currentGameRank = HandRanking.ThreeOfAKind;
    } else if (
      acc[curr] === 3 &&
      (currentGameRank === HandRanking.TwoPair ||
        currentGameRank === HandRanking.ThreeOfAKind)
    ) {
      currentGameRank = HandRanking.FullHouse;
    }

    if (acc[curr] === 4) {
      currentGameRank = HandRanking.FourOfAKind;
    }

    if (acc[curr] === 5) {
      currentGameRank = HandRanking.FiveOfAKind;
    }

    return acc;
  }, {} as Record<string, number>);

  return { currentGameRank, handValue: Number(mappedGame.join("")) };
}

function processGameData(gameData: GameData[]) {
  const processedGames: GameResult[] = [];

  while (gameData.length) {
    const game = gameData.pop();

    if (!game) break;

    const { currentGameRank, handValue } = getHandFromCards(game.cards);

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
