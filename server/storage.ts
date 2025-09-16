import { type User, type InsertUser, type Article, type InsertArticle, type UpdateArticle } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Article methods
  getAllArticles(): Promise<Article[]>;
  getArticleById(id: string): Promise<Article | undefined>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getArticlesByCategory(category: string): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, article: UpdateArticle): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<boolean>;
  searchArticles(query: string): Promise<Article[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private articles: Map<string, Article>;

  constructor() {
    this.users = new Map();
    this.articles = new Map();
    this.seedArticles();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Article methods
  async getAllArticles(): Promise<Article[]> {
    return Array.from(this.articles.values()).sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async getArticleById(id: string): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    return Array.from(this.articles.values()).find(article => article.slug === slug);
  }

  async getArticlesByCategory(category: string): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.category.toLowerCase() === category.toLowerCase())
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = randomUUID();
    const now = new Date();
    const article: Article = {
      ...insertArticle,
      id,
      publishedAt: insertArticle.publishedAt || now,
      createdAt: now,
      updatedAt: now,
    };
    this.articles.set(id, article);
    return article;
  }

  async updateArticle(id: string, updateArticle: UpdateArticle): Promise<Article | undefined> {
    const existing = this.articles.get(id);
    if (!existing) return undefined;

    const updated: Article = {
      ...existing,
      ...updateArticle,
      updatedAt: new Date(),
    };
    this.articles.set(id, updated);
    return updated;
  }

  async deleteArticle(id: string): Promise<boolean> {
    return this.articles.delete(id);
  }

  async searchArticles(query: string): Promise<Article[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.articles.values())
      .filter(article => 
        article.title.toLowerCase().includes(lowercaseQuery) ||
        article.content.toLowerCase().includes(lowercaseQuery) ||
        article.excerpt.toLowerCase().includes(lowercaseQuery) ||
        article.author.toLowerCase().includes(lowercaseQuery)
      )
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  private seedArticles() {
    const sampleArticles: InsertArticle[] = [
      {
        title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
        excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing",
        category: "Politics",
        author: "John Smith",
        imageUrl: "/api/placeholder/800/450",
        slug: "lorem-ipsum-dolor-sit-amet",
        publishedAt: new Date('2024-01-15'),
      },
      {
        title: "Reegelteemi irimtio siretien genies",
        content: "Reegelteemi irimtio siretien genies consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
        excerpt: "Reegelteemi irimtio siretien genies",
        category: "Tech", 
        author: "Sarah Johnson",
        imageUrl: "/api/placeholder/800/450",
        slug: "reegelteemi-irimtio-siretien-genies",
        publishedAt: new Date('2024-01-14'),
      },
      {
        title: "Technology advances reshape modern workplace dynamics",
        content: "The rapid evolution of technology continues to transform how we work, communicate, and collaborate in professional environments across various industries. From artificial intelligence to remote collaboration tools, the modern workplace is undergoing unprecedented changes.\n\nCompanies are adapting to new paradigms of productivity, employee engagement, and operational efficiency. This transformation affects not only how work gets done but also the fundamental relationship between employers and employees in the digital age.",
        excerpt: "Technology advances reshape modern workplace dynamics",
        category: "Tech",
        author: "Mike Chen", 
        imageUrl: "/api/placeholder/800/450",
        slug: "technology-advances-reshape-workplace",
        publishedAt: new Date('2024-01-13'),
      },
      {
        title: "Breaking: Major Sports Championship Results Announced",
        content: "In a thrilling conclusion to this year's championship series, teams from across the nation competed in what many are calling one of the most exciting tournaments in recent history. The final scores were closer than anticipated, with several matches going into overtime.\n\nFans gathered in stadiums and watched from home as their favorite teams battled for supremacy. The athletic performances displayed throughout the tournament showcase the incredible dedication and skill of today's professional athletes.",
        excerpt: "Major championship results announced after thrilling tournament",
        category: "Sports",
        author: "Alex Rodriguez",
        imageUrl: "/api/placeholder/800/450", 
        slug: "major-sports-championship-results",
        publishedAt: new Date('2024-01-12'),
      },
      {
        title: "Entertainment Industry Embraces New Digital Platforms",
        content: "The entertainment landscape is rapidly evolving as streaming services, social media platforms, and digital content creators reshape how audiences consume media. Traditional broadcasters are adapting their strategies to compete in this new ecosystem.\n\nFrom independent creators gaining massive followings to established studios launching direct-to-consumer platforms, the industry is witnessing a fundamental shift in content distribution and audience engagement patterns.",
        excerpt: "Entertainment industry adapts to digital platform revolution",
        category: "Entertainment", 
        author: "Emma Watson",
        imageUrl: "/api/placeholder/800/450",
        slug: "entertainment-digital-platforms",
        publishedAt: new Date('2024-01-11'),
      }
    ];

    sampleArticles.forEach(article => {
      const id = randomUUID();
      const now = new Date();
      const fullArticle: Article = {
        ...article,
        id,
        createdAt: now,
        updatedAt: now,
      };
      this.articles.set(id, fullArticle);
    });
  }
}

export const storage = new MemStorage();
