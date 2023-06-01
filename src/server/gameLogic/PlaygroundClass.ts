import {
  imgSize,
  playgroundSize,
  playgroundTiles,
} from "../../constants/gameConstants";
import type {
  ClientMovement,
  RotationData,
  BulletsState,
  EnemiesState,
  PlayersState,
} from "../../constants/schemas";

import { Player } from "./PlayerClass";
import { Bullet } from "./BulletClass";
import { Enemy } from "./EnemyClass";

export class Playground {
  private _size = playgroundSize;
  private _players: Map<string, Player> = new Map<string, Player>();
  private _bullets: Map<number, Bullet> = new Map<number, Bullet>();
  private _bulletCounter = 0;
  private _enemies: Map<number, Enemy> = new Map<number, Enemy>();
  constructor() {
    for (let i = 0; i < 1; i++) {
      this._enemies.set(
        i,
        new Enemy({
          x: Math.floor(Math.random() * this._size.x - 1),
          y: Math.floor(0),
        })
      );
    }
   /*  for (let i = 20; i < 40; i++) {
      this._enemies.set(
        i,
        new Enemy({
          x: Math.floor(0),
          y: Math.floor(Math.random() * this._size.y - 1),
        })
      );
    }
    for (let i = 40; i < 60; i++) {
      this._enemies.set(
        i,
        new Enemy({
          x: Math.floor(Math.random() * this._size.x - 1),
          y: Math.floor(this._size.y - 1),
        })
      );
    }
    for (let i = 60; i < 80; i++) {
      this._enemies.set(
        i,
        new Enemy({
          x: Math.floor(this._size.x - 1),
          y: Math.floor(Math.random() * this._size.y - 1),
        })
      );
    }*/
  } 
  get players(){
    return this._players
  }
  get imgSize(): Map<string, number> {
    return imgSize;
  }

  get size() {
    return this._size;
  }

  setInput(input: ClientMovement) {
    if (input.name) {
      if (!this._players.has(input.name)) {
        this._players.set(input.name, new Player());
      }
      this._players.get(input.name)?.play(input);
    }
  }

  fire(bulletData: RotationData) {
    if (this._players.has(bulletData.name)) {
      const x0y0 = this._players.get(bulletData.name)?.coords;
      if (x0y0) {
        const angle = bulletData.rotation;
        this._bullets.set(
          this._bulletCounter,
          new Bullet({ x: x0y0.x, y: x0y0.y }, angle)
        );
        this._bulletCounter++;
      }
    }
    console.log(this._bulletCounter);
  }

  getPlayersState(): PlayersState {
    const state: PlayersState = {};
    this._players.forEach((player, name) => {
      if (player) {
        state[name] = {
          x: player.coords.x - (this.imgSize.get("player") || 0) / 2,
          y: player.coords.y - (this.imgSize.get("player") || 0) / 2,
        };
      }
    });
    return state;
  }

  getBulletsState(): BulletsState {
    const state: BulletsState = [];
    this._bullets.forEach((bullet) => {
      if (bullet) {
        state.push({ x: bullet.coords.x, y: bullet.coords.y });
      }
    });
    return state;
  }

  getEnemiesState(): EnemiesState {
    const state: EnemiesState = {};
    this._enemies.forEach((enemy, enemyIndex) => {
      if (enemy) {
        state[enemyIndex] = {
          x: enemy.coords.x - (this.imgSize.get("enemy") || 0) / 2,
          y: enemy.coords.y - (this.imgSize.get("enemy") || 0) / 2,
          hp: enemy.hp,
        };
      }
    });
    return state;
  }

  interval: NodeJS.Timer = setInterval(() => {
    this._players.forEach((player) => {
      player.move(this.size);
    });
    this._enemies.forEach((enemy) => {
      enemy.move();
    });
    this._bullets.forEach((bullet, bulletIndex) => {
      bullet.move();
      if (bullet.lifeSpan < 0) {
        this._bullets.delete(bulletIndex);
      }
      this._enemies.forEach((enemy, enemyIndex) => {
        if (bullet.hit(enemy)) {
          this._bullets.delete(bulletIndex);
        }
        if (enemy.hp < 0) {
          this._enemies.delete(enemyIndex);
        }
      });
    });
  }, 20);

  get tilesCenters() {
    playgroundTiles;
    return false;
  }
}
