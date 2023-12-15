import fs from "fs";

const input = fs.readFileSync("./src/input.txt", "utf8").replace(/\r/g, "");

type Arrangements = number[];

interface RowData {
  arrangements: Arrangements;
  springs: string;
}

function memoize<Args extends unknown[], Result>(
  func: (...args: Args) => Result
): (...args: Args) => Result {
  const stored = new Map<string, Result>();

  return (...args) => {
    const k = JSON.stringify(args);

    if (stored.has(k)) {
      return stored.get(k)!;
    }
    const result = func(...args);
    stored.set(k, result);
    return result;
  };
}

function createArray(length: number, start = 0) {
  return Array.from({ length }, (_, i) => i + start + 1);
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

const handleLine = memoize(
  (springs: string, arrangements: Arrangements): number => {
    if (springs.length === 0) {
      return arrangements.length === 0 ? 1 : 0;
    }

    if (arrangements.length === 0) {
      return springs.includes("#") ? 0 : 1;
    }

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
);

const parsed = parseInput(input);

console.log(
  parsed.reduce((acc, current) => {
    const combos = handleLine(current.springs, current.arrangements);

    return acc + combos;
  }, 0)
);

console.log(
  parsed.reduce((acc, current) => {
    const { springs, arrangements } = current;

    const skeletonArray = createArray(5);

    const part2Springs = skeletonArray
      .map((_) => {
        return springs;
      })
      .join("?");

    const part2Arrangments = skeletonArray.reduce<number[]>((acc, current) => {
      return [...acc, ...arrangements];
    }, []);

    const combos = handleLine(part2Springs, part2Arrangments);

    return acc + combos;
  }, 0)
);
