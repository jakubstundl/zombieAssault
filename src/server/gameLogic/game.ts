import type { ClientMovementType } from "../../constants/schemas";

type state = {
  [k: string]: {
    x: number;
    y: number;
  };
};

export class Playground {
  private players: Map<string, Player> = new Map<string, Player>();
  size = { x: 10000, y: 10000 };

  setInput(input: ClientMovementType) {
    if (input.name) {
        if(!this.players.has(input.name)){
            this.players.set(input.name, new Player())
        }
      const player = this.players.get(input.name);
      if (player) {
        player.input = input
        player.play(input.up, input.left, input.right, input.down);
              
      }
    }
  }

  getState(): state {
    const state: state = {};
    this.players.forEach((player) => {
      if (player && player.input && player.input.name) {
        state[player.input.name] = {
          x: player.coords.x,
          y: player.coords.y,
        };
      }
    });
    return state;
  }

  interval: NodeJS.Timer = setInterval(() => {
    this.players.forEach((value) => {
      value.move(this.size);
       });
    
  }, 25);
}

export class Player {
  _x = 0;
  _y = 0;
  private _speed = 5;
  input: ClientMovementType | undefined;
  private _move: { up: boolean; left: boolean; right: boolean; down: boolean } =
    { up: false, left: false, right: false, down: false };

  play(up: boolean, left: boolean, right: boolean, down: boolean) {
    this._move = { up: up, left: left, right: right, down: down };
  }
  move = this._moving;

  get coords() {
    return { x: this._x, y: this._y };
  }

  private _moving(size: { x: number; y: number }) {
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
