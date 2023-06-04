import { allowedArea, allowedAreaForBullets } from "../../constants/gameConstants";
import type { Coords } from "../../constants/schemas";
import type { Enemy } from "./EnemyClass";


export class Bullet {
    private _coords: Coords;
    private angle: number;
    private damage = 6;
    public lifeSpan = 50;
    private speed = 15;
  
    constructor(coords: Coords, angle: number) {
      this._coords = coords;
      this.angle = angle;
    }
    get coords() {
      return this._coords;
    }
    move() {
      this._coords = {
        x: this._coords.x + this.speed * Math.sin((this.angle * Math.PI) / 180),
        y:
          this._coords.y +
          this.speed * Math.cos((this.angle * Math.PI) / 180) * -1,
      };
      this.lifeSpan--;
      if(!allowedAreaForBullets(this._coords.x,this._coords.y)){
        this.lifeSpan = -1
      }
    }
    hit(enemy: Enemy): boolean {
      if (
        Math.abs(this._coords.x - enemy.coords.x) < enemy.colision &&
        Math.abs(this._coords.y - enemy.coords.y) < enemy.colision
      ) {
        enemy.hp -= this.damage;
        return true;
      } else {
        return false;
      }
    }
  }