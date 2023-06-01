import { Player } from "../server/gameLogic/PlayerClass";
import type { Coords } from "./schemas";

export const playgroundSize:Coords = {x: 5000, y:5000}

export const grid:number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
export const playgroundTiles:Coords = {x:grid[0]?.length||grid.length,y:grid.length}
export const playerSpawnPosition = {x:playgroundSize.x /2, y:playgroundSize.y/2}
export const numberOfEnemies = 200

export const imgSize: Map<string, number> = new Map<string, number>([
    ["player", Player.imgSIze()],
    ["enemy", 100],
    ["bullet", 4],
  ]);

const bulletImg =  '/bullet.jpg'
export const bulletImgURL = `url('${bulletImg}')`

export const coordsDistance = (a:Coords, b:Coords):number=>{
  return Math.sqrt((a.x-b.x)**2+(a.y-b.y))
}

