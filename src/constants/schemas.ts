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
        name: z.string()
    }),
});

export type Message = z.TypeOf<typeof messageSchema>;
export const messageSubSchema = z.object({
    roomId: z.string().optional()
});

export type ClientMovementType = z.TypeOf<typeof clientMovementSchema>;
export const clientMovementSchema = z.object({
    up: z.boolean(),
    down: z.boolean(),
    left: z.boolean(),
    right: z.boolean(),
    name: z.string().optional()    
});

export type HandleKeyMovementType =
{
    moveState: {
        up: boolean;
        left: boolean;
        down: boolean;
        right: boolean;
    },
    setMoveState: Dispatch<SetStateAction<{
        up: boolean;
        left: boolean;
        down: boolean;
        right: boolean;
    }>>,
    clientMoveDirection:IMoveState,
    setClientMoveDirection:Dispatch<SetStateAction<IMoveState>>

}

export interface IMoveState  {    
        up: boolean,
        left: boolean,
        down: boolean,
        right: boolean,      
}
export const moveStateInitValues:IMoveState = {    
        up: false,
        left: false,
        down: false,
        right: false,
      
}
export interface IRotationData {
    name:string,
    rotation: number
}
