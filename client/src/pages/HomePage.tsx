import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useQuery } from "@tanstack/react-query";
import TopHeadlinesSlider from "@/components/TopHeadlinesSlider";
import ArticleCard from "@/components/ArticleCard";
import CategorySidebar from "@/components/CategorySidebar";
import { fetchLatestNews, convertToArticle } from "@/lib/newsApi";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const articlesRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Fetch articles from NewsData API
  const { data: newsArticles = [], isLoading } = useQuery({
    queryKey: ["latest-news"],
    queryFn: () => fetchLatestNews(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes for real-time updates
  });

  const articles = newsArticles.map(convertToArticle);

  useEffect(() => {
    // GSAP animations for article cards entrance
    if (articlesRef.current && articles.length > 0) {
      const cards = articlesRef.current.querySelectorAll('.article-card');
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
          scrollTrigger: {
            trigger: articlesRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Sidebar animation
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
          ease: "power3.out",
          scrollTrigger: {
            trigger: sidebarRef.current,
            start: "top 85%",
          }
        }
      );
    }
  }, [articles]);

  return (
    <div className="min-h-screen">
      {/* Top Headlines Banner Slider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6">
        <TopHeadlinesSlider />
      </div>

      {/* Main Content with Fixed Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Recent News Section */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 md:mb-8">Recent News</h2>
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

          {/* Fixed Categories Sidebar - Hidden on mobile, sticky on desktop */}
          <div ref={sidebarRef} className="w-full lg:w-80 lg:sticky lg:top-24 lg:h-fit">
            <CategorySidebar />
          </div>
        </div>
      </div>
    </div>
  );
}