import { observable } from "@trpc/server/observable";
import { turrets } from "../../../constants/objectProperties/turretProperties";
import { router,protectedProcedure } from "../trpc";
import { pg } from "./gameMovementRouter";
import { z } from "zod";
import { Events } from "../../../constants/events";
import { bulletController } from "./shootingRouter";


export const gameManagement = router({
  getPlaygroundData: protectedProcedure.query(() => {
    return { imgSize: pg?.imgSize, mapSize: pg?.size };
  }),

  getAvailableGuns: protectedProcedure.mutation(({ctx}) => {
    if(ctx.session.user.name && pg){
       
      return pg.players.get(ctx.session.user.name)?.availableGuns;
       }
  }),
  buyGun: protectedProcedure.input(z.number()).mutation(({ctx, input}) => {
    if(ctx.session.user.name && pg &&input){
      pg.players.get(ctx.session.user.name)?.buyGun(input);
      return pg.players.get(ctx.session.user.name)?.availableGuns;
       }
  }),

  pauseTheGame: protectedProcedure.mutation(async ({ctx}) => {
    if(pg?.isPaused && ctx.session.user.name){
      pg?.unPause(ctx.session.user.name);
    }else{
    pg?.pause();   
    bulletController.forEach((player)=>{
      player.fireOff()
    }) 
    }
   
  }),
  restartTheGame: protectedProcedure.mutation(async () => {
    // pg= null;
    // pg = new Playground();
  }),
   setTurret: protectedProcedure.mutation(async ({ ctx }) => {
    const player = ctx.session?.user?.name
    if (player && pg) {
      if( (pg.players.get(player)?.cash||0) >= (turrets[0]?.cashToBuild||Infinity)){
        pg.players.get(player)?.spendCash((turrets[0]?.cashToBuild||0))
        pg.setTurret(player)
      }
      
    }
  }),

  addPlayer: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.session?.user?.name && pg) {
      pg.setNewPlayer(ctx.session?.user?.name)      
    }
  }),  

  centerPanel: protectedProcedure.subscription(({ctx}) => {
    return observable<string>((emit) => {
      function setCenterPanel(data: string) {
       emit.next(data);}
       ctx.ee.on(Events.SET_CENTER_PANEL, setCenterPanel);
      return () => {
        ctx.ee.on(Events.SET_CENTER_PANEL, setCenterPanel);
      };
    });
  }),
  
});
