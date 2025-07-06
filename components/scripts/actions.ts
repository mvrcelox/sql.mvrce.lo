"use server";

import { revalidatePath } from "next/cache";

function revalidate(originalPath: string) {
   return revalidatePath(originalPath);
}

export { revalidate as default };
