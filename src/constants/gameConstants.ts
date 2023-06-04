import { Player } from "../server/gameLogic/PlayerClass";
import type { Coords } from "./schemas";

export const playgroundSize: Coords = { x: 2500, y: 2500 };

export const grid: number[][] = [
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 2],
  [2, 2, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 2, 2],
  [2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 2, 2, 2],
  [2, 2, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 2, 2],
  [2, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 2, 2],
  [2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 2, 2],
  [2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 2, 2],
  [2, 2, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 2, 2],
  [2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 2, 2],
  [2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2],
  [2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2],
  [2, 2, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 2, 2],
  [2, 2, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 2, 2],
  [2, 2, 2, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 2, 2, 2],
  [2, 2, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 2, 2],
  [2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
];
export const playgroundTiles: Coords = {
  x: grid[0]?.length || grid.length,
  y: grid.length,
};
export const playerSpawnPosition = {
  x: 1400,
  y: 1450,
};
export const numberOfEnemiesAtTheTime = 70;
export const numberOfTotal = 5000;
export const distanceToIgnorePathfinder = Math.max(playgroundSize.x, playgroundSize.y)/Math.min(grid[0]?.length || grid.length,grid.length)*Math.SQRT2
export const distanceToDoDmg = 50;
export const distanceToMove = 20;
export const imgSize: Map<string, number> = new Map<string, number>([
  ["player", Player.imgSize()],
  ["enemy", 100],
  ["bullet", 8],
]);

const bulletImg = "/bullet.png";
export const bulletImgURL = `url('${bulletImg}')`;

export const coordsDistance = (a: Coords, b: Coords): number => {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
};

export const allowedArea = (x: number, y: number): boolean => {
  const offset = (imgSize.get("player") || 0) / 4;
  const points = [
    [x + offset, y],
    [x - offset, y],
    [x, y + offset],
    [x, y - offset],
    [x + offset, y + offset],
    [x + offset, y - offset],
    [x - offset, y + offset],
    [x - offset, y - offset],
  ];

  for (let i = 0; i < points.length; i++) {
    const tx0 = Math.floor(
      (points[i]?.[0] || 0) / (playgroundSize.x / playgroundTiles.x)
    );
    const ty0 = Math.floor(
      (points[i]?.[1] || 0) / (playgroundSize.y / playgroundTiles.y)
    );
    if (grid && tx0 && ty0 && grid[tx0] && grid[tx0]) {
      if (grid[ty0]?.[tx0] != 0) {
       
        return false;
      }
    }
  }
 
  return true;
};
export const allowedAreaForBullets = (x: number, y: number): boolean => {
  

 
    const tx0 = Math.floor(
      x / (playgroundSize.x / playgroundTiles.x)
    );
    const ty0 = Math.floor(
     y / (playgroundSize.y / playgroundTiles.y)
    );
    if (grid && tx0 && ty0 && grid[tx0] && grid[tx0]) {
     return (grid[ty0]?.[tx0] == 0 || grid[ty0]?.[tx0] == 2) 
    
  }
  console.log("allowed");
  return true;
};

export const enemyRandomSpawnCoords = (): Coords => {
  const walls = ["left", "right", "up", "down"];
  const choosenWall = walls[Math.floor(Math.random() * walls.length)];
  switch (choosenWall) {
    case "left":
      return { x: 0, y: Math.floor(Math.random() * playgroundSize.y) };
    case "right":
      return {
        x: playgroundSize.x - 1,
        y: Math.floor(Math.random() * playgroundSize.y - 1),
      };
    case "up":
      return { x: Math.floor(Math.random() * playgroundSize.x), y: 0 };
    case "down":
      return {
        x: Math.floor(Math.random() * playgroundSize.x),
        y: playgroundSize.y - 1,
      };
    default:
      return {
        x: Math.floor(Math.random() * playgroundSize.x),
        y: Math.floor(Math.random() * playgroundSize.y),
      };
      break;
  }
};
