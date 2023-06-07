import {
  grid,
  imgSize,
  playgroundSize,
  playgroundTiles,
  
} from "./gameConstants";
import { numberOfMonsters } from "./objectProperties/monsterProperties";
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

const safeOffset = 10;
export const upleftF = (): Coords => {
  return {
    x: Math.floor((Math.random() * playgroundSize.x) / 2) + safeOffset,
    y: safeOffset,
  };
};

export const uprightF = (): Coords => {
  return {
    x:
      Math.floor(
        (Math.random() * playgroundSize.x) / 2 + playgroundSize.x / 2
      ) - safeOffset,
    y: safeOffset,
  };
};

export const downleftF = (): Coords => {
  return {
    x: Math.floor((Math.random() * playgroundSize.x) / 2) + safeOffset,
    y: playgroundSize.y - safeOffset,
  };
};
export const downrightF = (): Coords => {
  return {
    x:
      Math.floor(
        (Math.random() * playgroundSize.x) / 2 + playgroundSize.x / 2
      ) - safeOffset,
    y: playgroundSize.y - safeOffset,
  };
};

export const leftupF = (): Coords => {
  return {
    x: safeOffset,
    y: Math.floor((Math.random() * playgroundSize.y) / 2) + safeOffset,
  };
};
export const leftdownF = (): Coords => {
  return {
    x: safeOffset,
    y:
      Math.floor(
        (Math.random() * playgroundSize.y) / 2 + playgroundSize.y / 2
      ) - safeOffset,
  };
};

export const rightupF = (): Coords => {
  return {
    x: playgroundSize.x - safeOffset,
    y: Math.floor((Math.random() * playgroundSize.y) / 2) + safeOffset,
  };
};
export const rightdownF = (): Coords => {
  return {
    x: playgroundSize.x - safeOffset,
    y:
      Math.floor(
        (Math.random() * playgroundSize.y) / 2 + playgroundSize.y / 2
      ) - safeOffset,
  };
};


export const pushEnemies = (enemy: number, count: number, coords: string):[number, Coords][] => {
  const enemies:[number, Coords][] = []
  for (let i = 0; i < count; i++) {
    let coord;
    switch (coords) {
      case "rightup":
        coord = rightupF();
        break;
        case "rightdown":
        coord = rightdownF();
        break;
        case "leftup":
        coord = leftupF();
        break;
        case "leftdown":
        coord = leftdownF();
        break;
        case "upleft":
        coord = upleftF();
        break;
        case "upright":
        coord = uprightF();
        break;
        case "downleft":
        coord = downleftF();
        break;
        case "downright":
        coord = downrightF();
        break;
        case "random":
        coord = enemyRandomSpawnCoords();
          break;
      default:
        coord = { x: 0, y: 0 };
        break;
    }
    enemies.push([enemy, coord]);
  }
  return enemies
};