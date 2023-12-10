import fs from "fs";

const input = fs.readFileSync("./src/input.txt", "utf8").replace(/\r/g, "");

function parseInput(input: string) {
  return input.split("\n").map((line) => {
    return line.split(" ").map(Number);
  });
}

function processLine(line: number[]): number {
  const nextLine = line.reduce<number[]>((acc, curr, index) => {
    if (index === line.length - 1) return acc;

    acc.push(line[index + 1] - curr);
    return acc;
  }, [] as number[]);

  if (nextLine.every((val) => val === 0)) {
    return line[line.length - 1] + nextLine[nextLine.length - 1];
  } else {
    return processLine(nextLine) + line[line.length - 1];
  }
}

function processAllLines(lines: number[][]) {
  return lines.reduce((acc, cur) => {
    const nextNumber = processLine(cur);

    return acc + nextNumber;
  }, 0);
}

console.log(processAllLines(parseInput(input)));
