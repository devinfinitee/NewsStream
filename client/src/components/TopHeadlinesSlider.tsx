import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTopHeadlines, fetchLatestNews, convertToArticle } from "@/lib/newsApi";
import { Link } from "wouter";

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600&h=800&fit=crop';

export default function TopHeadlinesSlider() {
  // Fetch top headlines
  const { data: headlines = [], isLoading: headlinesLoading, error: headlinesError } = useQuery({
    queryKey: ["top-headlines"],
    queryFn: () => fetchTopHeadlines("us"),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  });
  
  // Fetch general news as fallback
  const { data: generalNews = [], isLoading: generalLoading } = useQuery({
    queryKey: ["latest-news-slider"],
    queryFn: () => fetchLatestNews(),
    staleTime: 5 * 60 * 1000,
    enabled: headlines.length === 0 && !headlinesLoading,
  });
  
  // Log errors for debugging
  if (headlinesError) {
    console.error('TopHeadlines query error:', headlinesError);
  }

  // Use headlines if available, otherwise use general news
  const newsArticles = headlines.length > 0 ? headlines : generalNews;
  const slides = useMemo(() => newsArticles.map(convertToArticle), [newsArticles]);
  const isLoading = headlinesLoading || generalLoading;
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (slides.length === 0) return;
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [slides.length]);

  if (isLoading) {
    return (
      <div className="w-full h-64 md:h-96 rounded-lg bg-muted animate-pulse" />
    );
  }

  // Show placeholder if no slides yet
  if (slides.length === 0) {
    return (
      <div className="w-full h-56 sm:h-64 md:h-80 lg:h-96 rounded-lg bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Loading headlines...</p>
      </div>
    );
  }

  const current = slides[index];
  const onPrepare = () => {
    try { sessionStorage.setItem(`article:${current.slug}`, JSON.stringify(current)); } catch {}
  };

  return (
    <section className="relative mb-6 md:mb-10 overflow-hidden rounded-lg shadow-lg" data-testid="headlines-slider">
      <Link href={`/article/${current.slug}`} onClick={() => { onPrepare(); window.scrollTo(0, 0); }} className="block">
        <div className="relative w-full h-56 sm:h-64 md:h-80 lg:h-96 group">
          <img
            key={current.slug}
            src={current.imageUrl || DEFAULT_IMAGE}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = DEFAULT_IMAGE; }}
            alt={current.title}
            className="w-full h-full object-cover transition-all duration-1000 ease-in-out group-hover:scale-110 animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent transition-opacity duration-500" />
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 animate-slide-up">
            <h2 className="text-white text-base sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 line-clamp-2 transition-all duration-500 group-hover:text-primary-foreground">
              {current.title}
            </h2>
            <p className="hidden sm:block text-white/90 text-sm md:text-base line-clamp-2 mb-2 md:mb-3 max-w-3xl transition-opacity duration-500">{current.excerpt}</p>
          </div>
        </div>
      </Link>

      {/* Dots */}
      <div className="absolute bottom-3 right-4 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2.5 w-2.5 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
