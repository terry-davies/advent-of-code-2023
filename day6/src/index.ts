import fs from "fs";

const input = fs.readFileSync("./src/input.txt", "utf8").replace(/\r/g, "");

const newLineRegex = /\r|\n/;

interface RaceData {
  times: number[];
  distances: number[];
}

interface SingleRaceData {
  time: number;
  distance: number;
}

function parseRaceData(text: string): RaceData {
  const [times, distance] = text.split("\n");

  if (
    !!newLineRegex.exec(times)?.length ||
    !!newLineRegex.exec(distance)?.length
  ) {
    throw new Error("Dataset format incorrect");
  }

  return {
    times: times.replace("Time:", "").trim().split(/\s+/).map(Number),
    distances: distance
      .replace("Distance:", "")
      .trim()
      .split(/\s+/)
      .map(Number),
  };
}

function transformRaceData(raceData: RaceData): SingleRaceData {
  return {
    time: Number(raceData.times.join("")),
    distance: Number(raceData.distances.join("")),
  };
}

function computeRaceData(raceData: RaceData) {
  return raceData.times.reduce((currentTotal, time, raceIndex) => {
    const distance = raceData.distances[raceIndex];

    let recordBeatCount = findWinningDistancesCount({ time, distance });

    return currentTotal * recordBeatCount;
  }, 1);
}

function findWinningDistancesCount(raceData: SingleRaceData) {
  //  7ms 9mm 2,3,4,5
  // 15ms 40mm 4,5,6,7,8,9,10,11
  // 30ms 200mm 11,12,13,14,15,16,17,18,19

  // 7ms
  // 0 0
  // 1 6  i*6
  // 2 10 i*5
  // 3 12 i*4
  // 4 12 i*3
  // 5 10 i*2
  // 6 6 i*1
  // 7 0 i*0

  // x * (time -x) - record = 0
  // -x^2 + time * x - record = 0
  // old skool maths time
  // a=-1, b=time, c=-record

  const a = -1;
  const b = raceData.time;
  const c = -raceData.distance;

  const der = b * b - 4 * a * c;

  const low = ((-b + Math.sqrt(der)) / 2) * a;
  const high = ((-b - Math.sqrt(der)) / 2) * a;

  return Math.ceil(high) - Math.floor(low) - 1;
}

const raceData = parseRaceData(input);

console.log(computeRaceData(raceData));

console.log(findWinningDistancesCount(transformRaceData(parseRaceData(input))));
