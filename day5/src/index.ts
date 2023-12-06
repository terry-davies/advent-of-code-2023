import fs from "fs";
import readline from "readline";

interface RangeMap {
  destinationRangeStart: number;
  sourceRangeStart: number;
  rangeLength: number;
}

type RangeMaps = Array<RangeMap[]>;

function handleSeed(seed: number, rangeMaps: RangeMaps): number {
  const mappedSeed = rangeMaps.reduce((currentSeed, mapRules) => {
    console.log(`======= Next phase seed ${seed} ========`);
    let destinationSeed = currentSeed;

    mapRules.forEach((ruleSet) => {
      if (
        currentSeed >= ruleSet.sourceRangeStart &&
        currentSeed <= ruleSet.sourceRangeStart + ruleSet.rangeLength
      ) {
        const diff = currentSeed - ruleSet.sourceRangeStart;

        destinationSeed = ruleSet.destinationRangeStart + diff;
      }
    });

    return destinationSeed;
  }, seed);

  console.log(`======= Phase over seed ${mappedSeed} ========`);

  return mappedSeed;
}

async function main() {
  console.log("start");
  const fileStream = fs.createReadStream("./src/input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let seeds: number[] = [];
  let currentBlock: keyof RangeMaps | null = null;
  let currentBlockArray: RangeMap[] = [];
  const rangeMaps: RangeMaps = [];

  for await (const line of rl) {
    if (line === "" && currentBlock !== null) {
      rangeMaps.push([...currentBlockArray]);
      currentBlock = null;
      currentBlockArray = [];
    }

    if (line.includes("seeds")) {
      const [_text, seedData] = line.split(": ");

      seeds = seedData.split(" ").map((seed) => {
        return Number(seed);
      });

      continue;
    }

    if (line.includes("map")) {
      currentBlock = line.split(" map")[0] as keyof RangeMaps;
      continue;
    }

    if (currentBlock === null) continue;

    const map = line.split(" ");

    if (map.length !== 3) throw new Error("Map incorrect length");

    currentBlockArray.push({
      destinationRangeStart: Number(map[0]),
      sourceRangeStart: Number(map[1]),
      rangeLength: Number(map[2]),
    });
  }

  rangeMaps.push([...currentBlockArray]);

  const part1Total = seeds.reduce((currentLowest, seed) => {
    const mappedSeed = handleSeed(seed, rangeMaps);

    return mappedSeed < currentLowest ? mappedSeed : currentLowest;
  }, seeds[0]);

  console.log(part1Total);
}

main();
