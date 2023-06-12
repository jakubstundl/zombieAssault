import type { Coords } from "../schemas";
import { downright, rightdown } from "../gameConstants";
import {
  pushEnemies,
} from "../functions";
import { basicZombie, boss, greenZombie } from "../objectProperties/monsterProperties";


export const level7 = new Map<string, string | number | [number, Coords][]>();

const enemies: [number, Coords][] = [
...pushEnemies(boss, 1, "random" ),
...pushEnemies(greenZombie, 20, "random" ),
...pushEnemies(basicZombie, 200, "random" ),

...pushEnemies(boss, 1, "random" ),
...pushEnemies(greenZombie, 20, "random" ),
...pushEnemies(basicZombie, 200, "random" ),

...pushEnemies(boss, 1, "random" ),
...pushEnemies(greenZombie, 20, "random" ),
...pushEnemies(basicZombie, 200, "random" ),

...pushEnemies(boss, 1, "random" ),
...pushEnemies(greenZombie, 20, "random" ),
...pushEnemies(basicZombie, 200, "random" ),

...pushEnemies(boss, 1, "random" ),
...pushEnemies(greenZombie, 20, "random" ),
...pushEnemies(basicZombie, 200, "random" ),


];



level7.set("totalEnemies", enemies.length);
level7.set("spawnAtTheTimeEnemies", 100);
level7.set("enemies", enemies);
