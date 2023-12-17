import fs from "fs";

const input = fs.readFileSync("./src/input.txt", "utf8").replace(/\r/g, "");

const moveNorth = (input: string[][]) => {
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      if (input[y][x] != "O") continue;

      if (y === 0) break;

      for (let i = y - 1; i >= 0; i--) {
        if (input[i][x] === "O" || input[i][x] === "#") {
          break;
        }

        input[i][x] = "O";
        input[i + 1][x] = ".";
      }
    }
  }

  return input;
};

const moveSouth = (input: string[][]) => {
  for (let y = input.length - 1; y >= 0; y--) {
    for (let x = 0; x < input[0].length; x++) {
      if (input[y][x] != "O") continue;

      for (let i = y + 1; i < input.length; i++) {
        if (input[i][x] === "O" || input[i][x] === "#") {
          break;
        }

        input[i][x] = "O";
        input[i - 1][x] = ".";
      }
    }
  }

  return input;
};

const moveWest = (input: string[][]) => {
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      if (input[y][x] != "O") continue;

      for (let i = x - 1; i >= 0; i--) {
        if (input[y][i] === "O" || input[y][i] === "#") {
          break;
        }

        input[y][i] = "O";
        input[y][i + 1] = ".";
      }
    }
  }

  return input;
};

const moveEast = (input: string[][]) => {
  for (let y = 0; y < input.length; y++) {
    for (let x = input[0].length; x >= 0; x--) {
      if (input[y][x] != "O") continue;

      for (let i = x + 1; i < input[0].length; i++) {
        if (input[y][i] === "O" || input[y][i] === "#") {
          break;
        }

        input[y][i] = "O";
        input[y][i - 1] = ".";
      }
    }
  }

  return input;
};

const cycle = (input: string[][]) => {
  const inputCopy = [...input];

  moveNorth(inputCopy);
  moveWest(inputCopy);
  moveSouth(inputCopy);
  moveEast(inputCopy);

  return inputCopy;
};

function moveRocks(input: string[][]) {
  const inputCopy = [...input];

  const cache = new Map<string, number>();
  const resultCache = new Map<number, number>();
  let cycleIndex = 0;
  let seenAt: number | undefined = undefined;

  while (!seenAt) {
    cycle(inputCopy);
    seenAt = cache.get(JSON.stringify(inputCopy));

    if (seenAt === undefined) {
      cycleIndex++;

      cache.set(JSON.stringify(inputCopy), cycleIndex);
      resultCache.set(cycleIndex, calculateWeight(inputCopy));
    }
  }

  cycleIndex = cycleIndex + 1;
  const loadIndex = ((1000000000 - seenAt) % (cycleIndex - seenAt)) + seenAt;

  return resultCache.get(loadIndex);
}

const calculateWeight = (input: string[][]) => {
  const total = input.reduce<number>((acc, curr, index) => {
    return (
      acc +
      curr.filter((value) => value === "O").length * (input.length - index)
    );
  }, 0);

  return total;
};

function parseInput(input: string) {
  return input.split("\n").map((row) => {
    return row.split("");
  });
}

console.log(moveRocks(parseInput(input)));
