import { useEffect, useRef } from "react";
import { useRoute, Link } from "wouter";
import { gsap } from "gsap";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CategorySidebar from "@/components/CategorySidebar";
import type { Article } from "@shared/schema";
import articleImage1 from "@assets/generated_images/Corporate_building_article_image_8b8034ea.png";
import articleImage2 from "@assets/generated_images/City_skyline_article_image_2c04a75a.png";

// TODO: Remove mock image mapping when real images are available
const imageMap: Record<string, string> = {
  "1": articleImage1,
  "2": articleImage2,
  "3": articleImage1,
};

export default function ArticlePage() {
  const [match, params] = useRoute("/article/:slug");
  const contentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const slug = params?.slug;
  
  // Fetch article by slug from API
  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: ["/api/articles", slug],
    queryFn: () => fetch(`/api/articles/${slug}`).then(res => res.json()),
    enabled: !!slug,
  });

  useEffect(() => {
    // GSAP animations for page entrance
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        }
      );
    }

    if (sidebarRef.current) {
      gsap.fromTo(sidebarRef.current,
        {
          opacity: 0,
          x: 20
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power2.out",
        }
      );
    }
  }, [slug]);

  if (!match) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="animate-pulse">
                <div className="h-8 bg-muted rounded mb-6 w-20"></div>
                <div className="h-6 bg-muted rounded mb-4 w-16"></div>
                <div className="h-12 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2 w-48"></div>
                <div className="h-64 bg-muted rounded mb-8"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                  <div className="h-4 bg-muted rounded w-4/5"></div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="animate-pulse h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The article you're looking for doesn't exist or has been moved.
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const imageUrl = imageMap[article.id] || articleImage1;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Article Content */}
          <div ref={contentRef} className="lg:col-span-3">
            {/* Back Button */}
            <Link href="/">
              <Button variant="ghost" className="mb-6" data-testid="button-back-home">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>

            <article>
              {/* Article Header */}
              <header className="mb-8">
                <Badge variant="secondary" className="mb-4" data-testid={`badge-category-${article.category}`}>
                  {article.category}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight" data-testid="text-article-title">
                  {article.title}
                </h1>
                <div className="flex items-center gap-6 text-muted-foreground text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span data-testid="text-article-author">{article.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span data-testid="text-article-date">
                      {new Date(article.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </header>

              {/* Article Image */}
              <div className="mb-8">
                <img
                  src={imageUrl}
                  alt={article.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg"
                  data-testid="img-article-main"
                />
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none" data-testid="text-article-content">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {article.excerpt}
                </p>
                <div className="text-foreground leading-relaxed">
                  {article.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </article>
          </div>

          {/* Categories Sidebar */}
          <div ref={sidebarRef} className="lg:col-span-1">
            <CategorySidebar />
          </div>
        </div>
      </div>
    </div>
  );
}