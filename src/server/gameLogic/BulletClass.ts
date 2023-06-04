import { allowedAreaForBullets } from "../../constants/functions";
import type { Coords } from "../../constants/schemas";
import type { Enemy } from "./EnemyClass";


export class Bullet {
    private _coords: Coords;
    private angle: number;
    private damage = 6;
    private _lifeSpan = 50;
    private _speed = 15;
    private _piercing = false;
    private _hitTarget = false;
  
    constructor(coords: Coords, angle: number) {
      this._coords = coords;
      this.angle = angle;
    }
    get coords() {
      return this._coords;
    }
    get lifeSpan(){
      return this._lifeSpan
    }
    move() {
      this._coords = {
        x: this._coords.x + this._speed * Math.sin((this.angle * Math.PI) / 180),
        y:
          this._coords.y +
          this._speed * Math.cos((this.angle * Math.PI) / 180) * -1,
      };
      this._lifeSpan--;
      if(!allowedAreaForBullets(this._coords.x,this._coords.y)){
        this._lifeSpan = -1
      }
    }
    hit(enemy: Enemy) {
      if (
        Math.abs(this._coords.x - enemy.coords.x) < enemy.colision &&
        Math.abs(this._coords.y - enemy.coords.y) < enemy.colision &&
        !this._hitTarget
      ) {
        this._hitTarget = true
        enemy.hp -= this.damage;
        if(!this._piercing){
          this._lifeSpan = -1
        }
        
      } 
    }
  }