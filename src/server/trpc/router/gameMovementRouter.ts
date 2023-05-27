import { randomUUID } from "crypto";
import { Events } from "../../../constants/events";
import type {
  ClientMovementType,
  IRotationData,
} from "../../../constants/schemas";
import { clientMovementSchema } from "../../../constants/schemas";
import { observable } from "@trpc/server/observable";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { Playground } from "../../gameLogic/game";
import { number, z } from "zod";

const pg = new Playground();

export const gameMovement = router({
  clientMovementData: protectedProcedure
    .input(clientMovementSchema)
    .mutation(async ({ ctx, input }) => {
      const movementData: ClientMovementType = {
        ...input,
        name: ctx.session?.user?.name || "none",
      };
      pg.setInput(movementData);
    }),

  moveAll: protectedProcedure.subscription(({ ctx, input }) => {
    return observable<{
      players: { [k: string]: { x: number; y: number } };
      bullets: { [k: number]: { x: number; y: number } };
    }>((emit) => {
      setInterval(() => {
        //console.log(pg.getState());
        emit.next({
          players: pg.getPlayersState(),
          bullets: pg.getBulletsState(),
        });
      }, 20);
    });
  }),

  rotateAll: protectedProcedure.subscription(({ ctx }) => {
    return observable<IRotationData>((emit) => {
      function onClientRotation(data: IRotationData) {
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
        const rotation: IRotationData = {
          name: ctx.session?.user?.name,
          rotation: input,
        };
        ctx.ee.emit(Events.SEND_ROTATION, rotation);
      }
    }),

  clientFire: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      if (ctx.session?.user?.name && input) {
        const rotation: IRotationData = {
          name: ctx.session?.user?.name,
          rotation: input,
        };
        pg.fire(rotation);
      }
    }),
});
