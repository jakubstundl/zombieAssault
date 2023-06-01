import type { RotationData } from "../../constants/schemas";
import { pg } from "../trpc/router/gameMovementRouter";

export class AutoShooting {
  interval: NodeJS.Timer | undefined;
  private _angle = 0;
  set angle(a: number) {
    this._angle = a;
  }

  fireOn(name: string) {
    this.interval = setInterval(() => {
      const rotationData: RotationData = { name, rotation: this._angle };
      pg.fire(rotationData);
    }, 100);
  }
  fireOff() {
    clearInterval(this.interval);
  }
}
