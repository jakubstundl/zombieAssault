import type { BulletData } from "../../constants/schemas";
import { pg } from "../trpc/router/gameMovementRouter";
import { guns } from "../../constants/gameConstants";

export class BulletController {
  interval: NodeJS.Timer | undefined;
  private _angle = 0;
  set angle(a: number) {
    this._angle = a;
  }
  get angle() {
    return this._angle + (Math.random() < 0.5 ? 1 : -1) * Math.random() * 5;
  }

  fire(bulletData: BulletData) {
  if(bulletData.gun==undefined) return
    switch (guns[bulletData.gun]?.type) {
      case "Shotgun":
        for (let i = -25; i <= 25; i = i + 5) {
          bulletData.rotation = this.angle + i;
          pg?.fire(bulletData);
        }
        break;

      default:
        bulletData.rotation = this.angle;
        pg?.fire(bulletData);
        break;
    }

  }

  fireOn(bulletData: BulletData) {
    if(bulletData.gun==undefined) return
    this.interval = setInterval(() => {
      bulletData.rotation = this.angle;
      pg?.fire(bulletData);
    }, 1000 / (guns[bulletData.gun]?.cadence || 1));
    
  }
  fireOff() {
    clearInterval(this.interval);
  }

  
}
