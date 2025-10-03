import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X } from "lucide-react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import type { Category } from "@shared/news-schema";

const categories: Category[] = ["Politics", "Sports", "Tech", "Entertainment"];

export default function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(headerRef.current, 
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page using wouter
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(searchQuery.trim())}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <header ref={headerRef} className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0" data-testid="link-home">
            <h1 className="text-xl font-bold text-foreground">INFINITE NEWS</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === "/" ? "text-primary" : "text-muted-foreground"
              }`}
              data-testid="link-nav-home"
            >
              Home
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/category/${category.toLowerCase()}`}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === `/category/${category.toLowerCase()}`
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
                data-testid={`link-category-${category.toLowerCase()}`}
              >
                {category}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center">
            <form onSubmit={handleSearch} className="flex items-center gap-0">
              <Input
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 h-9 rounded-r-none border-r-0 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                data-testid="input-search"
              />
              <Button
                type="submit"
                size="sm"
                className="h-9 px-3 rounded-l-none"
                data-testid="button-search"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 animate-in slide-in-from-top duration-300">
            <form onSubmit={handleSearch} className="flex items-center gap-0">
              <Input
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 h-10 rounded-r-none border-r-0 text-sm"
                data-testid="input-search-mobile"
              />
              <Button
                type="submit"
                size="sm"
                className="h-10 px-3 rounded-l-none"
                data-testid="button-search-mobile"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
            <nav className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/category/${category.toLowerCase()}`}
                  className={`block py-2 text-sm font-medium transition-colors hover:text-primary ${
                    location === `/category/${category.toLowerCase()}`
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  data-testid={`link-category-mobile-${category.toLowerCase()}`}
                >
                  {category}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}