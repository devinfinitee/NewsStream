import { z } from "zod";

export const categorySchema = z.enum(["Politics", "Sports", "Tech", "Entertainment"]);

export type Category = z.infer<typeof categorySchema>;