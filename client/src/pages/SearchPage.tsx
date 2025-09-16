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
import type { Article } from "@shared/schema";

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

  // Fetch search results from API
  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles/search", currentQuery],
    queryFn: () => fetch(`/api/articles/search?q=${encodeURIComponent(currentQuery)}`).then(res => res.json()),
    enabled: !!currentQuery,
  });

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Search Results Section */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-6">
                {currentQuery ? `Search Results for "${currentQuery}"` : "Search Articles"}
              </h1>
              
              {/* Search Form */}
              <form onSubmit={handleSearch} className="relative max-w-2xl">
                <Input
                  type="search"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-12 text-lg h-12"
                  data-testid="input-search-page"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-10 w-10"
                  data-testid="button-search-page"
                >
                  <Search className="h-5 w-5" />
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
          <div ref={sidebarRef} className="lg:col-span-1">
            <CategorySidebar />
          </div>
        </div>
      </div>
    </div>
  );
}