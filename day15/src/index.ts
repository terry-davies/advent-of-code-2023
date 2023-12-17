import fs from "fs";

const input = fs.readFileSync("./src/input.txt", "utf8").replace(/\r/g, "");

function memoize<Args extends unknown[], Result>(
  func: (...args: Args) => Result
): (...args: Args) => Result {
  const stored = new Map<string, Result>();

  return (...args) => {
    const k = JSON.stringify(args);

    if (stored.has(k)) {
      return stored.get(k)!;
    }
    const result = func(...args);
    stored.set(k, result);
    return result;
  };
}

function parseInput(input: string) {
  return input.split(",");
}

const calculateStepValue = memoize((step: string) => {
  let total = 0;

  for (let i = 0; i < step.length; i++) {
    const asciiValue = step.charCodeAt(i);
    total += asciiValue;
    total = total * 17;
    total = total % 256;
  }

  return total;
});

function processStepsPart1(steps: string[]) {
  const stepValues = steps.reduce((acc, curr) => {
    const value = calculateStepValue(curr);

    return acc + value;
  }, 0);
  return stepValues;
}

function calculateBoxValues(box: Map<number, Array<string>>) {
  let total = 0;

  box.forEach((value, key) => {
    const boxNumber = key + 1;
    const boxValue = value.reduce((acc, curr, index) => {
      const slotNumber = index + 1;
      const focalLength = Number(curr.split(" ")[1]);
      return acc + boxNumber * slotNumber * focalLength;
    }, 0);

    total += boxValue;
  });

  return total;
}

function processStepsPart2(steps: string[]) {
  const boxMap = new Map<number, Array<string>>();

  steps.forEach((step) => {
    let lensCode = "";
    let instruction: "-" | "=" = "-";
    let lensCodeValue: undefined | string;

    if (step.includes("=")) {
      instruction = "=";
      const parts = step.split("=");
      lensCode = parts[0];
      lensCodeValue = parts[1];
    } else {
      const parts = step.split("-");
      lensCode = parts[0];
    }

    const value = calculateStepValue(lensCode.split(" ")[0]);

    if (instruction === "-") {
      const currentBox = boxMap.get(value);

      if (currentBox !== undefined) {
        const updatedBox = [...currentBox].filter(
          (value) => !value.includes(lensCode)
        );
        boxMap.set(value, updatedBox);
      }
    }

    if (instruction === "=") {
      const currentBox = boxMap.get(value);

      if (currentBox !== undefined) {
        const boxContents = [...currentBox];

        const isLensInBox = boxContents.find((value) =>
          value.includes(lensCode)
        );

        if (isLensInBox) {
          const indexOfFound = boxContents.findIndex((value) =>
            value.includes(lensCode)
          );

          boxContents[indexOfFound] = `${lensCode} ${lensCodeValue}`;
          boxMap.set(value, boxContents);
        } else {
          boxContents.push(`${lensCode} ${lensCodeValue}`);
          boxMap.set(value, boxContents);
        }
      } else {
        boxMap.set(value, [`${lensCode} ${lensCodeValue}`]);
      }
    }
  });

  return boxMap;
}

console.log(processStepsPart1(parseInput(input)));
console.log(calculateBoxValues(processStepsPart2(parseInput(input))));
