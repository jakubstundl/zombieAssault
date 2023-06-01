import type { Coords, MoveState} from "../../constants/schemas";
import { moveStateInitValues } from "../../constants/schemas";
import { playerSpawnPosition, playgroundSize, playgroundTiles } from "../../constants/gameConstants";

export class Player {
    private _x = playerSpawnPosition.x;
    private _y = playerSpawnPosition.y;
  
    private _speed = 10;
    
    private _move: MoveState = moveStateInitValues;
  
    play(input: MoveState) {
      this._move = {
        up: input.up,
        left: input.left,
        right: input.right,
        down: input.down,
      };
    }
    move = this._moving;
  
    get coords():Coords {
      return { x: this._x, y: this._y };
    }
    get tile():Coords{
    const tx0 = Math.floor(this.coords.x/(playgroundSize.x/playgroundTiles.x))
    const ty0 = Math.floor(this.coords.y/(playgroundSize.y/playgroundTiles.y))
    return {x:tx0, y:ty0}
    }
    static imgSIze(): number {
      return 100;
    }

    private _moving(size: Coords) {
      if (
        //up
        this._move.up &&
        !this._move.left &&
        !this._move.right &&
        !this._move.down
      ) {
        this._y = this._y - this._speed;
      } else {
        if (
          //left
          !this._move.up &&
          this._move.left &&
          !this._move.right &&
          !this._move.down
        ) {
          this._x = this._x - this._speed;
        } else {
          if (
            //right
            !this._move.up &&
            !this._move.left &&
            this._move.right &&
            !this._move.down
          ) {
            this._x = this._x + this._speed;
          } else {
            if (
              !this._move.up &&
              !this._move.left &&
              !this._move.right &&
              this._move.down
            ) {
              this._y = this._y + this._speed;
            } else {
              if (
                this._move.up &&
                this._move.left &&
                !this._move.right &&
                !this._move.down
              ) {
                this._y = this._y - this._speed / Math.sqrt(2);
                this._x = this._x - this._speed / Math.sqrt(2);
              } else {
                if (
                  this._move.up &&
                  !this._move.left &&
                  this._move.right &&
                  !this._move.down
                ) {
                  this._y = this._y - this._speed / Math.sqrt(2);
                  this._x = this._x + this._speed / Math.sqrt(2);
                } else {
                  if (
                    !this._move.up &&
                    this._move.left &&
                    !this._move.right &&
                    this._move.down
                  ) {
                    this._y = this._y + this._speed / Math.sqrt(2);
                    this._x = this._x - this._speed / Math.sqrt(2);
                  } else {
                    if (
                      !this._move.up &&
                      !this._move.left &&
                      this._move.right &&
                      this._move.down
                    ) {
                      this._y = this._y + this._speed / Math.sqrt(2);
                      this._x = this._x + this._speed / Math.sqrt(2);
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
    
  }