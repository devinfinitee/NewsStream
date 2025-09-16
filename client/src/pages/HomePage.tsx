import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useQuery } from "@tanstack/react-query";
import HeroSection from "@/components/HeroSection";
import ArticleCard from "@/components/ArticleCard";
import CategorySidebar from "@/components/CategorySidebar";
import type { Article } from "@shared/schema";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const articlesRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Fetch articles from API
  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  useEffect(() => {
    // GSAP animations for article cards entrance
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
          scrollTrigger: {
            trigger: articlesRef.current,
            start: "top 80%",
          }
        }
      );
    }

    // Sidebar animation
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
          scrollTrigger: {
            trigger: sidebarRef.current,
            start: "top 80%",
          }
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection 
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
        subtitle="Stay informed with the latest breaking news and comprehensive coverage"
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Recent News Section */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-foreground mb-8">Recent News</h2>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted rounded-lg h-48 mb-4"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div ref={articlesRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Categories Sidebar */}
          <div ref={sidebarRef} className="lg:col-span-1">
            <CategorySidebar />
          </div>
        </div>
      </div>
    </div>
  );
}