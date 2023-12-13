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

function getEmptyGalaxiesBetweenPair(
  startCoordinate: number,
  endCoord: number,
  emptyData: number[],
  galaxyMultiplier: number
) {
  let emptyCount = 0;

  const min = Math.min(startCoordinate, endCoord);
  const max = Math.max(startCoordinate, endCoord);

  for (let i = min + 1; i < max; i++) {
    if (emptyData.includes(i)) {
      emptyCount += galaxyMultiplier - 1;
    }
  }

  return emptyCount;
}

function distanceBetweenCoordinates(
  coordinates: CoordinatePairs,
  emptyData: EmptyData,
  galaxyMultiplier = 2
) {
  const [x1, y1] = coordinates[0];
  const [x2, y2] = coordinates[1];

  const distance = Math.abs(x2 - x1) + Math.abs(y2 - y1);
  const emptyX = getEmptyGalaxiesBetweenPair(
    x1,
    x2,
    emptyData.rows,
    galaxyMultiplier
  );
  const emptyY = getEmptyGalaxiesBetweenPair(
    y1,
    y2,
    emptyData.columns,
    galaxyMultiplier
  );

  return distance + emptyX + emptyY;
}

function getTotal(
  pairs: CoordinatePairs[],
  emptyData: EmptyData,
  galaxyMultiplier = 2
) {
  return pairs.reduce((acc, curr) => {
    return acc + distanceBetweenCoordinates(curr, emptyData, galaxyMultiplier);
  }, 0);
}

const galaxy = parseInput(input);

const emptyData = findEmptyData(galaxy);
const pairs = createPairs(getFoundGalaxies(galaxy));

console.log(getTotal(pairs, emptyData, 2));
console.log(getTotal(pairs, emptyData, 1_000_000));
