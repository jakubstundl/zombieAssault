import {
  grid,
  imgSize,
  playgroundSize,
  playgroundTiles,
  numberOfMonsters
} from "./gameConstants";
import type { Coords } from "./schemas";

export const coordsDistance = (a: Coords, b: Coords): number => {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
};

export const allowedAreaForPlayers = (x: number, y: number): boolean => {
  const offset = (imgSize.get("player") || 0) / 4;
  const points = [
    [x + offset, y],
    [x - offset, y],
    [x, y + offset],
    [x, y - offset],
    [x + offset*Math.SQRT1_2, y + offset*Math.SQRT1_2],
    [x + offset*Math.SQRT1_2, y - offset*Math.SQRT1_2],
    [x - offset*Math.SQRT1_2, y + offset*Math.SQRT1_2],
    [x - offset*Math.SQRT1_2, y - offset*Math.SQRT1_2],
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
  const tx0 = Math.floor(x / (playgroundSize.x / playgroundTiles.x));
  const ty0 = Math.floor(y / (playgroundSize.y / playgroundTiles.y));
  if (grid && tx0 && ty0 && grid[tx0] && grid[tx0]) {
    return grid[ty0]?.[tx0] == 0 || grid[ty0]?.[tx0] == 2;
  }
  return true;
};

export const enemyRandomSpawnCoords = (): Coords => {
  const walls = ["left", "right", "up", "down"];
  

  const safeOffset = 10
  const choosenWall = walls[Math.floor(Math.random() * walls.length)];
  switch (choosenWall) {
    case "left":
      return { x: safeOffset, y: Math.floor(Math.random() * playgroundSize.y-safeOffset) };
    case "right":
      return {
        x: playgroundSize.x - safeOffset,
        y: Math.floor(Math.random() * playgroundSize.y - safeOffset),
      };
    case "up":
      return { x: Math.floor(Math.random() * playgroundSize.x-safeOffset), y: safeOffset };
    case "down":
      return {
        x: Math.floor(Math.random() * playgroundSize.x-safeOffset),
        y: playgroundSize.y - safeOffset,
      };
    default:
      return {
        x: Math.floor(Math.random() * playgroundSize.x-safeOffset),
        y: Math.floor(Math.random() * playgroundSize.y-safeOffset),
      };
      break;
  }
};

export const spawnRandomEnemy = ():number =>{
  return Math.floor(Math.random() * numberOfMonsters);
}
