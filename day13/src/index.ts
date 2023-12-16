import fs from "fs";

const input = fs.readFileSync("./src/input.txt", "utf8").replace(/\r/g, "");

function parseInput(input: string) {
  return input.split("\n\n");
}

function reverseString(str: string) {
  return str.split("").reverse().join("");
}

function transposeMatrix(matrix: string[]) {
  let transposedMatrix = [];

  for (let i = 0; i < matrix[0].length; i++) {
    let row = [];

    for (let j = 0; j < matrix.length; j++) {
      row.push(matrix[j].split("")[i]);
    }

    transposedMatrix.push(row.join(""));
  }

  return transposedMatrix;
}

function getMirrorPosition(matrix: string[]) {
  const mirrorPossibilites = matrix.reduce<Record<string, number>>(
    (acc, curr, rowIndex) => {
      for (let i = 1; i < curr.length; i++) {
        const firstPart = curr.slice(0, i);
        const secondPart = curr.slice(i);

        if (
          !secondPart.startsWith(
            reverseString(firstPart).slice(0, secondPart.length)
          )
        )
          continue;

        if (acc[i]) {
          acc[i] = acc[i] + 1;
        } else {
          acc[i] = 1;
        }
      }

      return acc;
    },
    {}
  );

  let mirrorIndex: null | number = null;

  Object.keys(mirrorPossibilites).forEach((index) => {
    if (mirrorPossibilites[index] === matrix.length) {
      mirrorIndex = Number(index);
    }
  });

  return mirrorIndex || 0;
}

function handleArea(matrix: string): number {
  const rows = matrix.split("\n");
  const columns = transposeMatrix(rows);

  const rowMirror = getMirrorPosition(rows);
  const columnMirror = getMirrorPosition(columns);

  return rowMirror + columnMirror * 100;
}

function processAreas(areas: string[]) {
  return areas.reduce((acc, curr, index) => {
    const result = handleArea(curr);
    return acc + result;
  }, 0);
}

console.log(processAreas(parseInput(input)));
