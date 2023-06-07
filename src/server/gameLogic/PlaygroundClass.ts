import {
  imgSize,
  playgroundSize,
  playgroundTiles,
  numberOfEnemiesAtTheTime,
  numberOfTotal,
  startingLevel,
  sharedEarnings,
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

import { Turret } from "./TurretClass";
import { guns } from "../../constants/objectProperties/gunProperties";
import { turrets } from "../../constants/objectProperties/turretProperties";
import { monsters } from "../../constants/objectProperties/monsterProperties";
import { level } from "../../constants/levels/levels";
import { Events } from "../../constants/events";
import { ee } from "../trpc/context";

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
  private _level = startingLevel;
  private _centerPanelMessage = "";
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
    this._pause = true;
    this.setAllPlayersUnready();
    this._centerPanelMessage = `Paused
    Level ${this._level}`;
    ee.emit(Events.SET_CENTER_PANEL, this._centerPanelMessage);
  }

  get isPaused() {
    return this._pause;
  }

  get size() {
    return this._size;
  }
  get enemiesToKill() {
    return `${this._enemyTotalNumber - this._enemyCounter}`;
  }

  setNewPlayer(name: string) {
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
      if (bulletData.gun != undefined) {
        weapon = guns[bulletData.gun];
      } else {
        if (bulletData.turret != undefined) {
          weapon = turrets[bulletData.turret];
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
          hp: player.hpPercentage,
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
          x: turret.coords.x - (imgSize.get("turret") || 0) / 2,
          y: turret.coords.y - (imgSize.get("turret") || 0) / 2,
          rotation: turret.angle,
        });
      }
    });
    return state;
  }

  stateInterval: NodeJS.Timer = setInterval(() => {
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
            if (sharedEarnings) {
              this._players.forEach((player) => {
                player.addCash(monsters[enemy.monster]?.cash || 0);
              });
            } else {
              this._players
                .get(bullet.owner)
                ?.addCash(monsters[enemy.monster]?.cash || 0);
            }
            this._enemies.delete(enemyIndex);
          }
        });
      });
      this.play(level[this._level]);
      ee.emit(Events.MOVEMENT_DATA, {
        players: this.getPlayersState(),
        bullets: this.getBulletsState(),
        enemies: this.getEnemiesState(),
        turrets: this.getTurretsState(),
        enemiesToSpawn: this.enemiesToKill,
      });
    }
  }, 20);

  get tilesCenters() {
    playgroundTiles;
    return false;
  }
  spawnEnemy(type: number, coords: Coords) {
    const monster = type; //spawnRandomEnemy();
    const enemyData: EnemyContructor = {
      coords: coords,
      monster: monster,
      enemyID: this._enemyCounter as number,
      damage: monsters[monster]?.damage as number,
      colision: monsters[monster]?.colision as number,
      hp: monsters[monster]?.hp as number,
      speed: monsters[monster]?.speed as number,
    };
    this._enemies.set(this._enemyCounter, new Enemy(enemyData));
    this._enemyCounter++;
  }

  setTurret(player: string) {
    if (this._players.get(player)?.coords) {
      const coords: Coords = this._players.get(player)?.coords as Coords;
      this._turrets.set(this._turretCounter, new Turret(coords, player));
      this._turretCounter++;
    }
  }
  play(
    levelData:
      | Map<string, string | number | [number, Coords][]>
      | null
      | undefined
  ) {
    if (!levelData) return;
    if (
      this._enemies.size <= this._enemySpawnAtTheTime &&
      this._enemyCounter < this._enemyTotalNumber
    ) {
      this._enemySpawnAtTheTime =
        (levelData.get("spawnAtTheTimeEnemies") as number) || 0;
      this._enemyTotalNumber = (levelData.get("totalEnemies") as number) || 0;
      const enemy = (levelData.get("enemies") as [number, Coords][])[
        this._enemyCounter
      ]?.[0] as number;
      const coords = (levelData.get("enemies") as [number, Coords][])[
        this._enemyCounter
      ]?.[1] as Coords;
      this.spawnEnemy(enemy, coords);
    } else {
      if (
        this._enemyCounter == this._enemyTotalNumber &&
        this._enemies.size == 0
      ) {
        this._level++;
        ee.emit(Events.SET_CENTER_PANEL, `Level ${this._level}`);
        this._enemyCounter = 0;
        this.pause();
      }
    }
  }

  setAllPlayersUnready() {
    this._players.forEach((player) => {
      player.setReady(false);
      console.log(player.ready);
    });
  }

  unPause(name: string) {
    this._centerPanelMessage += `
    ${name} is ready`;
    this._players.get(name)?.setReady(true);
    let ready = true;
    this._players.forEach((player) => {
      if (!player.ready) {
        ready = false;
      }
    });
    ee.emit(Events.SET_CENTER_PANEL, this._centerPanelMessage);
    if (ready) {
      this._pause = false;
      ee.emit(Events.SET_CENTER_PANEL, undefined);
    }
  }
}
