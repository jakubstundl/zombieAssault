import type { Coords, EnemyContructor } from "../../constants/schemas";
import easystarjs from "easystarjs";
import {
  playgroundSize,
  playgroundTiles,
  grid,
  distanceToDoDmg,
  distanceToMove,
  distanceToIgnorePathfinder,
  enemySlowDownDurationAfterHit,
  enemyInterval,
} from "../../constants/gameConstants";
import { pg } from "../trpc/router/gameMovementRouter";
import { coordsDistance } from "../../constants/functions";

export class Enemy {
  private _colision;
  hp;
  private _speed;
  private _dmg;
  private _angle = 0;
  private _distanceFromTheTarget = playgroundSize.x + playgroundSize.y;
  private _tileCounter = 0;
  private _targetForPathFinder: Coords = { x: 0, y: 0 };
  private _targetPoints: Coords[] = [];
  private _enemyID;
  private _monster;
  private _coords: Coords;
  private _slowDown = false;

  constructor(enemyConstructor: EnemyContructor) {
    this._coords = enemyConstructor.coords;
    this._monster = enemyConstructor.monster;
    this._enemyID = enemyConstructor.enemyID;
    this._dmg = enemyConstructor.damage;
    this._colision = enemyConstructor.colision;
    this.hp = enemyConstructor.hp;
    this._speed = enemyConstructor.speed;
  }
  get coords(): Coords {
    return this._coords;
  }
  get rotation(): number {
    return this._angle;
  }
  get colision() {
    return this._colision;
  }

  get tile(): Coords {
    const tx0 = Math.floor(
      this._coords.x / (playgroundSize.x / playgroundTiles.x)
    );
    const ty0 = Math.floor(
      this._coords.y / (playgroundSize.y / playgroundTiles.y)
    );
    return { x: tx0, y: ty0 };
  }
  get id() {
    return this._enemyID;
  }
  get monster() {
    return this._monster;
  }
  

  pathfinder() {
   // console.log("Pathfinder has been called");

    this._targetPoints = [];
    this._tileCounter = 0;
    const easystar = new easystarjs.js();
    easystar.setGrid(grid);
    easystar.setAcceptableTiles([0, 2]);
    const tx0 = Math.max(
      Math.floor(this.coords.x / (playgroundSize.x / playgroundTiles.x)),
      0
    );
    const ty0 = Math.max(
      Math.floor(this.coords.y / (playgroundSize.y / playgroundTiles.y)),
      0
    );
   // console.log("Tiles", tx0, ty0);

    easystar.findPath(
      tx0,
      ty0,
      this._targetForPathFinder.x,
      this._targetForPathFinder.y,
      (path) => {
        if (path === null) {
          console.log("Path was not found.");
          this.pathfinder()
        } else {
          /* console.log(
            "Path was found. The first Point is " +
              path[0]?.x +
              " " +
              path[0]?.y
          ); */

          path.forEach((p) => {
            this._targetPoints.push({
              x:
                p.x * (playgroundSize.x / playgroundTiles.x) +
                playgroundSize.x / playgroundTiles.x / 2,
              y:
                p.y * (playgroundSize.y / playgroundTiles.y) +
                playgroundSize.x / playgroundTiles.x / 2,
            });
          });
        }
      }
    );

    //easystar.enableCornerCutting()
    //easystar.enableDiagonals();
    easystar.setIterationsPerCalculation(200);
    easystar.calculate();
  }

  move() {
    const speed = this._slowDown?this._speed/2:this._speed
    const x0 = this._coords.x;
    const y0 = this._coords.y;
    const x1 = this._targetPoints[this._tileCounter]?.x;
    const y1 = this._targetPoints[this._tileCounter]?.y;
    const xT = Math.floor((x1 || 0) / (playgroundSize.x / playgroundTiles.x));
    const yT = Math.floor((y1 || 0) / (playgroundSize.y / playgroundTiles.y));
    const condition =
      this.tile.x == xT &&
      this.tile.y == yT &&
      this._distanceFromTheTarget > distanceToIgnorePathfinder;

    if (condition) {
      this._tileCounter++;
      if (this._targetPoints[this._tileCounter] == undefined) {
        this._tileCounter = 0;
      }
    } else {
      if (this._distanceFromTheTarget > distanceToMove) {
        const xDiff = (x1 || 0) - x0;
        const yDfiffT = (y1 || 0) - y0;
        const yDfiff = yDfiffT == 0 ? 0.001 : yDfiffT;

        this._angle = 0;
        if (yDfiff < 0) {
          this._angle = Math.atan(xDiff / yDfiff) + Math.PI;
        } else {
          this._angle = Math.atan(xDiff / yDfiff);
        }

        if (this._targetPoints[this._tileCounter]) {
          this._coords.x += Math.sin(this._angle) * speed;
          this._coords.y += Math.cos(this._angle) * speed;
        }
      }
    }
  }

  interval: NodeJS.Timer = setInterval(() => {
   
    
    this._distanceFromTheTarget =
      Math.max(playgroundSize.x, playgroundSize.y) * 2;
    let playerToChase = "";

    pg?.players.forEach((player, name) => {
      const playerDist = coordsDistance(this._coords, player.coords);
      if (this._distanceFromTheTarget > playerDist) {
        this._distanceFromTheTarget = playerDist;
        playerToChase = name;
      }
    });

    if (pg?.players.has(playerToChase)) {
      if (this._distanceFromTheTarget < distanceToIgnorePathfinder) {
        this._tileCounter = 0;
        this._targetPoints = [];
        this._targetPoints[0] = pg?.players.get(playerToChase)
          ?.coords as Coords;
        if (this._distanceFromTheTarget < distanceToDoDmg && !this._slowDown) {
          pg?.players.get(playerToChase)?.takeDmg(this._dmg);
        }
      } else {
        if (
          this._targetForPathFinder.x ==
            pg?.players.get(playerToChase)?.tile.x &&
          this._targetForPathFinder.y == pg?.players.get(playerToChase)?.tile.y
        ) {
        } else {
          this._targetForPathFinder = pg?.players.get(playerToChase)
            ?.tile as Coords;
          this._tileCounter = 0;
          this.pathfinder();
        }
      }
    }
      /* console.log("enemy interval running", this.id);
   console.log("tilecounter:" , this._tileCounter);
    console.log("Player's tile: ", pg.players.get(playerToChase)?.tile);
    console.log("This's tile: ", this.tile);
    console.log("Actual target position: ", this._targetPoints[this._tileCounter]);
    console.log("Angle: ", this.rotation);
 console.log(`Distance: ${this._distanceFromTheTarget}, name: ${playerToChase}`); */
  }, enemyInterval);
  clearInterval() {
    clearInterval(this.interval);
  }

  getHit(){
   this._slowDown = true
    setTimeout(()=>{this._slowDown=false},enemySlowDownDurationAfterHit)
  }
}
