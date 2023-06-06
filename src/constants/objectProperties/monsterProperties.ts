import type { MonsterProperties } from "../schemas";

export const monsters:MonsterProperties[] = [
  
    {
      type: "Basic zombie",
      monterIndex:0,
      url: `url('/basicZombie.gif')`,
      imgSize:100,
      damage: 1,
      colision: 50,
      hp: 3,
      speed: 6,
      cash:1
    },
    {
      type: "Green zombie",
      monterIndex:1,
      url: `url('/greenZombie.gif')`,
      imgSize:150,
      damage: 20,
      colision: 75,
      hp: 6,
      speed: 4,
      cash:3
    },
    {
      type: "Strong zombie",
      monterIndex:2,
      url: `url('/strongZombie.gif')`,
      imgSize:150,
      damage: 50,
      colision: 75,
      hp: 12,
      speed: 4,
      cash:2
    },
    
    {
      type: "Samara",
      monterIndex:3,
      url: ``,
      imgSize:1,
      damage: 1000,
      colision: 100,
      hp: 1,
      speed: 1,
      cash:0
    },
    {
      type: "Boss",
      monterIndex:4,
      url: `url('/boss.gif')`,
      imgSize:300,
      damage: 100,
      colision: 150,
      hp: 50,
      speed: 2,
      rotationOffset : Math.PI /2,
      cash:5
    },
  
  ];