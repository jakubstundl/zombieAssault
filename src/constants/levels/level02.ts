import type { Coords } from "../schemas";
import { downright, rightdown } from "../gameConstants";
import {
  pushEnemies,
} from "../functions";
import { basicZombie } from "../objectProperties/monsterProperties";

export const level2 = new Map<string, string | number | [number, Coords][]>();

const enemies: [number, Coords][] = [
  //100
...pushEnemies(basicZombie, 25, rightdown),
...pushEnemies(basicZombie, 25, downright),

...pushEnemies(basicZombie, 25, rightdown),
...pushEnemies(basicZombie, 25, downright),

//200
...pushEnemies(basicZombie, 25, rightdown),
...pushEnemies(basicZombie, 25, downright),

...pushEnemies(basicZombie, 25, rightdown),
...pushEnemies(basicZombie, 25, downright),

//300
...pushEnemies(basicZombie, 25, rightdown),
...pushEnemies(basicZombie, 25, downright),

...pushEnemies(basicZombie, 25, rightdown),
...pushEnemies(basicZombie, 25, downright),

//400
...pushEnemies(basicZombie, 25, rightdown),
...pushEnemies(basicZombie, 25, downright),

...pushEnemies(basicZombie, 25, rightdown),
...pushEnemies(basicZombie, 25, downright),

//500
...pushEnemies(basicZombie, 25, rightdown),
...pushEnemies(basicZombie, 25, downright),

...pushEnemies(basicZombie, 25, rightdown),
...pushEnemies(basicZombie, 25, downright),

//600
...pushEnemies(basicZombie, 25, rightdown),
...pushEnemies(basicZombie, 25, downright),

...pushEnemies(basicZombie, 25, rightdown),
...pushEnemies(basicZombie, 25, downright),

//700
...pushEnemies(basicZombie, 25, rightdown),
...pushEnemies(basicZombie, 25, downright),

...pushEnemies(basicZombie, 25, rightdown),
...pushEnemies(basicZombie, 25, downright),

//800
...pushEnemies(basicZombie, 25, rightdown),
...pushEnemies(basicZombie, 25, downright),

...pushEnemies(basicZombie, 25, rightdown),
...pushEnemies(basicZombie, 25, downright),

//900
...pushEnemies(basicZombie, 25, rightdown),
...pushEnemies(basicZombie, 25, downright),

...pushEnemies(basicZombie, 25, rightdown),
...pushEnemies(basicZombie, 25, downright),

///1000
...pushEnemies(basicZombie, 25, rightdown),
...pushEnemies(basicZombie, 25, downright),

...pushEnemies(basicZombie, 25, rightdown),
...pushEnemies(basicZombie, 25, downright),







];



level2.set("totalEnemies", enemies.length);
level2.set("spawnAtTheTimeEnemies", 50);
level2.set("enemies", enemies);
