import { allowedAreaForBullets } from "../../constants/functions";
import type { Coords } from "../../constants/schemas";
import type { Enemy } from "./EnemyClass";
import type { BulletContructor } from "../../constants/schemas";

export class Bullet {
  private _coords: Coords;
  private angle: number;
  private _damage;
  private _lifeSpan;
  private _speed;
  private _targetsHit = 0;
  private _targetsMax
  private _targetsHitID: number[] = [];
  private _owner;

  constructor(bulletContructor: BulletContructor) {
    this._coords = bulletContructor.coords;
    this.angle = bulletContructor.angle;
    this._damage = bulletContructor.damage;
    this._targetsMax = bulletContructor.piercing;
    this._lifeSpan = bulletContructor.range
    this._speed = bulletContructor.bulletSpeed
    this._owner = bulletContructor.owner
       
  }
  get coords() {
    return this._coords;
  }
  get lifeSpan() {
    return this._lifeSpan;
  }
  get owner() {
    return this._owner;
  }
  move() {
    this._coords = {
      x: this._coords.x + this._speed * Math.sin((this.angle * Math.PI) / 180),
      y:
        this._coords.y +
        this._speed * Math.cos((this.angle * Math.PI) / 180) * -1,
    };
    this._lifeSpan--;
    if (!allowedAreaForBullets(this._coords.x, this._coords.y)) {
      this._lifeSpan = -1;
    }
  }
  hit(enemy: Enemy) {
    if (
      Math.abs(this._coords.x - enemy.coords.x) < enemy.colision &&
      Math.abs(this._coords.y - enemy.coords.y) < enemy.colision &&
      this._targetsHit < this._targetsMax &&
      !this._targetsHitID.includes(enemy.id)
    ) {
      this._targetsHit++;
      enemy.hp -= this._damage;
      this._targetsHitID.push(enemy.id);
      enemy.getHit()
      if (this._targetsHit >= this._targetsMax) {
        this._lifeSpan = -1;
      }
    }
  }
}
