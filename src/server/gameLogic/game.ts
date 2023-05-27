import type {
  ClientMovementType,
  IRotationData,
} from "../../constants/schemas";

type playersState = {
  [k: string]: {
    x: number;
    y: number;
  };
};
type bulletsState = {
  [k: number]: {
    x: number;
    y: number;
  };
};

export class Playground {
  private players: Map<string, Player> = new Map<string, Player>();
  private bullets: Map<number, Bullet> = new Map<number, Bullet>();
  private bulletCounter = 0;
  size = { x: 10000, y: 10000 };

  setInput(input: ClientMovementType) {
    if (input.name) {
      if (!this.players.has(input.name)) {
        this.players.set(input.name, new Player());
      }
      const player = this.players.get(input.name);
      if (player) {
        player.input = input;
        player.play(input.up, input.left, input.right, input.down);
      }
    }
  }

  fire(bulletData: IRotationData) {
    if (this.players.has(bulletData.name)) {
      const x0y0 = this.players.get(bulletData.name)?.coords;
      if(x0y0){
      const x = x0y0.x +50
      const y = x0y0.y +50
      const angle = bulletData.rotation;
      this.bullets.set(this.bulletCounter, new Bullet({x,y}, angle));
      this.bulletCounter++;
      }
      
    }
  }

  getPlayersState(): playersState {
    const state: playersState = {};
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
  getBulletsState(): bulletsState {
    const state: bulletsState = {};
    this.bullets.forEach((bullet, bulletCounter) => {
      if (bullet) {
        state[bulletCounter] = {
          x: bullet.coords.x,
          y: bullet.coords.y,
        };
      }
    });
    return state;
  }

  interval: NodeJS.Timer = setInterval(() => {
    this.players.forEach((value) => {
      value.move(this.size);
    });
    this.bullets.forEach((value, key) => {
      value.move();
      if (value.lifeSpan < 0) {
        this.bullets.delete(key);
      }
    });
  }, 20);
}

class Bullet {
  public coords: { x: number; y: number };
  private angle: number;
  public lifeSpan = 50;
  private speed = 10;
  constructor(coords: { x: number; y: number }, angle: number) {
    this.coords = coords;
    this.angle = angle;
  }
  move() {
    this.coords = {
      x: this.coords.x + this.speed * Math.sin((this.angle * Math.PI) / 180),
      y: this.coords.y + this.speed * Math.cos((this.angle * Math.PI) / 180)*-1,
    };
    this.lifeSpan--;
  }
}

export class Player {
  _x = 0;
  _y = 0;
  private _speed = 3;
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
