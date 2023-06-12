import { playerMovingSpeed } from "../gameConstants";
import type { MonsterProperties } from "../schemas";



export const monsters:MonsterProperties[] = [
  
    {
      type: "Basic zombie",
      monsterIndex:0,
      url: `url('/basicZombie.gif')`,
      imgSize:100,
      damage: 1,
      colision: 40,
      hp: 3,
      speed: playerMovingSpeed,
      cash:1
    },
    {
      type: "Green zombie",
      monsterIndex:1,
      url: `url('/greenZombie.gif')`,
      imgSize:150,
      damage: 20,
      colision: 60,
      hp: 50,
      speed: playerMovingSpeed*0.8,
      cash:3
    },
    {
      type: "Strong zombie",
      monsterIndex:2,
      url: `url('/strongZombie.gif')`,
      imgSize:150,
      damage: 50,
      colision: 60,
      hp: 200,
      speed: playerMovingSpeed*0.6,
      cash:2
    },
    
    {
      type: "Samara",
      monsterIndex:3,
      url: ``,
      imgSize:1,
      damage: 1000,
      colision: 100,
      hp: 1,
      speed: playerMovingSpeed*0.2,
      cash:0
    },
    {
      type: "Boss",
      monsterIndex:4,
      url: `url('/boss.gif')`,
      imgSize:300,
      damage: 100,
      colision: 120,
      hp: 1000,
      speed: playerMovingSpeed*0.4,
      rotationOffset : Math.PI /2,
      cash:5
    },
  
  ];

export const numberOfMonsters = Object.keys(monsters).length;
export const basicZombie = monsters.filter((monster)=>monster.type == "Basic zombie")[0]?.monsterIndex || 0
export const greenZombie = monsters.filter((monster)=>monster.type == "Green zombie")[0]?.monsterIndex || 1
export const strongZombie = monsters.filter((monster)=>monster.type == "Strong zombie")[0]?.monsterIndex || 2
export const samara = monsters.filter((monster)=>monster.type == "Samara")[0]?.monsterIndex || 3
export const boss = monsters.filter((monster)=>monster.type == "Boss")[0]?.monsterIndex || 4