import type { Dispatch, SetStateAction } from "react";
import z from "zod";

export const sendMessageSchema = z.object({
  roomId: z.string().optional(),
  message: z.string(),
});

const messageSchema = z.object({
  id: z.string(),
  message: z.string(),
  roomId: z.string().optional(),
  sentAt: z.date(),
  sender: z.object({
    name: z.string(),
  }),
});

export type Message = z.TypeOf<typeof messageSchema>;
export const messageSubSchema = z.object({
  roomId: z.string().optional(),
});

export type ClientMovement = z.TypeOf<typeof clientMovementSchema>;
export const clientMovementSchema = z.object({
  up: z.boolean(),
  down: z.boolean(),
  left: z.boolean(),
  right: z.boolean(),
  name: z.string().optional(),
});

export type HandleKeyMovement = {
  moveState: MoveState;
  setMoveState: Dispatch<SetStateAction<MoveState>>;
  clientMoveDirection: MoveState;
  setClientMoveDirection: Dispatch<SetStateAction<MoveState>>;
  pause: () => void;
  restart: () => void;
  gun: number;
  setGun: Dispatch<SetStateAction<number>>; 
  setTurret: () => void;
  unlockGun:(n:number) => void
  availableGuns:boolean[]
};

export type MoveState = {
  up: boolean;
  left: boolean;
  down: boolean;
  right: boolean;
};
export const moveStateInitValues: MoveState = {
  up: false,
  left: false,
  down: false,
  right: false,
};
export type RotationData = {
  name: string;
  rotation: number;
};

export type PlayersState = {
  [k: string]: {
    x: number;
    y: number;
    hp: string;
    cash: number;
  };
};
export type Coords = { x: number; y: number };

export type BulletsState = {
  x: number;
  y: number;
}[];

export type EnemiesState = {
  x: number;
  y: number;
  rotation: number;
  monster: number;
}[];

export type TurretsState = {
  x: number;
  y: number;
  rotation: number;
}[];

export type MoveAllObservable = {
  players: PlayersState | undefined;
  bullets: BulletsState | undefined;
  enemies: EnemiesState | undefined;
  turrets: TurretsState | undefined;
  enemiesToSpawn: string | undefined;
};

export type BulletData = {
  player: string;
  gun?: number;
  turret?: number;
  rotation?: number;
  coords?: Coords;
};

export type BulletContructor = {
  coords: Coords;
  owner: string;
  angle: number;
  damage: number;
  piercing: number;
  bulletSpeed: number;
  range: number;
};

export type EnemyContructor = {
  coords: Coords;
  monster: number;
  enemyID: number;
  damage: number;
  colision: number;
  hp: number;
  speed: number;
  rotationOffset?: number;
};

export type MonsterProperties = {
  type: string;
  monsterIndex: number;
  url: string;
  imgSize: number;
  rotationOffset?: number;
  damage: number;
  colision: number;
  hp: number;
  speed: number;
  cash: number;
};
export type GunProperties = {
  type: string;
  gunIndex: number;
  cashToUnlock:number;
  url: string;
  damage: number;
  auto: boolean;
  cadence?:number
  piercing: number;
  bulletSpeed: number;
  bulletRange: number;
};
export type TurretProperties = {
  type: string;
  turretIndex: 0;
  cashToBuild: number,
  damage: number;
  piercing: number;
  cadence: number;
  bulletSpeed: number;
  bulletRange: number;
  turretRange: number;
};
