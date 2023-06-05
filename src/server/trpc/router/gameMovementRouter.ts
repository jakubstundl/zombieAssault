import { Events } from "../../../constants/events";
import type {
  ClientMovement,
  MoveAllObservable,
  BulletData,
  RotationData,
} from "../../../constants/schemas";
import { clientMovementSchema } from "../../../constants/schemas";
import { observable } from "@trpc/server/observable";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { Playground } from "../../gameLogic/PlaygroundClass";
import { z } from "zod";
import { BulletController } from "../../gameLogic/BulletControllerClass";

export const pg: Playground | null = new Playground();
const bulletController = new Map<string, BulletController>();

export const gameMovement = router({
  getPlaygroundData: protectedProcedure.query(() => {
    return { imgSize: pg?.imgSize, mapSize: pg?.size };
  }),

  clientMovementData: protectedProcedure
    .input(clientMovementSchema)
    .mutation(async ({ ctx, input }) => {
      const movementData: ClientMovement = {
        ...input,
        name: ctx.session?.user?.name || "none",
      };

      pg?.setInput(movementData);
    }),

  moveAll: protectedProcedure.subscription(() => {
    return observable<MoveAllObservable>((emit) => {
      setInterval(() => {
        emit.next({
          players: pg?.getPlayersState(),
          bullets: pg?.getBulletsState(),
          enemies: pg?.getEnemiesState(),
          turrets: pg?.getTurretsState(),
          pause: pg.isPaused,
          enemiesToKill: pg.enemiesToKill,
        });
      
      }, 20);
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

  clientFire: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      if (ctx.session?.user?.name) {
        const bulletData: BulletData = {
          player: ctx.session?.user?.name,
          gun: input,
        };
        console.log(input);
        
        bulletController.get(bulletData.player)?.fire(bulletData);
      }
    }),

  autoFireToggle: protectedProcedure
    .input(z.object({ autoShooting: z.boolean(), gun: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session?.user?.name) {
        const bulletData: BulletData = {
          player: ctx.session?.user?.name,
          gun: input.gun,
        };
        if (input.autoShooting) {
          bulletController.get(bulletData.player)?.fireOn(bulletData);
        } else {
          bulletController.get(bulletData.player)?.fireOff();
        }
      }
    }),

  pauseTheGame: protectedProcedure.mutation(async () => {
    pg?.pause();
  }),
  restartTheGame: protectedProcedure.mutation(async () => {
    // pg= null;
    // pg = new Playground();
  }),
   setTurret: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.session?.user?.name) {
      pg.setTurret(ctx.session?.user?.name)
      
    }
  }),
});
