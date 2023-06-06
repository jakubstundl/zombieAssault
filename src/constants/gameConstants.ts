import { guns } from "./objectProperties/gunProperties";
import { monsters } from "./objectProperties/monsterProperties";
import { turrets } from "./objectProperties/turretProperties";
import type { Coords} from "./schemas";

export const playgroundSize: Coords = { x: 5000, y: 5000 };

export const grid: number[][] = [
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 2],
  [2, 2, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 2, 2],
  [2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 2, 2, 2],
  [2, 2, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 2, 2],
  [2, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 2, 2],
  [2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 2, 2],
  [2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 2, 2],
  [2, 2, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 2, 2],
  [2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 2, 2],
  [2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2],
  [2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2],
  [2, 2, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 2, 2],
  [2, 2, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 2, 2],
  [2, 2, 2, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 2, 2, 2],
  [2, 2, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 2, 2],
  [2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
];
export const playgroundTiles: Coords = {
  x: grid[0]?.length || grid.length,
  y: grid.length,
};
export const playerSpawnPosition = {
  x: 1400,
  y: 1450,
};
export const numberOfEnemiesAtTheTime = 20;
export const numberOfTotal = 5000;
export const distanceToIgnorePathfinder =
 ( Math.min(playgroundSize.x, playgroundSize.y) /
  Math.max(grid[0]?.length || grid.length, grid.length))*Math.SQRT2;
export const distanceToDoDmg = 50;
export const distanceToMove = 20;
export const enemySlowDownDurationAfterHit = 1000;
export const enemyInterval = 200
export const imgSize: Map<string, number> = new Map<string, number>([
  ["player", 100],
  ["bullet", 8],
  ["turret", 100],
]);


const bulletImg = "/bullet.png";
export const bulletImgURL = `url('${bulletImg}')`;

const turretImg = "/turret.png";
export const turretImgURL = `url('${turretImg}')`;


export { guns, turrets, monsters };
export const numberOfGuns = Object.keys(guns).length;
export const numberOfMonsters = Object.keys(monsters).length;
export const numberOfturrets = Object.keys(turrets).length;

export const availableGunsInit:boolean[] = new Array<boolean>(numberOfGuns)
availableGunsInit.fill(false)
availableGunsInit[0] = true;
