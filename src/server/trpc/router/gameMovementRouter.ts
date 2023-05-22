import { randomUUID } from "crypto";
import { Events } from "../../../constants/events";
import type { ClientMovementType } from "../../../constants/schemas";
import { clientMovementSchema } from "../../../constants/schemas";
import { observable } from "@trpc/server/observable";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { Playground } from "../../gameLogic/game";

const pg = new Playground();

export const gameMovement = router({
  clientMovementData: publicProcedure
    .input(clientMovementSchema)
    .mutation(async ({ ctx, input }) => {
      const movementData: ClientMovementType = {
        ...input,
        name: ctx.session?.user?.name || "Jakub",
      };
      pg.setInput(movementData);
     console.log("----",pg.getState());
     
    }),

  onMovement: protectedProcedure.subscription(({ ctx, input }) => {  
    

    return observable<any>((emit) => {
        setInterval(() => {
            console.log(pg.getState());
            
          emit.next(pg.getState());
        }, 25);
      });
    }),
});
