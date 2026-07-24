import { z } from "zod";

export const Sources = z.array(
    z.object({ source: z.string(), url: z.url(), note: z.string().optional() }),
);
