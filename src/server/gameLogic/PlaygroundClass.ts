import {
  monsters,
  guns,
  imgSize,
  playgroundSize,
  playgroundTiles,
  numberOfEnemiesAtTheTime,
  numberOfTotal,
  turrets,
} from "../../constants/gameConstants";
import type {
  ClientMovement,
  BulletsState,
  EnemiesState,
  PlayersState,
  BulletData,
  BulletContructor,
  Coords,
  EnemyContructor,
  TurretsState,
} from "../../constants/schemas";

import { Player } from "./PlayerClass";
import { Bullet } from "./BulletClass";
import { Enemy } from "./EnemyClass";
import {
  enemyRandomSpawnCoords,
  spawnRandomEnemy,
} from "../../constants/functions";
import { Turret } from "./TurretClass";

export class Playground {
  private _size = playgroundSize;
  private _players: Map<string, Player> = new Map<string, Player>();
  private _bullets: Map<number, Bullet> = new Map<number, Bullet>();
  private _turrets: Map<number, Turret> = new Map<number, Turret>();
  private _bulletCounter = 0;
  private _enemyCounter = 0;
  private _turretCounter = 0;
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
  get enemies() {
    return this._enemies;
  }
  get imgSize(): Map<string, number> {
    return imgSize;
  }
  pause(): void {
    this._pause = !this._pause;
  }
  get isPaused() {
    return this._pause;
  }

  get size() {
    return this._size;
  }
  get enemiesToKill() {
    return `${this._enemyTotalNumber}`;
  }

  setNewPlayer(name:string){
    if (name) {
      if (!this._players.has(name)) {
        this._players.set(name, new Player());
      }
      
    }
  }

  setInput(input: ClientMovement) {
    if (input.name) {
      if (this._players.has(input.name)) {        
        this._players.get(input.name)?.play(input);
      }
    }
  }

  fire(bulletData: BulletData) {
    if (!this.isPaused && this._players.has(bulletData.player)) {
let weapon;
if(bulletData.gun!=undefined){
  weapon = guns[bulletData.gun]
}else{
  if(bulletData.turret!=undefined){
    weapon = turrets[bulletData.turret]
  }
}
      const bulletCOntructor: BulletContructor = {
        coords:
          bulletData.coords ||
          (this._players.get(bulletData.player)?.coords as Coords),
        owner: bulletData.player,
        angle: bulletData.rotation as number,
        damage: weapon?.damage as number,
        piercing: weapon?.piercing as number,
        bulletSpeed: weapon?.bulletSpeed as number,
        range: weapon?.bulletRange as number,
      };
      this._bullets.set(this._bulletCounter, new Bullet(bulletCOntructor));
      this._bulletCounter++;
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
          cash: player.cash,
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
    const state: EnemiesState = [];
    this._enemies.forEach((enemy) => {
      if (enemy) {
        state.push({
          x: enemy.coords.x - (monsters[enemy.monster]?.imgSize || 0) / 2,
          y: enemy.coords.y - (monsters[enemy.monster]?.imgSize || 0) / 2,
          rotation:
            enemy.rotation + (monsters[enemy.monster]?.rotationOffset || 0),
          monster: enemy.monster,
        });
      }
    });
    return state;
  }
  getTurretsState(): TurretsState {
    const state: TurretsState = [];
    this._turrets.forEach((turret) => {
      if (turret) {
        state.push({
          x: turret.coords.x-50,
          y: turret.coords.y-50,
          rotation: turret.angle,
        });
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
          bullet.hit(enemy);

          if (enemy.hp < 0) {
            this._enemies.get(enemyIndex)?.clearInterval();
            this._players
              .get(bullet.owner)
              ?.addCash(monsters[enemy.monster]?.cash || 0);
            this._enemies.delete(enemyIndex);
          }
        });
      });
      if (
        this._enemies.size < this._enemySpawnAtTheTime &&
        this._enemyTotalNumber > 0
      ) {
        const monster = 0 //spawnRandomEnemy();
        const enemyData: EnemyContructor = {
          coords: enemyRandomSpawnCoords(),
          monster: monster,
          enemyID: this._enemyCounter as number,
          damage: monsters[monster]?.damage as number,
          colision: monsters[monster]?.colision as number,
          hp: monsters[monster]?.hp as number,
          speed: monsters[monster]?.speed as number,
        };
        this._enemies.set(this._enemyCounter, new Enemy(enemyData));
        this._enemyCounter++;
        this._enemyTotalNumber--;
      }
    }
  }, 20);

  get tilesCenters() {
    playgroundTiles;
    return false;
  }
  setTurret(player: string) {
    if (this._players.get(player)?.coords) {
      const coords: Coords = this._players.get(player)?.coords as Coords;
      this._turrets.set(this._turretCounter, new Turret(coords, player));
      this._turretCounter++
    }
  }
}
