import type { Coords } from "../schemas";
import { downright, rightdown } from "../gameConstants";
import {
  pushEnemies,
} from "../functions";
import { basicZombie, greenZombie, samara } from "../objectProperties/monsterProperties";


export const level6 = new Map<string, string | number | [number, Coords][]>();

const enemies: [number, Coords][] = [
...pushEnemies(samara, 2000, "random" ),

];



level6.set("totalEnemies", enemies.length);
level6.set("spawnAtTheTimeEnemies", 100);
level6.set("enemies", enemies);
