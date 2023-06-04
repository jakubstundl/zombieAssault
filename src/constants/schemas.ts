import { Dispatch, SetStateAction } from "react";
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
  setMoveState: Dispatch<
    SetStateAction<MoveState>>;
  clientMoveDirection: MoveState;
  setClientMoveDirection: Dispatch<SetStateAction<MoveState>>;
  setAutoShootingEnabled: Dispatch<SetStateAction<boolean>>;
  autoShootingEnabled:boolean
  pause:()=>void
  restart:()=>void
  holyHail:()=>void
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
    hp:number
  };
};
export type Coords = { x: number; y: number };

export type BulletsState = {
  x: number;
  y: number;
}[];

export type EnemiesState = {
  [k: number]: {
    x: number;
    y: number;
    hp: number;
    rotation:number;
  };
};

export type MoveAllObservable = {
  players:PlayersState|undefined;
  bullets:BulletsState|undefined;
  enemies:EnemiesState|undefined;
  pause:boolean|undefined;
  enemiesToKill:string|undefined;
};

