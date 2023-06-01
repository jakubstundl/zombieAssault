import type { Coords } from "../../constants/schemas";
import easystarjs from "easystarjs";
import {
  playgroundSize,
  playgroundTiles,
  grid,
  coordsDistance,
} from "../../constants/gameConstants";
import { pg } from "../trpc/router/gameMovementRouter";
import { Player } from "./PlayerClass";

export class Enemy {
  colision = 50;
  hp = 10;
  speed = 10;
  private tileCounter = 0;
  private _targetToKill: Coords = { x: 0, y: 0 };
  targetPoints: Coords[] = [];
  private _coords: Coords;
  constructor(coords: Coords) {
    this._coords = coords;
    //this.move();
    this.pathfinder();
  }
  get coords(): Coords {
    return this._coords;
  }

  pathfinder() {
    this.targetPoints = [];
    this.tileCounter = 0;
    const easystar = new easystarjs.js();
    easystar.setGrid(grid);
    easystar.setAcceptableTiles([0]);
    const tx0 = Math.floor(
      this.coords.x / (playgroundSize.x / playgroundTiles.x)
    );
    const ty0 = Math.floor(
      this.coords.y / (playgroundSize.y / playgroundTiles.y)
    );
    console.log(this.coords);
    console.log(tx0, ty0);

    easystar.findPath(
      tx0,
      ty0,
      this._targetToKill.x,
      this._targetToKill.y,
      (path) => {
        if (path === null) {
          console.log("Path was not found.");
        } else {
          console.log(
            "Path was found. The first Point is " +
              path[0]?.x +
              " " +
              path[0]?.y
          );

          path.forEach((p) =>
            this.targetPoints.push({
              x:
                p.x * (playgroundSize.x / playgroundTiles.x) +
                playgroundSize.x / playgroundTiles.x / 2,
              y:
                p.y * (playgroundSize.y / playgroundTiles.y) +
                playgroundSize.x / playgroundTiles.x / 2,
            })
          );
        }
      }
    );
    // easystar.setIterationsPerCalculation(1000);
    easystar.calculate();
  }

  move() {
    const x0 = this._coords.x;
    const y0 = this._coords.y;
    const x1 = this.targetPoints[this.tileCounter]?.x;
    const y1 = this.targetPoints[this.tileCounter]?.y;
    if (
      !(
        Math.abs(x0 - (x1 || 0)) < this.speed &&
        Math.abs(y0 - (y1 || 0)) < this.speed &&
        this.targetPoints.length > 0
      )
    ) {
      const xDiff = (x1 || 0) - x0;
      const yDfiff = (y1 || 0) - y0;

      let angle = 0;
      if (yDfiff < 0) {
        angle = Math.atan(xDiff / yDfiff) + Math.PI;
      } else {
        angle = Math.atan(xDiff / yDfiff);
      }

      console.log("Angle: ", angle, "xDiff: ", xDiff, "yDIff: ", yDfiff);
      if (this.targetPoints[this.tileCounter]) {
        this._coords.x += Math.round(Math.sin(angle) * this.speed);
        this._coords.y += Math.round(Math.cos(angle) * this.speed);
      }
    } else {
      this.tileCounter++;
    }
    console.log(this.coords);
  }

  interval: NodeJS.Timer = setInterval(() => {
    let distance = playgroundSize.x + playgroundSize.y;
    let playerToChase = "";
    pg.players.forEach((player, name) => {
      const playerDist = coordsDistance(this._coords, player.coords);
      if (distance > playerDist) {
        distance = playerDist;
        playerToChase = name;
      }
    });
    if (pg.players.has(playerToChase)) {
      if (
        coordsDistance(this._coords, pg.players.get(playerToChase)!.coords) <
        500
      ) {
        this.tileCounter = 0;
        this.targetPoints[0] = pg.players.get(playerToChase)?.coords || {
          x: 0,
          y: 0,
        };
      } else {
        this._targetToKill = pg.players.get(playerToChase)?.tile || {
          x: 0,
          y: 0,
        };
        this.pathfinder();
      }
    }
  }, 500);
}
