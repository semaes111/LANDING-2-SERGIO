import { authRouter } from "./auth-router";
import { reservationRouter } from "./reservation-router";
import { consultationRouter } from "./consultation-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  reservation: reservationRouter,
  consultation: consultationRouter,
});

export type AppRouter = typeof appRouter;
