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
export const distanceToIgnorePathfinder =
  Math.max(playgroundSize.x, playgroundSize.y) /
  Math.min(grid[0]?.length || grid.length, grid.length);
export const distanceToDoDmg = 50;
export const distanceToMove = 20;
export const imgSize: Map<string, number> = new Map<string, number>([
  ["player", 100],
  ["bullet", 8],
  ["turret", 100],
]);

const bulletImg = "/bullet.png";
export const bulletImgURL = `url('${bulletImg}')`;

const turretImg = "/turret.png";
export const turretImgURL = `url('${turretImg}')`;

export const guns = [
  {
    name: "Desert Eagle",
    url: `url('/desertEagle.png')`,
    damage: 1,
    auto: false,
    piercing: 1,
    bulletSpeed: 12,
    range: 60,
  },
  {
    name: "Magnum",
    url: `url('/magnum.png')`,
    damage: 100,
    auto: false,
    piercing: 100,
    bulletSpeed: 8,
    range: 50,
  },
  {
    name: "Uzi",
    url: `url('/uzi.png')`,
    damage: 1,
    auto: true,
    cadence: 20,
    piercing: 1,
    bulletSpeed: 15,
    range: 60,
  },
  {
    name: "Shotgun",
    url: `url('/shotgun.png')`,
    damage: 5,
    auto: false,
    piercing: 1,
    bulletSpeed: 8,
    range: 40,
  },
  {
    name: "M4",
    url: `url('/m4.png')`,
    damage: 5,
    auto: true,
    cadence: 5,
    piercing: 3,
    bulletSpeed: 12,
    range: 80,
  },
  {
    name: "Gatling gun",
    url: `url('/gatlingGun.png')`,
    damage: 10,
    auto: true,
    cadence: 10,
    piercing: 10,
    bulletSpeed: 20,
    range: 100,
  },
];
export const numberOfGuns = Object.keys(guns).length;

export const monsters = [
  {
    name: "Boss",
    url: `url('/boss.gif')`,
    imgSize:200,
    damage: 100,
    colision: 50,
    hp: 500,
    speed: 2,
    rotationOffset : Math.PI /2,
    cash:500
  },
  {
    name: "Basic zombie",
    url: `url('/basicZombie.gif')`,
    imgSize:100,
    damage: 1,
    colision: 50,
    hp: 3,
    speed: 6,
    cash:3
  },
  {
    name: "Strong zombie",
    url: `url('/strongZombie.gif')`,
    imgSize:100,
    damage: 50,
    colision: 50,
    hp: 100,
    speed: 4,
    cash:100
  },
  {
    name: "Green zombie",
    url: `url('/greenZombie.gif')`,
    imgSize:100,
    damage: 20,
    colision: 50,
    hp: 20,
    speed: 4,
    cash:20
  },
  {
    name: "Samara",
    imgSize:1,
    url: ``,
    damage: 1000,
    colision: 100,
    hp: 1,
    speed: 1,
    cash:1000
  },

];
export const numberOfMonsters = Object.keys(monsters).length;
