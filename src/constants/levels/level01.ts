import type { Coords } from "../schemas";
import { downright, rightdown } from "../gameConstants";
import {
  pushEnemies,
} from "../functions";
import { basicZombie } from "../objectProperties/monsterProperties";

export const level1 = new Map<string, string | number | [number, Coords][]>();

const enemies: [number, Coords][] = [
...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),
...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),
...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),
...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),
...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright) ,
];



level1.set("totalEnemies", enemies.length);
level1.set("spawnAtTheTimeEnemies", 10);
level1.set("enemies", enemies);
