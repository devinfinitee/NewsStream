import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTopHeadlines, convertToArticle } from "@/lib/newsApi";
import { Link } from "wouter";

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600&h=800&fit=crop';

export default function TopHeadlinesSlider() {
  const { data: headlines = [], isLoading } = useQuery({
    queryKey: ["top-headlines"],
    queryFn: () => fetchTopHeadlines("us"),
    staleTime: 5 * 60 * 1000,
  });

  const slides = useMemo(() => headlines.map(convertToArticle), [headlines]);
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

  if (slides.length === 0) return null;

  const current = slides[index];
  const onPrepare = () => {
    try { sessionStorage.setItem(`article:${current.slug}`, JSON.stringify(current)); } catch {}
  };

  return (
    <section className="relative mb-6 md:mb-10 overflow-hidden rounded-lg shadow-lg">
      <Link href={`/article/${current.slug}`} onClick={onPrepare} className="block">
        <div className="relative w-full h-56 sm:h-64 md:h-80 lg:h-96 group">
          <img
            src={current.imageUrl || DEFAULT_IMAGE}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = DEFAULT_IMAGE; }}
            alt={current.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6">
            <h2 className="text-white text-base sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 line-clamp-2 transition-all duration-300 group-hover:text-primary-foreground">
              {current.title}
            </h2>
            <p className="hidden sm:block text-white/90 text-sm md:text-base line-clamp-2 mb-2 md:mb-3 max-w-3xl">{current.excerpt}</p>
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
