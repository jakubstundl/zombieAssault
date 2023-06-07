import type { Coords } from "../schemas";
import { downright, rightdown } from "../gameConstants";
import {
  pushEnemies,
} from "../functions";
import { basicZombie } from "../objectProperties/monsterProperties";

export const level2 = new Map<string, string | number | [number, Coords][]>();

const enemies: [number, Coords][] = [
...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),
...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),
...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),...pushEnemies(basicZombie, 5, rightdown),
...pushEnemies(basicZombie, 5, downright),


];



level2.set("totalEnemies", enemies.length);
level2.set("spawnAtTheTimeEnemies", 50);
level2.set("enemies", enemies);
