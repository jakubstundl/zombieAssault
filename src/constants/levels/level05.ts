import type { Coords } from "../schemas";
import { downright, rightdown } from "../gameConstants";
import {
  pushEnemies,
} from "../functions";
import { basicZombie, greenZombie } from "../objectProperties/monsterProperties";


export const level5 = new Map<string, string | number | [number, Coords][]>();

const enemies: [number, Coords][] = [
...pushEnemies(greenZombie, 200, "random" ),

];



level5.set("totalEnemies", enemies.length);
level5.set("spawnAtTheTimeEnemies", 50);
level5.set("enemies", enemies);
