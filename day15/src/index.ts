import fs from "fs";

const input = fs.readFileSync("./src/input.txt", "utf8").replace(/\r/g, "");

function parseInput(input: string) {
  return input.split(",");
}

function calculateStepValue(step: string) {
  let total = 0;

  for (let i = 0; i < step.length; i++) {
    const asciiValue = step.charCodeAt(i);
    total += asciiValue;
    total = total * 17;
    total = total % 256;
  }

  return total;
}

function processSteps(steps: string[]) {
  const stepValues = steps.reduce((acc, curr) => {
    const value = calculateStepValue(curr);

    return acc + value;
  }, 0);
  return stepValues;
}

console.log(processSteps(parseInput(input)));
