import fs from "fs";
import readline from "readline";

const numberRegex = /\d+/g;

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

function calculatePartOneResult(myNumbers: string[], gameNumbers: string[]) {
  return myNumbers.reduce<number>((total, winningNumber) => {
    if (!gameNumbers.includes(winningNumber)) return total;

    return total === 0 ? 1 : total * 2;
  }, 0);
}

async function main() {
  console.log("start");
  const fileStream = fs.createReadStream("./src/input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let totalPart1 = 0;

  for await (const line of rl) {
    const [_cardDetail, result] = line.split(":");

    const [gameNumbersString, myNumbersString] = result.split("|");

    const myNumbers = mapNumbersToArray(myNumbersString);
    const gameNumbers = mapNumbersToArray(gameNumbersString);

    totalPart1 += calculatePartOneResult(myNumbers, gameNumbers);
  }

  console.log(totalPart1);
}

main();
