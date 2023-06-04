import {
  enemyRandomSpawnCoords,
  imgSize,
  playgroundSize,
  playgroundTiles,
numberOfEnemiesAtTheTime,
  numberOfTotal,
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
  private _enemyCounter = 0;
  private _enemySpawnAtTheTime = numberOfEnemiesAtTheTime;
  private _enemyTotalNumber = numberOfTotal;
  private _enemies: Map<number, Enemy> = new Map<number, Enemy>();
  private _pause = true;
  constructor() {
    console.log("Playground has been initialized");
    console.log(playgroundTiles);
  }
  get players() {
    return this._players;
  }
  get imgSize(): Map<string, number> {
    return imgSize;
  }
  pause(): void {
    this._pause = !this._pause;
  }
  get isPaused(){
    return this._pause
  }

  get size() {
    return this._size;
  }
  get enemiesToKill(){
    return `${this._enemyTotalNumber}`
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
    if (!this.isPaused && this._players.has(bulletData.name)) {
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
   // console.log(this._bulletCounter);
  }

  getPlayersState(): PlayersState {
    const state: PlayersState = {};
    this._players.forEach((player, name) => {
      if (player) {
        state[name] = {
          x: player.coords.x - (this.imgSize.get("player") || 0) / 2,
          y: player.coords.y - (this.imgSize.get("player") || 0) / 2,
          hp: player.hp,
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
          rotation: enemy.rotation,
        };
      }
    });
    return state;
  }

  interval: NodeJS.Timer = setInterval(() => {
    if (this._players.size > 0 && !this._pause) {
      this._players.forEach((player, name) => {
        player.move(this.size);
        if (player.hp <= 0) {
          this._players.delete(name);
        }
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
            this._enemies.get(enemyIndex)?.clearInterval();
            this._enemies.delete(enemyIndex);
          }
        });
      });
      if (
        this._enemies.size < this._enemySpawnAtTheTime &&
        this._enemyTotalNumber > 0
      ) {
        this._enemies.set(
          this._enemyCounter,
          new Enemy(enemyRandomSpawnCoords())
        );
        this._enemyCounter++;
        this._enemyTotalNumber--;
      }
    }
  }, 20);

  get tilesCenters() {
    playgroundTiles;
    return false;
  }
}
