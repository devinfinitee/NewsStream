import { useEffect, useRef } from "react";
import { useRoute } from "wouter";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArticleCard from "@/components/ArticleCard";
import CategorySidebar from "@/components/CategorySidebar";
import { mockArticles, type Category } from "@shared/news-schema";

gsap.registerPlugin(ScrollTrigger);

export default function CategoryPage() {
  const [match, params] = useRoute("/category/:category");
  const articlesRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const category = params?.category as string;
  const categoryTitle = category ? category.charAt(0).toUpperCase() + category.slice(1) : "";

  // Filter articles by category
  const filteredArticles = mockArticles.filter(
    article => article.category.toLowerCase() === category?.toLowerCase()
  );

  useEffect(() => {
    // GSAP animations for page entrance
    if (articlesRef.current) {
      const cards = articlesRef.current.querySelectorAll('.article-card');
      gsap.fromTo(cards,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
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
          ease: "power2.out",
        }
      );
    }
  }, [category]);

  if (!match) return null;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Articles Section */}
          <div className="lg:col-span-3">
            <h1 className="text-3xl font-bold text-foreground mb-8" data-testid={`title-category-${category}`}>
              {categoryTitle} News
            </h1>
            
            {filteredArticles.length > 0 ? (
              <div ref={articlesRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.map((article) => (
                  <ArticleCard 
                    key={article.id} 
                    article={article}
                    className="article-card"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No articles found in this category yet.
                </p>
              </div>
            )}
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