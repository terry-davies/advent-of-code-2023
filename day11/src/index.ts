import fs from "fs";

const input = fs.readFileSync("./src/input.txt", "utf8").replace(/\r/g, "");

type Map = string[][];
type Coordinates = [number, number];
type CoordinatePairs = [Coordinates, Coordinates];
interface EmptyData {
  rows: number[];
  columns: number[];
}

function parseInput(input: string): Map {
  return input.split("\n").map((line) => {
    return line.split("");
  });
}

function findEmptyData(map: Map): EmptyData {
  const rows = [];
  const columns = [];

  for (let i = 0; i < map.length; i++) {
    if (map[i].every((x) => x === ".")) {
      rows.push(i);
    }
  }

  for (let i = 0; i < map[0].length; i++) {
    if (map.every((x) => x[i] === ".")) {
      columns.push(i);
    }
  }

  return { rows, columns };
}

function getFoundGalaxies(map: Map) {
  const galaxies: Array<Coordinates> = [];

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] !== "#") continue;

      galaxies.push([i, j]);
    }
  }

  return galaxies;
}

//function that creates an array of all avilable unique pairs from a single array
function createPairs(array: Coordinates[]): CoordinatePairs[] {
  const pairs: CoordinatePairs[] = [];

  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      pairs.push([array[i], array[j]]);
    }
  }

  return pairs;
}

function distanceBetweenCoordinates(
  coordinates: CoordinatePairs,
  emptyData: EmptyData
) {
  let [x1, y1] = coordinates[0];
  let [x2, y2] = coordinates[1];

  const distance = Math.abs(x2 - x1) + Math.abs(y2 - y1);

  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  let emptyX = 0;

  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);
  let emptyY = 0;

  for (let i = minY + 1; i < maxY; i++) {
    if (emptyData.columns.includes(i)) {
      emptyY++;
    }
  }

  for (let i = minX + 1; i < maxX; i++) {
    if (emptyData.rows.includes(i)) {
      emptyX++;
    }
  }

  return distance + emptyX + emptyY;
}

const galaxy = parseInput(input);

const emptyData = findEmptyData(galaxy);

const pairedGalaxies = getFoundGalaxies(galaxy);

const pairs = createPairs(pairedGalaxies);

console.log(
  pairs.reduce((acc, curr) => {
    return acc + distanceBetweenCoordinates(curr, emptyData);
  }, 0)
);
