import fs from "fs";
import readline from "readline";

const numberRegex = /\d+/g;

function getGameNumber(gameStr: string) {
  const gameNumber = gameStr.match(numberRegex) as string[];

  if (gameNumber.length > 1) {
    throw new Error("Invalid game");
  }

  return parseInt(gameNumber[0]);
}

interface Cubes {
  redMax: number | null;
  greenMax: number | null;
  blueMax: number | null;
}

const defaultConfig: Cubes = {
  redMax: 12,
  greenMax: 13,
  blueMax: 14,
};

const colours = {
  blue: "blue",
  red: "red",
  green: "green",
} as const;

function handleColour(
  strResult: string,
  colour: (typeof colours)[keyof typeof colours]
) {
  const result = strResult.replace(colour, "").trim();
  return parseInt(result);
}

function handleRound(result: string, currentState: Cubes) {
  let returnState = { ...currentState };

  if (result.includes("blue")) {
    const total = handleColour(result, "blue");

    returnState.blueMax =
      returnState.blueMax === null || total > returnState.blueMax
        ? total
        : currentState.blueMax;
  } else if (result.includes("red")) {
    const total = handleColour(result, "red");

    returnState.redMax =
      returnState.redMax === null || total > returnState.redMax
        ? total
        : currentState.redMax;
  } else if (result.includes("green")) {
    const total = handleColour(result, "green");

    returnState.greenMax =
      returnState.greenMax === null || total > returnState.greenMax
        ? total
        : currentState.greenMax;
  }

  return returnState;
}

function handleLine(line: string) {
  const [game, result] = line.split(":");
  const gameNumber = getGameNumber(game);

  const rounds = result.split(";");

  const roundResult = rounds.reduce<Cubes>(
    (prev, currentRound) => {
      const roundResults = currentRound.split(",");

      roundResults.forEach((result) => {
        prev = handleRound(result, prev);
      });

      return prev;
    },
    {
      blueMax: null,
      redMax: null,
      greenMax: null,
    } as Cubes
  );

  return { ...roundResult, gameNumber };
}

function isGamePossible(
  result: ReturnType<typeof handleLine>,
  rules: typeof defaultConfig = defaultConfig
) {
  const { greenMax, blueMax, redMax } = result;

  if (greenMax === null || blueMax === null || redMax === null) {
    return false;
  }

  if (
    rules.greenMax === null ||
    rules.blueMax === null ||
    rules.redMax === null
  ) {
    return false;
  }

  if (
    greenMax > rules.greenMax ||
    blueMax > rules.blueMax ||
    redMax > rules.redMax
  ) {
    return false;
  }

  return true;
}

function calculateGameTwo(result: ReturnType<typeof handleLine>) {
  const { greenMax, blueMax, redMax } = result;

  if (greenMax === null || blueMax === null || redMax === null) {
    return 0;
  }

  if (greenMax === 0 || blueMax === 0 || redMax === 0) {
    return 0;
  }

  return greenMax * blueMax * redMax;
}

async function main() {
  console.log("start");

  const fileStream = fs.createReadStream("./src/input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let total = 0;

  for await (const line of rl) {
  }
}

main();
