import fs from "fs";

const input = fs.readFileSync("./src/input.txt", "utf8").replace(/\r/g, "");

type Grid = string[][];

type Cell = [number, number];

type MapperFunction = (
  cell: Cell,
  direction: Direction
) => Cell | null | undefined;

type DirectionMapper = Record<string, Partial<Record<Direction, Direction>>>;

enum Direction {
  North,
  East,
  South,
  West,
}

interface MoveData {
  direction: Direction;
  cell: Cell;
  value: string;
}

const moveNorth = (cell: Cell): Cell => [cell[0] - 1, cell[1]];
const moveEast = (cell: Cell): Cell => [cell[0], cell[1] + 1];
const moveSouth = (cell: Cell): Cell => [cell[0] + 1, cell[1]];
const moveWest = (cell: Cell): Cell => [cell[0], cell[1] - 1];

const directionMapper: DirectionMapper = {
  "|": {
    [Direction.North]: Direction.North,
    [Direction.South]: Direction.South,
  },
  "-": {
    [Direction.East]: Direction.East,
    [Direction.West]: Direction.West,
  },
  J: {
    [Direction.South]: Direction.West,
    [Direction.East]: Direction.North,
  }, //is a 90-degree bend connecting north and west.
  "7": {
    [Direction.North]: Direction.West,
    [Direction.East]: Direction.South,
  }, //is a 90-degree bend connecting south and west.
  F: {
    [Direction.North]: Direction.East,
    [Direction.West]: Direction.South,
  }, //is a 90-degree bend connecting south and east.
  L: {
    [Direction.South]: Direction.East,
    [Direction.West]: Direction.North,
  }, // L is a 90-degree bend connecting north and east.
};

function traverseGrid(startCell: Cell, grid: Grid) {
  const firstCellData = getFirstCell(startCell, grid);

  if (!firstCellData) throw new Error("no starting cell");

  let steps = 0;

  let currentDirection = firstCellData.direction;
  let currentCell = firstCellData.cell;
  let currentCellValue = firstCellData.value;

  while (currentCellValue !== "S") {
    if (currentDirection === Direction.North) {
      currentCell = moveNorth(currentCell);
    } else if (currentDirection === Direction.East) {
      currentCell = moveEast(currentCell);
    } else if (currentDirection === Direction.South) {
      currentCell = moveSouth(currentCell);
    } else if (currentDirection === Direction.West) {
      currentCell = moveWest(currentCell);
    }

    currentCellValue = grid[currentCell[0]][currentCell[1]];

    if (currentCellValue === "S") {
      steps++;
      break;
    }

    const newDirection = directionMapper[currentCellValue][currentDirection];
    if (newDirection === undefined) throw new Error("no direction");

    currentDirection = newDirection;

    console.log("Direction", currentDirection);
    console.log("Cell", currentCell);
    console.log("Value", currentCellValue);

    steps++;
  }

  return steps;
}

function getFirstCell(cell: Cell, grid: Grid) {
  const adjacentCells = getAdjacentCellValues(cell, grid);

  return adjacentCells
    .reduce<MoveData[]>((acc, curr, index) => {
      if (curr === undefined) return acc;

      const direction =
        index === 0
          ? Direction.North
          : index === 1
          ? Direction.East
          : index === 2
          ? Direction.South
          : Direction.West;

      return [
        ...acc,
        {
          direction,
          value: curr,
          cell,
        },
      ];
    }, [])
    .pop();
}

function parseInput(input: string): Grid {
  return input.split("\n").map((line) => {
    return line.split("");
  });
}

function findStartCell(grid: Grid): Cell {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === "S") return [i, j];
    }
  }

  throw new Error("No S in grid");
}

function getAdjacentCellValues(cell: Cell, grid: Grid) {
  const [x, y] = cell;

  const gridHeight = grid.length;
  const gridWidth = grid[0].length;

  const northCell = x - 1 >= 0 ? grid[x - 1][y] : undefined;
  const eastCell = y + 1 < gridWidth ? grid[x][y + 1] : undefined;
  const southCell = x + 1 < gridHeight ? grid[x + 1][y] : undefined;
  const westCell = y - 1 >= 0 ? grid[x][y - 1] : undefined;

  return [northCell, eastCell, southCell, westCell].map((cell) => {
    if (cell === "." || cell === "S") return undefined;
    return cell;
  });
}

const grid = parseInput(input);
const startCell = findStartCell(grid);

console.log(traverseGrid(startCell, grid) / 2);
