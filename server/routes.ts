import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertArticleSchema, updateArticleSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Article routes

  // GET /api/articles - Get all articles
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getAllArticles();
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  // GET /api/articles/search?q=query - Search articles
  app.get("/api/articles/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }
      
      const articles = await storage.searchArticles(query);
      res.json(articles);
    } catch (error) {
      console.error("Error searching articles:", error);
      res.status(500).json({ error: "Failed to search articles" });
    }
  });

  // GET /api/articles/category/:category - Get articles by category
  app.get("/api/articles/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      if (!category) {
        return res.status(400).json({ error: "Category parameter is required" });
      }
      
      const articles = await storage.getArticlesByCategory(category);
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles by category:", error);
      res.status(500).json({ error: "Failed to fetch articles by category" });
    }
  });

  // GET /api/articles/:slug - Get single article by slug
  app.get("/api/articles/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      if (!slug) {
        return res.status(400).json({ error: "Slug parameter is required" });
      }
      
      const article = await storage.getArticleBySlug(slug);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  // POST /api/articles - Create new article
  app.post("/api/articles", async (req, res) => {
    try {
      const validatedData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Error creating article:", error);
      res.status(500).json({ error: "Failed to create article" });
    }
  });

  // PUT /api/articles/:id - Update article
  app.put("/api/articles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Article ID is required" });
      }
      
      const validatedData = updateArticleSchema.parse(req.body);
      const article = await storage.updateArticle(id, validatedData);
      
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      res.json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Error updating article:", error);
      res.status(500).json({ error: "Failed to update article" });
    }
  });

  // DELETE /api/articles/:id - Delete article
  app.delete("/api/articles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Article ID is required" });
      }
      
      const deleted = await storage.deleteArticle(id);
      if (!deleted) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting article:", error);
      res.status(500).json({ error: "Failed to delete article" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
