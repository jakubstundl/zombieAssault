import { Events } from "../../../constants/events";
import type {
  ClientMovement,
  MoveAllObservable,
  RotationData,
} from "../../../constants/schemas";
import { clientMovementSchema } from "../../../constants/schemas";
import { observable } from "@trpc/server/observable";
import { router, protectedProcedure } from "../trpc";
import { Playground } from "../../gameLogic/PlaygroundClass";

import { BulletController } from "../../gameLogic/BulletControllerClass";
import { z } from "zod";
import { bulletController } from "./shootingRouter";


export const pg: Playground | null = new Playground();


export const gameMovement = router({

  clientMovementData: protectedProcedure
    .input(clientMovementSchema)
    .mutation(async ({ ctx, input }) => {
      const movementData: ClientMovement = {
        ...input,
        name: ctx.session?.user?.name || "none",
      };

      pg?.setInput(movementData);
    }),

  moveAll: protectedProcedure.subscription(({ctx}) => {
    return observable<MoveAllObservable>((emit) => {
      function onMove(data: MoveAllObservable) {
        emit.next(data);
      }
      ctx.ee.on(Events.MOVEMENT_DATA, onMove);

      return () => {
        ctx.ee.on(Events.MOVEMENT_DATA, onMove);
      };
    
       
        
    });
  }),

  rotateAll: protectedProcedure.subscription(({ ctx }) => {
    return observable<RotationData>((emit) => {
      function onClientRotation(data: RotationData) {
        emit.next(data);
      }

      ctx.ee.on(Events.SEND_ROTATION, onClientRotation);

      return () => {
        ctx.ee.on(Events.SEND_ROTATION, onClientRotation);
      };
    });
  }),

  clientRotationData: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      if (ctx.session?.user?.name && input) {
        const rotation: RotationData = {
          name: ctx.session?.user?.name,
          rotation: input,
        };
        if (bulletController.has(ctx.session.user.name)) {
          (
            bulletController.get(ctx.session.user.name) as BulletController
          ).angle = input;
        } else {
          bulletController.set(ctx.session.user.name, new BulletController());
          (
            bulletController.get(ctx.session.user.name) as BulletController
          ).angle = input;
        }
        ctx.ee.emit(Events.SEND_ROTATION, rotation);
      }
    }),



  
});
