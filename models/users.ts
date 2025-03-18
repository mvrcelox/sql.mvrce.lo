"use server";

import { authedProcedure } from "./auth";

export const getCurrentUser = authedProcedure.handler(async ({ ctx }) => ctx.user);
