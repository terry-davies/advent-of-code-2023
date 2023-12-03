import fs from "fs";
import readline from "readline";

type EngineMatrix = Array<Array<string>>;

interface MatchResult {
  isMatch: boolean;
  number: string | null;
  asterixDimension?: Array<string>;
}

function isNumeric(value: string) {
  return /^-?\d+$/.test(value);
}

function isPeriodOrNumber(char: string | null) {
  if (char === null || char === undefined) return true;
  return char === "." || isNumeric(char);
}

function isAsterix(char: string | null) {
  return char === "*";
}

function getSiblingMatchDayOne(
  matrix: EngineMatrix,
  rowIndex: number,
  columnIndex: number,
  alreadyMatched: boolean
): MatchResult {
  const matrixWidth = matrix[rowIndex].length;
  const currentValue = matrix[rowIndex][columnIndex];

  const isNumber = isNumeric(currentValue);

  let isMatch = false;
  let horizontal = columnIndex - 1;
  let vertical = rowIndex - 1;

  let asterixDimension: Array<string> = [];

  while (!isMatch) {
    try {
      if (isAsterix(matrix[vertical][horizontal])) {
        asterixDimension.push(`${vertical},${horizontal}`);
      }
    } catch (e) {}

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

  if (!isNumber) {
    return { isMatch: false, number: null };
  }

  if (isNumber && alreadyMatched) {
    return { isMatch: false, number: currentValue, asterixDimension };
  }

  return { isMatch, number: currentValue, asterixDimension };
}

async function main() {
  const fileStream = fs.createReadStream("./src/input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const matrixResults: Array<MatchResult> = [];

  const matrix: EngineMatrix = [];

  for await (const line of rl) {
    matrix.push(line.split(""));
  }

  matrix.forEach((row, rowIndex) => {
    // Vars to track current number
    let currentNumber = null;
    let currentNumberMatch = false;
    let asterixs: Array<string> = [];

    for (let i = 0; i < row.length; i++) {
      // Get detail on current cell such as if it is touching a relevant
      // char, location of asterix it is touching and the number
      const result = getSiblingMatchDayOne(
        matrix,
        rowIndex,
        i,
        currentNumberMatch
      );

      // Set current number match if this digit is a match,
      // can assume entire number is a match from this point
      if (result.isMatch) {
        currentNumberMatch = true;
      }

      // If current digit is null and current number hasn't been a match
      // clear down the number for the next number and skip iteration
      if (result.number === null && !currentNumberMatch) {
        currentNumber = null;
        asterixs = [];
        continue;
      }

      // If current value is a digit and current number is empty
      // start building a new number with asterix data if defined.
      // If current value is a digit and current number isn't empty
      // concat the new digit and asterix data
      if (result.number !== null && currentNumber === null) {
        currentNumber = result.number;

        if (result.asterixDimension !== undefined) {
          asterixs = [...new Set([...result.asterixDimension])];
        }
      } else if (result.number !== null && currentNumber !== null) {
        currentNumber += result.number;

        if (result.asterixDimension !== undefined) {
          asterixs = [...new Set([...result.asterixDimension, ...asterixs])];
        }
      }

      // If the current value is not a number or the end of row has been
      // reached and there is a match then store the results and reset
      // the current number, matched status and asterix data.
      if (
        (i === row.length - 1 || result.number === null) &&
        currentNumberMatch &&
        currentNumber !== null
      ) {
        matrixResults.push({
          isMatch: true,
          number: currentNumber,
          asterixDimension: asterixs,
        });

        asterixs = [];
        currentNumber = null;
        currentNumberMatch = false;
      }
    }
  });

  // Map the asterix results to an object with key as the asterix
  // matrices with the value being the numbers that are touching it
  const asterixResult = matrixResults
    .filter((matrixResult) => matrixResult.number !== null)
    .reduce<Record<string, Array<string>>>((prev, current) => {
      const currentNumber = current.number as string;
      const value = current.asterixDimension;

      if (value === undefined) return prev;

      const mappedObject = current.asterixDimension?.reduce(
        (mappedAsterixObject, asterixDimension) => {
          const prevData = prev[asterixDimension];

          if (!prevData) {
            return {
              [asterixDimension]: [currentNumber],
            };
          }

          return {
            ...mappedAsterixObject,
            [asterixDimension]: [...prevData, currentNumber],
          };
        },
        {} as Record<string, Array<string>>
      );

      return {
        ...prev,
        ...mappedObject,
      } as Record<string, Array<string>>;
    }, {});

  // Check mapped asterix object for pairs and multiply then sum with
  // running total
  const part2Total = Object.keys(asterixResult).reduce((total, current) => {
    if (asterixResult[current].length === 2) {
      return (
        total +
        Number(asterixResult[current][0]) * Number(asterixResult[current][1])
      );
    }

    return total;
  }, 0);

  // Sum all numbers marked as matches against criteria
  const part1Total = matrixResults.reduce<number | undefined>(
    (prev, current) => {
      if (prev === undefined) return 0;

      if (!current.isMatch) return prev;

      return prev + Number(current.number);
    },
    0
  );

  console.log(`Part 1 Total: ${part1Total}`);

  console.log(`Part 2 Total: ${part2Total}`);
}

main();
