import type { Coords } from "../schemas";
import { downright, rightdown } from "../gameConstants";
import {
  pushEnemies,
} from "../functions";
import { basicZombie, boss, greenZombie, samara, strongZombie } from "../objectProperties/monsterProperties";


export const level8 = new Map<string, string | number | [number, Coords][]>();

const enemies: [number, Coords][] = [
...pushEnemies(boss, 10, "random" ),
...pushEnemies(strongZombie, 20, "random" ),
...pushEnemies(greenZombie, 50, "random" ),
...pushEnemies(samara, 10, "random" ),
...pushEnemies(basicZombie, 150, "random" ),

...pushEnemies(boss, 10, "random" ),
...pushEnemies(strongZombie, 20, "random" ),
...pushEnemies(greenZombie, 50, "random" ),
...pushEnemies(samara, 10, "random" ),
...pushEnemies(basicZombie, 150, "random" ),

...pushEnemies(boss, 10, "random" ),
...pushEnemies(strongZombie, 20, "random" ),
...pushEnemies(greenZombie, 50, "random" ),
...pushEnemies(samara, 10, "random" ),
...pushEnemies(basicZombie, 150, "random" ),

...pushEnemies(boss, 10, "random" ),
...pushEnemies(strongZombie, 20, "random" ),
...pushEnemies(greenZombie, 50, "random" ),
...pushEnemies(samara, 10, "random" ),
...pushEnemies(basicZombie, 150, "random" ),

...pushEnemies(boss, 10, "random" ),
...pushEnemies(strongZombie, 20, "random" ),
...pushEnemies(greenZombie, 50, "random" ),
...pushEnemies(samara, 10, "random" ),
...pushEnemies(basicZombie, 150, "random" ),

...pushEnemies(boss, 10, "random" ),
...pushEnemies(strongZombie, 20, "random" ),
...pushEnemies(greenZombie, 50, "random" ),
...pushEnemies(basicZombie, 150, "random" ),
...pushEnemies(samara, 10, "random" ),




];



level8.set("totalEnemies", enemies.length);
level8.set("spawnAtTheTimeEnemies", 200);
level8.set("enemies", enemies);
