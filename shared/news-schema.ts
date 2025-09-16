import { z } from "zod";

export const categorySchema = z.enum(["Politics", "Sports", "Tech", "Entertainment"]);

export const articleSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  excerpt: z.string(),
  category: categorySchema,
  author: z.string(),
  publishedAt: z.string(),
  imageUrl: z.string(),
  slug: z.string(),
});

export type Category = z.infer<typeof categorySchema>;
export type Article = z.infer<typeof articleSchema>;

// Mock data for development
export const mockArticles: Article[] = [
  {
    id: "1",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing",
    category: "Politics",
    author: "John Smith",
    publishedAt: "2024-01-15",
    imageUrl: "/api/placeholder/400/225",
    slug: "lorem-ipsum-dolor-sit-amet"
  },
  {
    id: "2", 
    title: "Reegelteemi irimtio siretien genies",
    content: "Reegelteemi irimtio siretien genies consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    excerpt: "Reegelteemi irimtio siretien genies",
    category: "Tech",
    author: "Sarah Johnson",
    publishedAt: "2024-01-14",
    imageUrl: "/api/placeholder/400/225",
    slug: "reegelteemi-irimtio-siretien-genies"
  },
  {
    id: "3",
    title: "Technology advances reshape modern workplace dynamics",
    content: "The rapid evolution of technology continues to transform how we work, communicate, and collaborate in professional environments across various industries.",
    excerpt: "Technology advances reshape modern workplace dynamics",
    category: "Tech",
    author: "Mike Chen",
    publishedAt: "2024-01-13",
    imageUrl: "/api/placeholder/400/225",
    slug: "technology-advances-reshape-workplace"
  }
];