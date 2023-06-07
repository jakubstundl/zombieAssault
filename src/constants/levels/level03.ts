import type { Coords } from "../schemas";
import { downright, rightdown } from "../gameConstants";
import {
  pushEnemies,
} from "../functions";
import { basicZombie, greenZombie } from "../objectProperties/monsterProperties";

export const level3 = new Map<string, string | number | [number, Coords][]>();

const enemies: [number, Coords][] = [
...pushEnemies(greenZombie, 5, rightdown),
...pushEnemies(greenZombie, 5, downright),
...pushEnemies(greenZombie, 5, rightdown),
...pushEnemies(greenZombie, 5, downright),
...pushEnemies(greenZombie, 5, rightdown),
...pushEnemies(greenZombie, 5, downright),
...pushEnemies(greenZombie, 5, rightdown),
...pushEnemies(greenZombie, 5, downright),
...pushEnemies(greenZombie, 5, rightdown),
...pushEnemies(greenZombie, 5, downright),
];



level3.set("totalEnemies", enemies.length);
level3.set("spawnAtTheTimeEnemies", 10);
level3.set("enemies", enemies);
