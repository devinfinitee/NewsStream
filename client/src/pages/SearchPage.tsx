import { useEffect, useRef, useState } from "react";
import { useRoute } from "wouter";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ArticleCard from "@/components/ArticleCard";
import CategorySidebar from "@/components/CategorySidebar";
import { searchNews, convertToArticle } from "@/lib/newsApi";

gsap.registerPlugin(ScrollTrigger);

export default function SearchPage() {
  const [match, params] = useRoute("/search");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentQuery, setCurrentQuery] = useState("");
  const articlesRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Get query from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q) {
      setSearchQuery(q);
      setCurrentQuery(q);
    }
  }, []);

  // Fetch search results from NewsData API
  const { data: newsArticles = [], isLoading } = useQuery({
    queryKey: ["search-news", currentQuery],
    queryFn: () => searchNews(currentQuery),
    enabled: !!currentQuery,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const articles = newsArticles.map(convertToArticle);

  useEffect(() => {
    // GSAP animations for results
    if (articlesRef.current && articles.length > 0) {
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
  }, [articles]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentQuery(searchQuery.trim());
      // Update URL without causing navigation
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (!match) return null;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Search Results Section */}
          <div className="flex-1 min-w-0">
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 md:mb-6">
                {currentQuery ? `Search Results for "${currentQuery}"` : "Search Articles"}
              </h1>
              
              {/* Search Form */}
              <form onSubmit={handleSearch} className="flex items-center gap-0 max-w-2xl">
                <Input
                  type="search"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 h-10 md:h-12 text-sm md:text-base rounded-r-none border-r-0"
                  data-testid="input-search-page"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="h-10 md:h-12 px-4 rounded-l-none"
                  data-testid="button-search-page"
                >
                  <Search className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </form>
            </div>
            
            {currentQuery && (
              <>
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
                ) : articles.length > 0 ? (
                  <div ref={articlesRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {articles.map((article) => (
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
                      No articles found for "{currentQuery}". Try different search terms.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Categories Sidebar */}
          <div ref={sidebarRef} className="w-full lg:w-80 lg:sticky lg:top-24 lg:h-fit">
            <CategorySidebar />
          </div>
        </div>
      </div>
    </div>
  );
}