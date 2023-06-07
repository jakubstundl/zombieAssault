import type { GunProperties } from "../schemas";

export const guns: GunProperties[] = [
  {
    type: "Desert Eagle",
    gunIndex: 0,
    cashToUnlock:0,
    url: `url('/desertEagle.png')`,
    damage: 1,
    auto: false,
    piercing: 1,
    bulletSpeed: 24,
    bulletRange: 60,
  },
  {
    type: "Uzi",
    gunIndex: 1,
    cashToUnlock:50,
    url: `url('/uzi.png')`,
    damage: 0.5,
    auto: true,
    cadence: 20,
    piercing: 1,
    bulletSpeed: 30,
    bulletRange: 60,
  },
  {
    type: "Magnum",
    gunIndex: 2,
    cashToUnlock:1000,
    url: `url('/magnum.png')`,
    damage: 17,
    auto: false,
    piercing: 100,
    bulletSpeed: 16,
    bulletRange: 50,
  },
  {
    type: "Shotgun",
    gunIndex: 3,
    cashToUnlock:1000,
    url: `url('/shotgun.png')`,
    damage: 2,
    auto: false,
    piercing: 1,
    bulletSpeed: 16,
    bulletRange: 40,
  },
  {
    type: "M4",
    gunIndex: 4,
    cashToUnlock:5000,
    url: `url('/m4.png')`,
    damage: 3,
    auto: true,
    cadence: 5,
    piercing: 3,
    bulletSpeed: 24,
    bulletRange: 80,
  },
  {
    type: "Gatling gun",
    gunIndex: 5,
    cashToUnlock:10000,
    url: `url('/gatlingGun.png')`,
    damage: 5,
    auto: true,
    cadence: 10,
    piercing: 3,
    bulletSpeed: 40,
    bulletRange: 100,
  },
];

export const numberOfGuns = Object.keys(guns).length;

export const availableGunsInit:boolean[] = new Array<boolean>(numberOfGuns)
availableGunsInit.fill(false)
availableGunsInit[0] = true;
