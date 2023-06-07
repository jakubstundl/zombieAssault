import type { Coords, MoveState } from "../../constants/schemas";
import { moveStateInitValues } from "../../constants/schemas";
import {
  playerHP,
  playerMovingSpeed,
  playerSpawnPosition,
  playerStatingCash,
  playgroundSize,
  playgroundTiles,
} from "../../constants/gameConstants";
import { allowedAreaForPlayers } from "../../constants/functions";
import {
  availableGunsInit,
  guns,
} from "../../constants/objectProperties/gunProperties";

export class Player {
  private _x = playerSpawnPosition.x;
  private _y = playerSpawnPosition.y;
  private _hp = playerHP;
  private _maxHp = playerHP;
  private _speedInit = playerMovingSpeed;
  private _speed = this._speedInit;
  private _cash = playerStatingCash;
  private _availableGuns = availableGunsInit;
  private _move: MoveState = moveStateInitValues;
  private _ready = false;

  play(input: MoveState) {
    this._move = {
      up: input.up,
      left: input.left,
      right: input.right,
      down: input.down,
    };
  }
  move = this._moving;

  get coords(): Coords {
    return { x: this._x, y: this._y };
  }
  get hp() {
    return this._hp;
  }
  get hpPercentage() {
    return `${Math.round((this._hp / this._maxHp) * 100)}%`;
  }
  get tile(): Coords {
    const tx0 = Math.floor(
      this.coords.x / (playgroundSize.x / playgroundTiles.x)
    );
    const ty0 = Math.floor(
      this.coords.y / (playgroundSize.y / playgroundTiles.y)
    );
    return { x: tx0, y: ty0 };
  }
  get cash() {
    return this._cash;
  }
  addCash(cash: number) {
    this._cash += cash;
  }

  spendCash(cash: number) {
    this._cash -= cash;
  }

  get availableGuns() {
    return this._availableGuns;
  }

  get ready() {
    return this._ready;
  }

  setReady(b: boolean) {
    this._ready = b;
  }

  buyGun(n: number) {
    if ((guns[n]?.cashToUnlock || Infinity) <= this._cash) {
      this._availableGuns[n] = true;
      this._cash -= guns[n]?.cashToUnlock || 0;
    }
  }

  private _moving(size: Coords) {
    const origPosition: Coords = { x: this._x, y: this._y };

    if (
      //up
      this._move.up &&
      !this._move.left &&
      !this._move.right &&
      !this._move.down
    ) {
      this._y = this._y - this._speed;
      if (!allowedAreaForPlayers(this._x, this._y)) {
        this._y = origPosition.y;
      }
    } else {
      if (
        //left
        !this._move.up &&
        this._move.left &&
        !this._move.right &&
        !this._move.down
      ) {
        this._x = this._x - this._speed;
        if (!allowedAreaForPlayers(this._x, this._y)) {
          this._x = origPosition.x;
        }
      } else {
        if (
          //right
          !this._move.up &&
          !this._move.left &&
          this._move.right &&
          !this._move.down
        ) {
          this._x = this._x + this._speed;
          if (!allowedAreaForPlayers(this._x, this._y)) {
            this._x = origPosition.x;
          }
        } else {
          if (
            //down
            !this._move.up &&
            !this._move.left &&
            !this._move.right &&
            this._move.down
          ) {
            this._y = this._y + this._speed;
            if (!allowedAreaForPlayers(this._x, this._y)) {
              this._y = origPosition.y;
            }
          } else {
            if (
              //upleft
              this._move.up &&
              this._move.left &&
              !this._move.right &&
              !this._move.down
            ) {
              this._x = this._x - this._speed / Math.SQRT2;
              if (!allowedAreaForPlayers(this._x, this._y)) {
                this._x = origPosition.x;
              }
              this._y = this._y - this._speed / Math.SQRT2;
              if (!allowedAreaForPlayers(this._x, this._y)) {
                this._y = origPosition.y;
              }
            } else {
              if (
                //upright
                this._move.up &&
                !this._move.left &&
                this._move.right &&
                !this._move.down
              ) {
                this._x = this._x + this._speed / Math.SQRT2;
                if (!allowedAreaForPlayers(this._x, this._y)) {
                  this._x = origPosition.x;
                }
                this._y = this._y - this._speed / Math.SQRT2;
                if (!allowedAreaForPlayers(this._x, this._y)) {
                  this._y = origPosition.y;
                }
              } else {
                if (
                  //leftdown
                  !this._move.up &&
                  this._move.left &&
                  !this._move.right &&
                  this._move.down
                ) {
                  this._x = this._x - this._speed / Math.SQRT2;
                  if (!allowedAreaForPlayers(this._x, this._y)) {
                    this._x = origPosition.x;
                  }
                  this._y = this._y + this._speed / Math.SQRT2;
                  if (!allowedAreaForPlayers(this._x, this._y)) {
                    this._y = origPosition.y;
                  }
                } else {
                  if (
                    //rightdown
                    !this._move.up &&
                    !this._move.left &&
                    this._move.right &&
                    this._move.down
                  ) {
                    this._x = this._x + this._speed / Math.SQRT2;
                    if (!allowedAreaForPlayers(this._x, this._y)) {
                      this._x = origPosition.x;
                    }
                    this._y = this._y + this._speed / Math.SQRT2;
                    if (!allowedAreaForPlayers(this._x, this._y)) {
                      this._y = origPosition.y;
                    }
                  } else {
                  }
                }
              }
            }
          }
        }
      }
    }

    if (this._x < 0) {
      this._x = 0;
    }
    if (this._x > size.x) {
      this._x = size.x;
    }
    if (this._y < 0) {
      this._y = 0;
    }
    if (this._y > size.y) {
      this._y = size.y;
    }
  }

  takeDmg(dmg: number) {
    this._hp -= dmg;
  }
}
