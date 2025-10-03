import { useEffect, useRef } from "react";
import { useRoute } from "wouter";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useQuery } from "@tanstack/react-query";
import ArticleCard from "@/components/ArticleCard";
import CategorySidebar from "@/components/CategorySidebar";
import { fetchNewsByCategory, convertToArticle } from "@/lib/newsApi";

gsap.registerPlugin(ScrollTrigger);

export default function CategoryPage() {
  const [match, params] = useRoute("/category/:category");
  const articlesRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const category = params?.category as string;
  // Fetch articles by category from NewsData API
  const { data: newsArticles = [], isLoading } = useQuery({
    queryKey: ["category-news", category],
    queryFn: () => fetchNewsByCategory(category),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  const articles = newsArticles.map(convertToArticle);

  useEffect(() => {
    const timer = setTimeout(() => {
      // GSAP animations for page entrance
      if (articlesRef.current && articles.length > 0) {
        const cards = articlesRef.current.querySelectorAll('.article-card');
        if (cards.length > 0) {
          gsap.fromTo(cards,
            {
              opacity: 0,
              y: 30,
              scale: 0.95
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.08,
              ease: "power2.out",
            }
          );
        }
      }

      if (sidebarRef.current) {
        gsap.fromTo(sidebarRef.current,
          {
            opacity: 0,
            x: 30
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: 0.2,
            ease: "power3.out",
          }
        );
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [category, articles]);

  if (!match) return null;

  return (
    <div className="min-h-screen">
      {/* Main Content with Fixed Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Articles Section */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 md:mb-8 capitalize">{category} News</h2>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted rounded-lg h-40 md:h-48 mb-4"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No articles found in this category yet.</p>
              </div>
            ) : (
              <div ref={articlesRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {articles.map((article) => (
                  <ArticleCard 
                    key={article.id} 
                    article={article}
                    className="article-card"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Fixed Categories Sidebar */}
          <div ref={sidebarRef} className="w-full lg:w-80 lg:sticky lg:top-24 lg:h-fit">
            <CategorySidebar />
          </div>
        </div>
      </div>
    </div>
  );
}