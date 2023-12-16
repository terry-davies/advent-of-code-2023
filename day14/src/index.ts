import fs from "fs";

const input = fs.readFileSync("./src/input.txt", "utf8").replace(/\r/g, "");

function moveRocks(input: string[][]) {
  const inputCopy = [...input];

  for (let rowIndex = 0; rowIndex < inputCopy.length; rowIndex++) {
    const row = inputCopy[rowIndex];

    // console.log(row);

    row.forEach((value, columnIndex) => {
      if (value !== "O") return;

      for (let i = rowIndex - 1; i >= 0; i--) {
        if (
          inputCopy[i][columnIndex] === "O" ||
          inputCopy[i][columnIndex] === "#"
        ) {
          break;
        }

        inputCopy[i][columnIndex] = "O";
        inputCopy[i + 1][columnIndex] = ".";
      }
    });
  }

  return inputCopy;
}

function calculateWeight(input: string[][]) {
  return input.reduce<number>((acc, curr, index) => {
    return (
      acc +
      curr.filter((value) => value === "O").length * (input.length - index)
    );
  }, 0);
}

function parseInput(input: string) {
  return input.split("\n").map((row) => {
    return row.split("");
  });
}

console.log(calculateWeight(moveRocks(parseInput(input))));
