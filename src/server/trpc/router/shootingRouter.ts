import type { BulletData } from "../../../constants/schemas";
import type { BulletController } from "../../gameLogic/BulletControllerClass";
import { router,protectedProcedure } from "../trpc";
import { z } from "zod";

export const bulletController = new Map<string, BulletController>();
export const shootingRouter = router({
    clientFire: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      if (ctx.session?.user?.name) {
        const bulletData: BulletData = {
          player: ctx.session?.user?.name,
          gun: input,
        };
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
});
