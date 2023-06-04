import { Events } from "../../../constants/events";
import type {
  ClientMovement,
  RotationData,
  MoveAllObservable,
} from "../../../constants/schemas";
import { clientMovementSchema } from "../../../constants/schemas";
import { observable } from "@trpc/server/observable";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { Playground } from "../../gameLogic/PlaygroundClass";
import { z } from "zod";
import { AutoShooting } from "../../gameLogic/AutoShootingClass";



export const pg:Playground|null = new Playground();
const autoShooterControllers = new Map<string, AutoShooting>()

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

      moveAll: protectedProcedure.subscription(({ ctx, input }) => {
    return observable<MoveAllObservable>((emit) => {
      setInterval(() => {
        emit.next({
          players: pg?.getPlayersState(),
          bullets: pg?.getBulletsState(),
          enemies: pg?.getEnemiesState(),
          pause: pg.isPaused,
          enemiesToKill: pg.enemiesToKill
        });
        console.log(pg.isPaused);
        
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
        if( autoShooterControllers.has(ctx.session.user.name) ){
          (autoShooterControllers.get(ctx.session.user.name) as AutoShooting).angle = input
        }else{
          autoShooterControllers.set(ctx.session.user.name, new AutoShooting());
          (autoShooterControllers.get(ctx.session.user.name) as AutoShooting).angle = input
        }
        ctx.ee.emit(Events.SEND_ROTATION, rotation);
      }
    }),

  clientFire: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      if (ctx.session?.user?.name && input) {
        const rotation: RotationData = {
          name: ctx.session?.user?.name,
          rotation: input,
        };
        pg?.fire(rotation);
      }
    }),
    autoFireToggle: protectedProcedure
    .input(z.boolean())
    .mutation(async ({ ctx, input }) => {
      input?console.log("q pressed"):console.log("q unpressed");
      
      if(ctx.session?.user?.name){
        input?autoShooterControllers.get(ctx.session?.user?.name)?.fireOn(ctx.session?.user?.name):autoShooterControllers.get(ctx.session?.user?.name)?.fireOff()

      }
      
    }),

    pauseTheGame: protectedProcedure
    .mutation(async () => {
      pg?.pause();
    }),
    restartTheGame: protectedProcedure
    .mutation(async () => {
     // pg= null;
     // pg = new Playground();
    }),
    holyHailGrenade: protectedProcedure
    .mutation(async ({ ctx }) => {
      if(ctx.session?.user?.name){
        autoShooterControllers.get(ctx.session?.user?.name)?.holyHailGrenade(ctx.session?.user?.name)

      }
    }),
});
