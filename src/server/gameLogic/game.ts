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
type enemiesState = {
  [k: number]: {
    x: number;
    y: number;
    hp:number;
  };
};

export class Playground {
  private players: Map<string, Player> = new Map<string, Player>();
  private bullets: Map<number, Bullet> = new Map<number, Bullet>();
  private bulletCounter = 0;
  private enemies: Map<number, Enemy> = new Map<number, Enemy>([
    [0, new Enemy({ x: Math.floor(Math.random()*10000), y: Math.floor(Math.random()*10000) })],
    [1, new Enemy({ x: Math.floor(Math.random()*10000), y: Math.floor(Math.random()*10000) })],
    [2, new Enemy({ x: Math.floor(Math.random()*10000), y: Math.floor(Math.random()*10000) })],
    [3, new Enemy({ x: Math.floor(Math.random()*10000), y: Math.floor(Math.random()*10000) })],
    [4, new Enemy({ x: Math.floor(Math.random()*10000), y: Math.floor(Math.random()*10000) })],
    [5, new Enemy({ x: Math.floor(Math.random()*10000), y: Math.floor(Math.random()*10000) })],
    [6, new Enemy({ x: Math.floor(Math.random()*10000), y: Math.floor(Math.random()*10000) })],
    [7, new Enemy({ x: Math.floor(Math.random()*10000), y: Math.floor(Math.random()*10000) })],
    [8, new Enemy({ x: Math.floor(Math.random()*10000), y: Math.floor(Math.random()*10000) })],
    [9, new Enemy({ x: Math.floor(Math.random()*10000), y: Math.floor(Math.random()*10000) })],
    [10, new Enemy({ x: Math.floor(Math.random()*10000), y: Math.floor(Math.random()*10000) })],
    [11, new Enemy({ x: Math.floor(Math.random()*10000), y: Math.floor(Math.random()*10000) })],
    [12, new Enemy({ x: Math.floor(Math.random()*10000), y: Math.floor(Math.random()*10000) })],
    [13, new Enemy({ x: Math.floor(Math.random()*10000), y: Math.floor(Math.random()*10000) })],
    [14, new Enemy({ x: Math.floor(Math.random()*10000), y: Math.floor(Math.random()*10000) })],
    [15, new Enemy({ x: Math.floor(Math.random()*10000), y: Math.floor(Math.random()*10000) })],
    [16, new Enemy({ x: Math.floor(Math.random()*10000), y: Math.floor(Math.random()*10000) })],
    [17, new Enemy({ x: Math.floor(Math.random()*10000), y: Math.floor(Math.random()*10000) })],
    [18, new Enemy({ x: Math.floor(Math.random()*10000), y: Math.floor(Math.random()*10000) })],
    [19, new Enemy({ x: Math.floor(Math.random()*10000), y: Math.floor(Math.random()*10000) })],

  ]);
  public imgSize: Map<string, number> = new Map<string, number>([
    ["player",Player.imgSIze()],
    ["enemy", 100],
    ["bullet",4]]
    );
  
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
      if (x0y0) {
        const x = x0y0.x;
        const y = x0y0.y;
        const angle = bulletData.rotation;
        this.bullets.set(this.bulletCounter, new Bullet({ x, y }, angle));
        this.bulletCounter++;
      }
    }
  }

  getPlayersState(): playersState {
    const state: playersState = {};
    this.players.forEach((player) => {
      if (player && player.input && player.input.name) {
        state[player.input.name] = {
          x: player.coords.x-(this.imgSize.get("player")||0)/2,
          y: player.coords.y-(this.imgSize.get("player")||0)/2,
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

  getEnemiesState(): enemiesState {
    const state: enemiesState = {};
    this.enemies.forEach((enemy, enemyIndex) => {
      if (enemy) {
        state[enemyIndex] = {
          x: enemy.coords.x-(this.imgSize.get("enemy")||0)/2,
          y: enemy.coords.y-(this.imgSize.get("enemy")||0)/2,
          hp: enemy.hp
        };
      }
    });
    return state;
  }

  interval: NodeJS.Timer = setInterval(() => {
    this.players.forEach((player) => {
      player.move(this.size);
    });
    this.bullets.forEach((bullet, bulletIndex) => {
      bullet.move();
      if (bullet.lifeSpan < 0) {
        this.bullets.delete(bulletIndex);
      }
      this.enemies.forEach((enemy, key) => {
        if (bullet.hit(enemy)) {
          this.bullets.delete(bulletIndex);
        }
        if (enemy.hp < 0) {
          this.enemies.delete(key);
        }
      });
    });
  }, 20);
}

class Bullet {
  public coords: { x: number; y: number };
  private angle: number;
  private damage = 1;
  public lifeSpan = 50;
  private speed = 15;
  

  constructor(coords: { x: number; y: number }, angle: number) {
    this.coords = coords;
    this.angle = angle;
    
    
  }
  move() {
    this.coords = {
      x: this.coords.x + this.speed * Math.sin((this.angle * Math.PI) / 180),
      y:
        this.coords.y +
        this.speed * Math.cos((this.angle * Math.PI) / 180) * -1,
    };
    this.lifeSpan--;
  }
  hit(enemy: Enemy): boolean {
    if (Math.abs(this.coords.x - enemy.coords.x) < enemy.colision && Math.abs(this.coords.y - enemy.coords.y) < enemy.colision) {
      enemy.hp -= this.damage;
      return true;
    } else {
      return false;
    }
  }
}

class Enemy {
  colision = 50;
  hp = 10;
  public coords: { x: number; y: number };
  constructor(coords: { x: number; y: number }) {
    this.coords = coords;
  }
}

export class Player {
  _x = 5000;
  _y = 5000;
  private _speed = 4;
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
static imgSIze():number{
  return 50
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
