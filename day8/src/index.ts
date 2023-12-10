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

function getNumberOfStepsForStarter(
  instructions: Direction[],
  lookUpMap: LookUpMap
) {
  const countObject = Object.keys(lookUpMap)
    .filter((current) => current.split("")[2] === "A")
    .reduce((acc, curr) => {
      let numberOfSteps = 0;
      let currentLocation = curr;

      while (currentLocation.split("")[2] !== "Z") {
        const instructionIndex =
          numberOfSteps > instructions.length - 1
            ? numberOfSteps % instructions.length
            : numberOfSteps;

        const instruction = instructions[instructionIndex];

        currentLocation = lookUpMap[currentLocation][instruction];
        numberOfSteps++;
      }
      return {
        ...acc,
        [currentLocation]: numberOfSteps,
      };
    }, {} as Record<string, number>);

  return Object.values(countObject);
}

// Took lowest common denominator calc from stackoverlow
const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b);

const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

const { lookUpMap, instructions } = parseCardInput(input);

console.log(getNumberOfStepsForStarter(instructions, lookUpMap).reduce(lcm));
