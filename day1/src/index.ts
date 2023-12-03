import fs from "fs";
import readline from "readline";

const stringNumberRegex =
  /(one)|(two)|(three)|(four)|(five)|(six)|(seven)|(eight)|(nine)|(&&&&)\w+/gi;

const numberStrings = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

type NumberKey = typeof numberStrings;

function reverseString(str: string) {
  return str.split("").reverse().join("");
}

function removeAlphabetical(str: string) {
  return str.replace(/\D/g, "");
}

function getFirstAndLast(str: string) {
  const first = str.split("").shift();
  const last = str.split("").pop();
  return `${first}${last}`;
}

function replaceString(
  str: string,
  toReplace: string,
  replaceValue: string | number,
  reverse = false
) {
  if (!reverse) {
    return str.replace(toReplace, `${replaceValue}`);
  }

  return reverseString(
    reverseString(str).replace(reverseString(toReplace), `${replaceValue}`)
  );
}

function handleLine(text: string) {
  let cleanedValue = text;

  const matches = text.match(stringNumberRegex) ?? [];

  if (matches.length > 0) {
    const firstMatch = matches[0] as keyof NumberKey;
    const lastMatch = matches.pop() as keyof NumberKey;

    cleanedValue = replaceString(
      cleanedValue,
      firstMatch,
      numberStrings[firstMatch]
    );
    cleanedValue = replaceString(
      cleanedValue,
      lastMatch,
      numberStrings[lastMatch],
      true
    );
  }

  return Number(getFirstAndLast(removeAlphabetical(cleanedValue)));
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
    total += handleLine(line);
  }

  console.log(`Total: ${total}`);
}

main();
