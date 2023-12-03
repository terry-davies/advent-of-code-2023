import fs from "fs";
import readline from "readline";

type EngineMatrix = Array<Array<string>>;

interface MatchResult {
  isMatch: boolean;
  number: string | null;
}

function isNumeric(value: string) {
  return /^-?\d+$/.test(value);
}

function isPeriodOrNumber(char: string | null) {
  if (char === null || char === undefined) return true;
  return char === "." || isNumeric(char);
}

function getSiblingMatch(
  matrix: EngineMatrix,
  rowIndex: number,
  columnIndex: number,
  alreadyMatched: boolean
): MatchResult {
  const matrixWidth = matrix[rowIndex].length;
  const currentValue = matrix[rowIndex][columnIndex];

  if (!isNumeric(currentValue)) {
    return { isMatch: false, number: null };
  }

  if (isNumeric(currentValue) && alreadyMatched) {
    return { isMatch: false, number: currentValue };
  }

  let isMatch = false;
  let horizontal = columnIndex - 1;
  let vertical = rowIndex - 1;

  while (!isMatch) {
    try {
      if (!isPeriodOrNumber(matrix[vertical][horizontal])) {
        isMatch = true;
        break;
      }
    } catch (e) {
      //out of bounds
    }

    // if last in column
    if (horizontal === columnIndex + 1) {
      // if last in row
      if (vertical === rowIndex + 1) break;
      vertical++;

      // reset horizontal
      horizontal = columnIndex - 1;
    } else {
      if (horizontal === matrixWidth) {
        if (vertical === rowIndex + 1) break;
        vertical++;
      } else {
        horizontal++;
      }
    }
  }

  return { isMatch, number: currentValue };
}

async function main() {
  const fileStream = fs.createReadStream("./src/input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let total = 0;

  const matrix: EngineMatrix = [];

  for await (const line of rl) {
    matrix.push(line.split(""));
  }

  matrix.forEach((row, rowIndex) => {
    let currentNumber = null;
    let currentNumberMatch = false;

    for (let i = 0; i < row.length; i++) {
      const result = getSiblingMatch(matrix, rowIndex, i, currentNumberMatch);

      if (rowIndex === 55) {
        console.log(result);
        console.log(currentNumberMatch);
      }

      if (result.isMatch) {
        currentNumberMatch = true;
      }

      if (result.number === null && !currentNumberMatch) {
        currentNumber = null;
        continue;
      }

      if (result.number !== null && currentNumber === null) {
        currentNumber = result.number;
      } else if (result.number !== null && currentNumber !== null) {
        currentNumber += result.number;
      }

      if (
        (i === row.length - 1 || result.number === null) &&
        currentNumberMatch &&
        currentNumber !== null
      ) {
        total += parseInt(currentNumber);
        currentNumber = null;
        currentNumberMatch = false;
      }
    }
  });

  console.log(`Total: ${total}`);
}

main();
