import fs from "fs";

const input = fs.readFileSync("./src/input.txt", "utf8").replace(/\r/g, "");

interface InstructionSet {
  L: string;
  R: string;
}

type Direction = keyof InstructionSet;

type LookUpMap = Record<string, InstructionSet>;

interface MapData {
  instructions: Direction[];
  lookUpMap: Record<string, InstructionSet>;
}

function parseCardInput(input: string): MapData {
  const [instructions, lookUps] = input.trim().split("\n\n");

  const lookUpMap = lookUps.split("\n").reduce((acc, curr) => {
    const [key, leftRight] = curr.trim().split(" = ");

    const [left, right] = leftRight
      .replace("(", "")
      .replace(")", "")
      .trim()
      .split(", ")
      .map((direction) => direction.trim());

    return {
      ...acc,
      [key]: {
        L: left,
        R: right,
      },
    };
  }, {});

  return {
    instructions: instructions.split("") as Direction[],
    lookUpMap,
  };
}

function traverseMap(instructions: Direction[], lookUpMap: LookUpMap) {
  let currentLocation = "AAA";
  let numberOfSteps = 0;

  while (currentLocation !== "ZZZ") {
    const instructionIndex =
      numberOfSteps > instructions.length - 1
        ? numberOfSteps % instructions.length
        : numberOfSteps;

    const instruction = instructions[instructionIndex];

    currentLocation = lookUpMap[currentLocation][instruction];
    numberOfSteps++;
  }

  return numberOfSteps;
}

const { lookUpMap, instructions } = parseCardInput(input);

console.log(traverseMap(instructions, lookUpMap));
