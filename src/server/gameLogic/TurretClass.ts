import { coordsDistance } from "../../constants/functions";
import { playgroundSize} from "../../constants/gameConstants";
import { turrets } from "../../constants/objectProperties/turretProperties";
import type { BulletData, Coords } from "../../constants/schemas";
import { pg } from "../trpc/router/gameMovementRouter";

export class Turret {
  private _coords;
  private _distanceFromTheTarget = 0;
  private _owner;
  private _angle = 0;
  private _turretType = 0

  constructor(coords: Coords, owner: string) {
    this._coords = coords;
    this._owner = owner;
  }

  get coords(){
    return this._coords
  }
  get angle(){
    return this._angle
  }

  interval: NodeJS.Timer = setInterval(() => {
    this._distanceFromTheTarget =
      Math.max(playgroundSize.x, playgroundSize.y) * 2;
    let closestEnemyCoords: Coords | undefined;

    pg?.enemies.forEach((enemy) => {
      const enemyDist = coordsDistance(this._coords, enemy.coords);
      if (this._distanceFromTheTarget > enemyDist) {
        this._distanceFromTheTarget = enemyDist;
        closestEnemyCoords = enemy.coords;
      }
    });

    if (closestEnemyCoords) {
      if (this._distanceFromTheTarget < (turrets[this._turretType]?.turretRange||0)) {
        const x0 = this._coords.x;
        const y0 = this._coords.y;
        const x1 = closestEnemyCoords.x;
        const y1 = closestEnemyCoords.y;
        const xDiff = (x1 || 0) - x0;
        const yDfiffT = (y1 || 0) - y0;
        const yDfiff = yDfiffT == 0 ? 0.001 : yDfiffT;

        this._angle = 0;
        if (yDfiff < 0) {
          this._angle = Math.atan(xDiff / yDfiff) + Math.PI;
        } else {
          this._angle = Math.atan(xDiff / yDfiff);
        }

        const bulletData: BulletData = {
          player: this._owner,
          turret: this._turretType,
          rotation: this._angle * (180 / Math.PI) * -1 + 180,
          coords: this._coords
        };
        
        
        pg?.fire(bulletData);
      }
    }
  }, 1000/(turrets[this._turretType]?.cadence||1));
  clearInterval() {
    clearInterval(this.interval);
  }
}
