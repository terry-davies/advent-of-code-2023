import fs from "fs";

const input = fs.readFileSync("./src/input.txt", "utf8").replace(/\r/g, "");

function parseInput(input: string) {
  return input.split("\n").map((line) => {
    return line.split(" ").map(Number);
  });
}

function getNextLine(line: number[]) {
  return line.reduce<number[]>((acc, curr, index) => {
    if (index === line.length - 1) return acc;

    acc.push(line[index + 1] - curr);
    return acc;
  }, [] as number[]);
}
function processLineNextNumber(line: number[]): number {
  const nextLine = getNextLine(line);

  if (nextLine.every((val) => val === 0)) {
    return line[line.length - 1] + nextLine[nextLine.length - 1];
  } else {
    return processLineNextNumber(nextLine) + line[line.length - 1];
  }
}

function processLinePreviousNumber(line: number[]): number {
  const nextLine = getNextLine(line);

  if (nextLine.every((val) => val === 0)) {
    return line[0] - nextLine[0];
  } else {
    return line[0] - processLinePreviousNumber(nextLine);
  }
}

function processAllLinesPart1(lines: number[][]) {
  return lines.reduce((acc, cur) => {
    const nextNumber = processLineNextNumber(cur);

    return acc + nextNumber;
  }, 0);
}

function processAllLinesPart2(lines: number[][]) {
  return lines.reduce((acc, cur) => {
    const nextNumber = processLinePreviousNumber(cur);

    return acc + nextNumber;
  }, 0);
}

const parsedInput = parseInput(input);

console.log(processAllLinesPart1(parsedInput));
console.log(processAllLinesPart2(parsedInput));
