import fs from "fs";

const input = fs.readFileSync("./src/input.txt", "utf8").replace(/\r/g, "");

type Arrangements = number[];

interface RowData {
  arrangements: Arrangements;
  springs: string;
}

function parseInput(input: string): RowData[] {
  return input.split("\n").map((line) => {
    const [springs, arrangements] = line.split(" ");

    return {
      springs,
      arrangements: arrangements.split(",").map(Number),
    };
  });
}

function sum(nums: number[]): number {
  return nums.reduce((acc, current) => {
    acc += current;

    return acc;
  }, 0);
}

function handleLine(springs: string, arrangements: Arrangements): number {
  if (springs.length === 0) {
    return arrangements.length === 0 ? 1 : 0;
  }

  if (arrangements.length === 0) {
    return springs.includes("#") ? 0 : 1;
  }
  //console.log("here");

  if (springs.length < sum(arrangements)) {
    return 0;
  }

  if (springs.startsWith(".")) {
    return handleLine(springs.slice(1), arrangements);
  }

  if (springs.startsWith("#")) {
    const [currentRun, ...leftoverRuns] = arrangements;
    for (let i = 0; i < currentRun; i++) {
      if (springs[i] === ".") {
        return 0;
      }
    }
    if (springs[currentRun] === "#") {
      return 0;
    }

    return handleLine(springs.slice(currentRun + 1), leftoverRuns);
  }

  return (
    handleLine("#" + springs.slice(1), arrangements) +
    handleLine("." + springs.slice(1), arrangements)
  );
}

const parsed = parseInput(input);

console.log(
  parsed.reduce((acc, current) => {
    const combos = handleLine(current.springs, current.arrangements);
    console.log(current.springs, combos);
    return acc + combos;
  }, 0)
);
