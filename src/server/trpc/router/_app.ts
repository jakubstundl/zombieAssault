import { router } from "../trpc";
import { authRouter } from "./auth";
import { roomRouter } from "./room";
import { gameMovement } from "./gameMovementRouter";
import fetch from "node-fetch";
import { gameManagement } from "./gameManagementRouter";
import { shootingRouter } from "./shootingRouter";

if(!global.fetch){
  (global.fetch as unknown) = fetch;
}

export const appRouter = router({
  room: roomRouter,
  auth: authRouter,
  gameMovement: gameMovement,
  gameManagement: gameManagement,
  shootingRouter:shootingRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
