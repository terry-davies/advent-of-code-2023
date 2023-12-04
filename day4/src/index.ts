import fs from "fs";
import readline from "readline";

const numberRegex = /\d+/g;

function createArray(length: number, start = 0) {
  return Array.from({ length }, (_, i) => i + start + 1);
}

function getCardNumber(cardStr: string) {
  const cardNumber = cardStr.match(numberRegex) as string[];

  return parseInt(cardNumber[0]);
}

function mapNumbersToArray(numbersStr: string) {
  return numbersStr
    .split(" ")
    .filter((number) => number !== "")
    .map((number) => {
      if (Number(number) <= 9) {
        return `0${number}`;
      }

      return number;
    });
}

function part1Calculation(total: number) {
  const result = Math.pow(2, total - 1);
  return result;
}

function getMatches(myNumbers: string[], gameNumbers: string[]) {
  return myNumbers.reduce<number>((total, winningNumber) => {
    if (!gameNumbers.includes(winningNumber)) return total;

    return total + 1;
  }, 0);
}

async function main() {
  console.log("start");
  const fileStream = fs.createReadStream("./src/input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let scratchCardCache: Record<string, number> = {};

  for await (const line of rl) {
    const [cardDetail, result] = line.split(":");

    const cardNumber = getCardNumber(cardDetail);

    const [gameNumbersString, myNumbersString] = result.split("|");

    const myNumbers = mapNumbersToArray(myNumbersString);
    const gameNumbers = mapNumbersToArray(gameNumbersString);

    const matches = getMatches(myNumbers, gameNumbers);

    scratchCardCache = {
      ...scratchCardCache,
      [cardNumber]: matches,
    };
  }

  const part1Total = Object.keys(scratchCardCache).reduce(
    (total, cardNumber) => {
      const cardMatches = scratchCardCache[cardNumber] as number;
      if (cardMatches === 0) return total;
      return total + part1Calculation(scratchCardCache[cardNumber] as number);
    },
    0
  );

  const scratchCardStack: Record<string, number> = Object.keys(
    scratchCardCache
  ).reduce((obj, key) => {
    return { ...obj, [key]: 0 };
  }, {});

  const part2total = Object.keys(scratchCardStack).reduce<number>(
    (total, key) => {
      const matches = scratchCardCache[key] as number;

      const matchArray = createArray(matches, parseInt(key));

      scratchCardStack[key]++;

      matchArray.forEach((matchNumber) => {
        scratchCardStack[matchNumber] += scratchCardStack[key];
      });

      return (total += scratchCardStack[key]);
    },
    0
  );

  console.log(`Total part 1: ${part1Total}`);
  console.log(`Total part 2: ${part2total}`);
}

main();
