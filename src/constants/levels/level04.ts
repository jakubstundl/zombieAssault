import type { Coords } from "../schemas";
import { downright, rightdown } from "../gameConstants";
import {
  pushEnemies,
} from "../functions";
import { basicZombie, greenZombie } from "../objectProperties/monsterProperties";


export const level4 = new Map<string, string | number | [number, Coords][]>();

const enemies: [number, Coords][] = [
...pushEnemies(greenZombie, 5000, "random" ),

];



level4.set("totalEnemies", enemies.length);
level4.set("spawnAtTheTimeEnemies", 200);
level4.set("enemies", enemies);
